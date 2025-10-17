import axios from 'axios';

class AuthService {
  isAuthenticated() {
    // Check if the user has a valid JWT token
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    return true;
  }

  async login(values: { identifier: string; password: string }) {
    const apiUrl =
      import.meta.env.VITE_STRAPI_URL ||
      'https://github.com/tdhungit/strapi-crm-api';
    const response = await axios.post(`${apiUrl}/api/auth/local`, {
      identifier: values.identifier,
      password: values.password,
    });
    // Save JWT token or handle login state here
    localStorage.setItem('authToken', response.data.jwt);
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}

export default new AuthService();
