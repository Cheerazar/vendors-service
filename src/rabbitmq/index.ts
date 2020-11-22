import { createConnection } from './createConnection';

export async function setUpRabbit() {
  try {
    const connection = await createConnection();
  } catch (error) {
    console.error(`Error initializing RabbitMQ: ${error.message}`);
  }
}
