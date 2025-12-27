import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = async (skip = 0, limit = 30, category = '') => {
  try {
    const url = category
      ? `${API_BASE_URL}/products/category/${category}?skip=${skip}&limit=${limit}`
      : `${API_BASE_URL}/products?skip=${skip}&limit=${limit}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/products/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

