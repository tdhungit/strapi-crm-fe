import { defaultMenus } from '../config/menus';
import ApiService from './ApiService';

class MenuService {
  async getAppSettings() {
    const res = await ApiService.request('get', '/settings/app');
    // save to local storage
    localStorage.setItem('strapi-crm', JSON.stringify(res));

    if (!res.init && res.menus) {
      return res;
    }

    const menus: any[] = [];
    const mainMenus = res?.menus || [];
    if (mainMenus && mainMenus.length > 0) {
      mainMenus.forEach((collection: any) => {
        switch (collection.pluralName) {
          case 'users':
            menus.push(defaultMenus.users);
            break;
          case 'settings':
            menus.push(defaultMenus.settings);
            break;
          default:
            menus.push({
              key: `collections/${collection.pluralName}`,
              icon: 'file-text',
              label: collection.name,
            });
            break;
        }
      });
    } else {
      for (const m in defaultMenus) {
        menus.push(defaultMenus[m]);
      }
    }

    return {
      ...res,
      menus,
    };
  }

  async getAvailableMenuItems() {
    const res = await ApiService.request('get', '/settings/available-menus');
    return res || [];
  }

  async getHiddenMenuItems() {
    const res = await ApiService.request('get', '/settings/hidden-menus');
    return res || [];
  }

  async updateMenuWeights(itemsWithWeights: any[]) {
    try {
      await ApiService.request('put', '/settings/menus', itemsWithWeights);
      return { success: true };
    } catch (error) {
      console.error('Error updating menu weights:', error);
      throw error;
    }
  }
}

export default new MenuService();
