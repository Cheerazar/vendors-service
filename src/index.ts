import bodyParser from 'body-parser';

import { app } from './server';
import { vendorsRouter } from './vendors';

import 'reflect-metadata';
import { getDbConnection } from './db';
import { receiveEvents } from './rabbitmq/events/receiveEvents';

// receiveEvents();
const { PORT_NUMBER = 3017 } = process.env;
getDbConnection();
app.use(bodyParser.json());
app.use(vendorsRouter);

app.listen(PORT_NUMBER, () => console.log(`Listening on PORT: ${PORT_NUMBER}`));
