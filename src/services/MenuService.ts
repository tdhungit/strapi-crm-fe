import { defaultMenus } from '../config/menus';
import ApiService from './ApiService';

class MenuService {
  async getMenuItems() {
    const res = await ApiService.request('get', '/settings/menus');
    if (!res.init && res.menus) {
      // save to local storage
      localStorage.setItem('menus', JSON.stringify(res.menus));
      return res.menus;
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
    }

    localStorage.setItem('menus', JSON.stringify(menus));
    return menus;
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
