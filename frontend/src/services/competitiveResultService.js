import apiClient from './api';

const normalizeCompetitiveResult = (result) => ({
  ...result,
  highestScore: result.highestScore || result.topScore || 0,
});

export const competitiveResultService = {
  getCompetitiveResults: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(
      `/competitive-results${query ? `?${query}` : ''}`
    );
    return (response.data.data || []).map(normalizeCompetitiveResult);
  },
  createCompetitiveResult: async (data) => {
    const response = await apiClient.post('/competitive-results', data);
    return response.data;
  },
  updateCompetitiveResult: async (id, data) => {
    const response = await apiClient.put(
      `/competitive-results/${id}`, data
    );
    return response.data;
  },
  deleteCompetitiveResult: async (id) => {
    await apiClient.delete(`/competitive-results/${id}`);
  },
};
