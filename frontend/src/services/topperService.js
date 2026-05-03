import apiClient from './api';

export const topperService = {
  getToppers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(
      `/toppers${query ? `?${query}` : ''}`
    );
    return response.data.data || [];
  },

  getToppersbyYear: async (year) => {
    const response = await apiClient.get(`/toppers?year=${year}`);
    return response.data.data || [];
  },

  getToppersbyType: async (topperType) => {
    const response = await apiClient.get(
      `/toppers?topperType=${topperType}`
    );
    return response.data.data || [];
  },

  createTopper: async (topperData) => {
    const response = await apiClient.post('/toppers', topperData);
    return response.data;
  },

  updateTopper: async (id, topperData) => {
    const response = await apiClient.put(`/toppers/${id}`, topperData);
    return response.data;
  },

  deleteTopper: async (id) => {
    await apiClient.delete(`/toppers/${id}`);
  },
};
