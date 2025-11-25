import express from 'express';
import route from './src/routes/index.js'
import { initDb } from './src/config/dbConfig.js';

const app = express();

const App = async () => {
  await initDb();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  route(app);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('App is now running at port ', port)
  })
};

App().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});