import apiClient from './api';

export const resultService = {
  getResults: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(
      `/results${query ? '?' + query : ''}`
    );
    return response.data.data || [];
  },

  getResultsByYear: async (year) => {
    const response = await apiClient.get(`/results?year=${year}`);
    return response.data.data || [];
  },

  getResultsByType: async (resultType) => {
    const response = await apiClient.get(
      `/results?resultType=${resultType}`
    );
    return response.data.data || [];
  },

  createResult: async (resultData) => {
    const response = await apiClient.post('/results', resultData);
    return response.data;
  },

  updateResult: async (id, resultData) => {
    const response = await apiClient.put(`/results/${id}`, resultData);
    return response.data;
  },

  deleteResult: async (id) => {
    await apiClient.delete(`/results/${id}`);
  },
};
