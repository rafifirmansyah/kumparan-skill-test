import db from '../db/pgPromise.js';
import Articles from '../models/Articles.js';
import { check, validationResult } from 'express-validator';
import cache from '../db/nodeCache.js';

const ArticlesController = {
    createValidation: [
        check('author')
            .notEmpty()
            .withMessage('The author is required.'),
        check('title')
            .notEmpty()
            .withMessage('The title is required.'),
        check('body')
            .notEmpty()
            .withMessage('The body is required.'),
    ],

    async create(req, res) {
        try {
            // Validation
            const errors = validationResult(req);
    
            // If validation fails
            if (!errors.isEmpty()) {
                return res.status(422).json(errors.mapped());
            }
            
            // Data from request
            const data = {
                author: req.body.author,
                title: req.body.title,
                body: req.body.body
            };

            // Transaction Article 
            await db.tx(async transaction => {
                // Insert Article to PostgreSQL
                const article = await Articles.insert(transaction, data);

                // Add id and created_at
                data.id = article.id;
                data.created_at = article.created_at;

                // Insert Article to ElasticSearch
                await Articles.insertToElasticSearch(data);
            });

            // If has cache, remove it
            if (cache.has('articles')) {
                cache.del('articles');
            }
    
            // Send response success
            return res.status(201).json({
                status: 'Success',
                message: 'Article successfully created.'
            });
        } catch (error) {
            // Send response failed
            return res.status(500).json({
                status: 'Failed',
                message: 'Internal Server Error.'
            });
        }
    },

    async getAll(req, res) {
        try {
            const { query, author } = req.query;

            let articles = [];

            // User when searching and filtering
            if (query && author) {
                const dataFromElasticSearch = await Articles.getAllWithSearchAndFilterAuthorElasticSearch(query, author);

                if (dataFromElasticSearch.hits.hits.length) {
                    articles = dataFromElasticSearch.hits.hits.map(data => {
                        return data._source;
                    });
                }
            } 
            // User when searching
            else if (query) {
                const dataFromElasticSearch = await Articles.getAllWithSearchElasticSearch(query);

                if (dataFromElasticSearch.hits.hits.length) {
                    articles = dataFromElasticSearch.hits.hits.map(data => {
                        return data._source;
                    });
                }
            }
            // User when filtering
            else if (author) {
                const dataFromElasticSearch = await Articles.getAllWithFilterAuthorElasticSearch(author);

                if (dataFromElasticSearch.hits.hits.length) {
                    articles = dataFromElasticSearch.hits.hits.map(data => {
                        return data._source;
                    });
                }
            }
            // User when not using the search and filter features
            else {
                const dataFromElasticSearch = await Articles.getAllElasticSearch();

                // If data has cache, get from cache. Otherwise get from elasticsearch and set data to cache 
                if (cache.has('articles')) {
                    articles = cache.get('articles');
                    console.log('ada cache');
                } else {
                    if (dataFromElasticSearch.hits.hits.length) {
                        articles = dataFromElasticSearch.hits.hits.map(data => {
                            return data._source;
                        });

                        cache.set('articles', articles);
                    }

                    console.log('tidak ada cache');
                }
            }
            
            // Send response success
            return res.status(200).json({
                status: 'Success',
                data: articles
            });
        } catch (error) {
            // Send response failed
            return res.status(500).json({
                status: 'Failed',
                message: 'Internal Server Error.'
            });
        }
    }

}

export default ArticlesController;
