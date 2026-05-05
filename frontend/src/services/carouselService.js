import apiClient from './api';

export const carouselService = {
  getCarouselImages: async (page) => {
    const response = await apiClient.get(
      `/carousel?page=${page}`
    );
    return response.data.data || [];
  },
  uploadCarouselImage: async (formData) => {
    const response = await apiClient.post('/carousel', formData);
    return response.data;
  },
  deleteCarouselImage: async (id) => {
    await apiClient.delete(`/carousel/${id}`);
  },
};
