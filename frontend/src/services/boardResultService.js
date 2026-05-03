import apiClient from './api';

const normalizeBoardResult = (result) => {
  const highestSubjectScore = Math.max(
    ...(result.subjects || []).map((subject) => Number(subject.highestScore || 0)),
    0
  );

  return {
    ...result,
    highestPercentageInStream:
      result.highestPercentageInStream || highestSubjectScore || result.topScore || 0,
  };
};

export const boardResultService = {
  getBoardResults: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(
      `/board-results${query ? `?${query}` : ''}`
    );
    return (response.data.data || []).map(normalizeBoardResult);
  },
  createBoardResult: async (data) => {
    const response = await apiClient.post('/board-results', data);
    return response.data;
  },
  updateBoardResult: async (id, data) => {
    const response = await apiClient.put(`/board-results/${id}`, data);
    return response.data;
  },
  deleteBoardResult: async (id) => {
    await apiClient.delete(`/board-results/${id}`);
  },
};
