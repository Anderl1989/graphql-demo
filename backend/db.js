import { MongoClient } from 'mongodb';
import 'dotenv/config';

let db;
try {
  const client = new MongoClient(process.env.MONGO_URI);
  db = client.db('ToDo');
} catch (err) {
  console.error(err);
  process.exit(1); // quit process in case DB connection fails
}

export default db;
