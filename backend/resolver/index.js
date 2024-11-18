import { ObjectId } from 'mongodb';
import db from '../db.js';

import toDoResolvers from './type/Todo.js';
import listResolvers from './type/List.js';

export default {
  ...toDoResolvers,
  ...listResolvers,
};
