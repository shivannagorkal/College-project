import apiClient from './api';

export const announcementService = {
  getAnnouncements: async () => {
    const response = await apiClient.get('/announcements');
    return response.data.data || [];
  },

  getAnnouncementById: async (id) => {
    const response = await apiClient.get(`/announcements/${id}`);
    return response.data.data || {};
  },

  createAnnouncement: async (announcementData) => {
    const response = await apiClient.post('/announcements', announcementData);
    return response.data;
  },

  updateAnnouncement: async (id, announcementData) => {
    const response = await apiClient.put(`/announcements/${id}`, announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    await apiClient.delete(`/announcements/${id}`);
  },
};
