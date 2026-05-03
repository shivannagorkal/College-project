import apiClient from './api';

const normalizeCompetitiveResult = (result) => ({
  ...result,
  highestScore: result.highestScore || result.topScore || 0,
});

export const competitiveResultService = {
  getCompetitiveResults: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(
      `/results${query ? '?' + query : ''}`
    );
    return (response.data.data || [])
      .filter((result) => result.resultType !== 'Board')
      .map(normalizeCompetitiveResult);
  },
  createCompetitiveResult: async (data) => {
    const response = await apiClient.post('/results', data);
    return response.data;
  },
  updateCompetitiveResult: async (id, data) => {
    const response = await apiClient.put(
      `/results/${id}`, data
    );
    return response.data;
  },
  deleteCompetitiveResult: async (id) => {
    await apiClient.delete(`/results/${id}`);
  },
};
