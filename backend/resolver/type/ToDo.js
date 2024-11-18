import { ObjectId } from 'mongodb';
import db from '../../db.js';
import { List } from './List.js';

export class ToDo {
  constructor(todo) {
    this._id = todo._id
    this.message = todo.message;
    this.list_id = todo.list_id;
  }

  // field resolver
  async list() {
    const list = await db.collection('list').findOne({ _id: new ObjectId(this.list_id) });
    return list ? new List(list) : null;
  }
}

// resolvers
export default {
  // queries
  async toDos({ list_id }) {
    const toDos = await db.collection('todo').find(list_id ? { list_id: new ObjectId(list_id) } : {}).toArray();
    return toDos.map(toDo => new ToDo(toDo));
  },
  async toDo({ id }) {
    const toDo = await db.collection('todo').findOne({ _id: new ObjectId(id) });
    return toDo ? new ToDo(toDo) : null;
  },

  // mutations
  async createToDo({ input }) {
    input.list_id = new ObjectId(input.list_id); // make sure to convert ID fields to ObjectId before saving to DB
    const insertion = await db.collection('todo').insertOne(input);
    if (insertion.acknowledged) {
      const toDo = await db.collection('todo').findOne({ _id: insertion.insertedId });
      return toDo ? new ToDo(toDo) : null;
    } else {
      throw new Error('Insertion failed');
    }
  },
  async updateToDo({ id, input }) {
    if (input.list_id) input.list_id = new ObjectId(input.list_id); // make sure to convert ID fields to ObjectId before saving to DB
    const updated = await db.collection('todo').updateOne({ _id: new ObjectId(id) }, { $set: input });
    if (updated.modifiedCount === 1) {
      const toDo = await db.collection('todo').findOne({ _id: insertion.insertedId });
      return toDo ? new ToDo(toDo) : null;
    } else {
      throw new Error(`ToDo ${id} not found`);
    }
  },
  async deleteToDo({ id }) {
    const deleted = await db.collection('todo').deleteOne({ _id: new ObjectId(id) });
    return deleted.deletedCount === 1;
  },
};