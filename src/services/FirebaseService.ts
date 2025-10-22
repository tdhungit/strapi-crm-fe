import { initializeApp } from 'firebase/app';
import {
  equalTo,
  getDatabase,
  onChildAdded,
  onValue,
  orderByChild,
  query,
  ref,
  update,
} from 'firebase/database';
import ApiService from './ApiService';

class FirebaseService {
  static instance: FirebaseService | null = null;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async getApp() {
    const settings = await ApiService.request('get', '/settings/system', {
      name: 'firebase',
    });

    const setting = settings?.firebase;
    if (!setting) {
      throw new Error('Firebase settings not found');
    }

    const app = initializeApp(setting);
    const db = getDatabase(app);
    return {
      db,
      ref,
      onValue,
      onChildAdded,
      update,
      query,
      orderByChild,
      equalTo,
    };
  }
}

export default FirebaseService.getInstance();
