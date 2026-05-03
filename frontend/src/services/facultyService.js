import apiClient from './api';

export const facultyService = {
  getFaculty: async () => {
    const response = await apiClient.get('/faculty');
    return response.data.data || [];
  },

  getFacultyByDepartment: async (department) => {
    const response = await apiClient.get(`/faculty?department=${department}`);
    return response.data.data || [];
  },

  createFaculty: async (facultyData) => {
    const response = await apiClient.post('/faculty', facultyData);
    return response.data;
  },

  updateFaculty: async (id, facultyData) => {
    const response = await apiClient.put(`/faculty/${id}`, facultyData);
    return response.data;
  },

  deleteFaculty: async (id) => {
    await apiClient.delete(`/faculty/${id}`);
  },
};
