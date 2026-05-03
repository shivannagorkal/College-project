import apiClient from './api';

export const galleryService = {
  getImages: async () => {
    const response = await apiClient.get('/gallery');
    return response.data.data || [];
  },

  getImagesByCategory: async (category) => {
    const response = await apiClient.get(`/gallery?category=${category}`);
    return response.data.data || [];
  },

  createImage: async (imageData) => {
    const response = await apiClient.post('/gallery', imageData);
    return response.data;
  },

  // ✅ Add this alias
  createGallery: async (imageData) => {
    const response = await apiClient.post('/gallery', imageData);
    return response.data;
  },

  updateImage: async (id, imageData) => {
    const response = await apiClient.put(`/gallery/${id}`, imageData);
    return response.data;
  },

  // ✅ Add this alias
  updateGallery: async (id, imageData) => {
    const response = await apiClient.put(`/gallery/${id}`, imageData);
    return response.data;
  },

  deleteImage: async (id) => {
    await apiClient.delete(`/gallery/${id}`);
  },

  // ✅ Add this alias
  deleteGallery: async (id) => {
    await apiClient.delete(`/gallery/${id}`);
  },
};