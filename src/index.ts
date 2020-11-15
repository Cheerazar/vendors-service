import bodyParser from 'body-parser';

import { app } from './server';
import { vendorsRouter } from './vendors';

const { PORT_NUMBER = 3017 } = process.env;

app.use(bodyParser.json());
app.use(vendorsRouter);
app.get('/');

app.listen(PORT_NUMBER, () => console.log(`Listening on PORT: ${PORT_NUMBER}`));
