import { ObjectId } from 'mongodb';
import db from '../../db.js';
import { ToDo } from './Todo.js';

export class List {
  constructor(list) {
    this._id = list._id;
    this.name = list.name;
  }

  // field resolver
  async toDos() {
    const toDos = await db.collection('todo').find({ list_id: new ObjectId(this._id) }).toArray();
    return toDos.map(toDo => new ToDo(toDo));
  }
}

// resolvers
export default {
  // queries
  async lists() {
    const lists = await db.collection('list').find({}).toArray();
    return lists.map(list => new List(list));
  },
  async list({ id }) {
    const list = await db.collection('list').findOne({ _id: new ObjectId(id) });
    return list ? new List(list) : null;
  },

  // mutations
  async createList({ input }) {
    const insertion = await db.collection('list').insertOne(input);
    if (insertion.acknowledged) {
      const list = await db.collection('list').findOne({ _id: insertion.insertedId });
      return list ? new List(list) : null;
    } else {
      throw new Error('Insertion failed');
    }
  },
  async updateList({ id, input }) {
    const updated = await db.collection('list').updateOne({ _id: new ObjectId(id) }, { $set: input });
    if (updated.modifiedCount === 1) {
      const list = await db.collection('list').findOne({ _id: insertion.insertedId });
      return list ? new List(list) : null;
    } else {
      throw new Error(`List ${id} not found`);
    }
  },
  async deleteList({ id }) {
    const toDos = await db.collection('todo').deleteMany({ list_id: new ObjectId(id) });
    const deleted = await db.collection('list').deleteOne({ _id: new ObjectId(id) });
    return deleted.deletedCount === 1;
  },
};