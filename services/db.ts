// FIX: The separated import for Dexie and its Table type was causing a TypeScript
// type inference issue where methods on the base Dexie class were not recognized.
// Combining them into a single import statement resolves this issue.
import Dexie, { type Table } from 'dexie';
import type { PersonalContact, UserProfile, Alert, Shelter, SurvivalGuideCache } from '../types';

class AapdaMitraDB extends Dexie {
  personalContacts!: Table<PersonalContact, number>;
  userProfile!: Table<UserProfile, number>;
  alerts!: Table<Alert, number>;
  shelters!: Table<Shelter, number>;
  survivalGuides!: Table<SurvivalGuideCache, string>;

  constructor() {
    super('aapdaMitraDB');
    this.version(1).stores({
      personalContacts: '++id, name, number',
      userProfile: '&id, name, phone, age, gender',
    });
    this.version(2).stores({
      alerts: '++id, type, area, severity',
      shelters: '++id, name, location',
      survivalGuides: '&disasterType', // Primary key is the disasterType
    });
  }
}

export const db = new AapdaMitraDB();