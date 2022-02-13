import elasticSearchClient from  '../db/elasticSearch.js';
import env from 'dotenv';

env.config();

const Articles = {
    insert(transaction, data) {
        return transaction.one(`
            INSERT INTO 
                articles 
                    (author, title, body)
            VALUES
                ($/author/, $/title/, $/body/)
            RETURNING id, created_at`, 
            {  
                author: data.author,
                title: data.title,
                body: data.body
            }
        );
    },

    insertToElasticSearch(data) {
        return elasticSearchClient.index({
            index: process.env.ELASTICSEARCH_INDEX,
            id: data.id,
            body: {
                id: data.id,
                author: data.author,
                title: data.title,
                body: data.body,
                created_at: data.created_at
            }
        });
    },

    getAllElasticSearch() {
        return elasticSearchClient.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                sort: {
                    created_at: {order: "DESC"}
                }
            }
        });
    },

    getAllWithFilterAuthorElasticSearch(author) {
        return elasticSearchClient.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                query: {
                    bool: {
                        must: { 
                            term: { "author.keyword": author }
                        },
                    }
                },
                sort: {
                    created_at: {order: "DESC"}
                }
            }
        });
    },

    getAllWithSearchElasticSearch(query) {
        return elasticSearchClient.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                query: {
                    bool: {
                        should: [
                            { match: { title: query } },
                            { match: { body: query } }
                        ]
                    }
                },
                sort: {
                    created_at: {order: "DESC"}
                }
            }
        });
    },

    getAllWithSearchAndFilterAuthorElasticSearch(query, author) {
        return elasticSearchClient.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                term: { "author.keyword": author }
                            },
                            {
                                bool: {
                                    should: [
                                        { match: { title : query } },
                                        { match: { body: query } },
                                    ],
                                }
                            }
                        ]
                    }
                },
                sort: {
                    created_at: {order: "DESC"}
                }
            }
        });
    }
};

export default Articles;