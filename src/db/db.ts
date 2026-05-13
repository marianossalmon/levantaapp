import Dexie, { type EntityTable } from 'dexie';
import { Survey } from '../types/survey';

const db = new Dexie('LevantaAppDB') as Dexie & {
  surveys: EntityTable<Survey, 'id'>,
};

db.version(1).stores({
  surveys: 'id, clientName, date'
});

export { db };
