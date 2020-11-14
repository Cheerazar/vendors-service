import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const { PORT_NUMBER = 3000 } = process.env;

app.use(bodyParser.json());
app.get('/');

app.listen(PORT_NUMBER, () => console.log(`Listening on PORT: ${PORT_NUMBER}`));
