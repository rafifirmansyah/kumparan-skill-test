import elasticSearch from 'elasticsearch';
import env from 'dotenv';

env.config();

const elasticSearchClient = new elasticSearch.Client({
    host: [process.env.ELASTICSEARCH_HOST]
});

export default elasticSearchClient;
