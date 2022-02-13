import app from '../app.js';
import supertest from 'supertest';

const request = supertest(app);

describe('Running test to post a new article', () => {
    it('Post a new article', async() => {
        const data = {
            author: "kumparanTECH",
            title: "Profesor Marketing Sebut Metaverse Facebook ‘Kantong Kotoran’ yang Bakal Gagal",
            body: "Rencana induk Facebook, Meta, untuk membuat dunia virtual metaverse akan gagal, menurut seorang profesor marketing terkemuka. Sang profesor pun menyebut bahwa metaverse hanya \"kantong kotoran raksasa\". <br> Sejak tahun lalu, Facebook telah mengumumkan akan serius menggarap metaverse. Mereka bahkan mengganti nama perusahaan induknya jadi Meta dan mengeluarkan dana 10 miliar dolar AS untuk berinvestasi membuat dunia virtual tersebut. <br> Namun, profesor marketing dari New York University, Scott Galloway, memprediksi bahwa metaverse tidak akan menarik bagi publik. Strategi Mark Zuckerberg untuk mengembangkan dunia virtual pun disebut tidak masuk akal karena pertumbuhan pendapatannya lebih kecil ketimbang investasinya. <br> \"Dia melakukan hal yang tepat secara strategis. Masalahnya adalah taktiknya tidak masuk akal. Orang-orang di alam semesta ini tidak terkesan dengan alam semesta yang dia bayangkan, dan khususnya portalnya,\" kata Galloway dalam podcast Pivot yang diselenggarakan Vox pada pekan lalu."
        };
        
        // Success response
        const response = await Promise.resolve(request.post('/articles').send(data));

        expect(response.status).toBe(201);
    });
});
