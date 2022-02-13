import app from '../app.js';
import supertest from 'supertest';

const request = supertest(app);

describe('Running test to get a list of articles', () => {
    it('Get a list of articles', async() => {
        const data = {
            query: "COVID-19",
            author: "kumparanNEWS",
        };
        
        const response = await Promise.resolve(request.get('/articles').query(data));

        // Success response
        expect(response.status).toBe(200);
        // Data available
        expect(response.body.data.length).toBeTruthy();
    });
});