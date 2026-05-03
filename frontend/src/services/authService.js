import apiClient from './api';

export const authService = {
  // login: async (email, password) => {
  //   const response = await apiClient.post('/auth/login', { email, password });
  //   const token = response.data?.token 
  //     || response.data?.data?.token 
  //     || response.data?.data;
  //   return token;;
  // },
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('FULL RESPONSE:', response.data); // ← add this line
    return response.data?.data?.token;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};
