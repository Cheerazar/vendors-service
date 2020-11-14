import express from 'express';

const app = express();

const { PORT_NUMBER = 3000 } = process.env;

app.get('/');

app.listen(PORT_NUMBER, () => console.log(`Listening on PORT: ${PORT_NUMBER}`));
