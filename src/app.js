import express from 'express';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use(router);

// app.listen(port, () => {
//     console.log(`[server]: Server is running at ${process.env.APP_URL}`);
// });
export default app;
