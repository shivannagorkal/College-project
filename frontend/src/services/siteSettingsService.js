import apiClient from './api';

export const siteSettingsService = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data.data || {};
  },
  updateSettings: async (data) => {
    const response = await apiClient.put('/settings', data);
    return response.data;
  },
};
