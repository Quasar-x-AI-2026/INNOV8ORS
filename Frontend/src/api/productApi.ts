import api from './axios';

export const productApi = {
  getMarketSnapshot: async (productName: string) => {
    const response = await api.get(`/products/${productName}/markets`);
    return response.data;
  },

  getPriceTrend: async (productName: string) => {
    const response = await api.get(`/products/${productName}/trend`);
    return response.data;
  },
};