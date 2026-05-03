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
    const query = new URLSearchParams({
      ...params,
      resultType: 'Board',
    }).toString();
    const response = await apiClient.get(
      `/results${query ? '?' + query : ''}`
    );
    return (response.data.data || []).map(normalizeBoardResult);
  },
  createBoardResult: async (data) => {
    const response = await apiClient.post('/results', {
      ...data,
      resultType: 'Board',
    });
    return response.data;
  },
  updateBoardResult: async (id, data) => {
    const response = await apiClient.put(`/results/${id}`, {
      ...data,
      resultType: 'Board',
    });
    return response.data;
  },
  deleteBoardResult: async (id) => {
    await apiClient.delete(`/results/${id}`);
  },
};
