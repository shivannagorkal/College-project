import apiClient from './api';

export const eventService = {
  getEvents: async () => {
    const response = await apiClient.get('/events');
    return response.data.data || [];
  },

  getEventById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data || {};
  },

  createEvent: async (eventData) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    await apiClient.delete(`/events/${id}`);
  },
};
