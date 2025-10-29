import { createClient } from '@supabase/supabase-js';
import ApiService from './ApiService';

class SupabaseService {
  static instance: SupabaseService | null = null;

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  async getApp() {
    const settings = await ApiService.request('get', '/settings/system', {
      name: 'supabase',
    });

    const setting = settings?.supabase;
    if (!setting || !setting.url || !setting.apiKey) {
      throw new Error('Supabase settings not found');
    }

    const app = createClient(setting.url, setting.apiKey);
    return app;
  }
}

export default SupabaseService.getInstance();
