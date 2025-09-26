import { strapi, type StrapiClient } from '@strapi/client';
import axios, { type AxiosRequestConfig } from 'axios';

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private token: string = '';
  private client: StrapiClient;

  private constructor() {
    // Initialize with environment variable or default
    this.baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    this.setToken();

    this.client = strapi({
      baseURL: this.baseUrl + '/api',
      auth: this.token || undefined,
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setToken() {
    this.token = localStorage.getItem('authToken') || '';
  }

  getToken(): string {
    const token = this.token || localStorage.getItem('authToken') || '';
    return token;
  }

  getClient() {
    return this.client;
  }

  async request(method: string, url: string, data?: any, headers: any = {}) {
    data = data || {};
    headers = headers || {};
    const config: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}/api${url}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (method.toLowerCase() === 'get') {
      config.params = data; // For GET requests, use params  object
    } else {
      config.data = data; // For POST, PUT, DELETE requests, use data object
    }

    const res = await axios.request(config);
    return res.data;
  }
}

export default ApiService.getInstance();
