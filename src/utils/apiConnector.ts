import { toast } from 'react-toastify';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (config.requiresAuth !== false) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    delete config.requiresAuth;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && error.config.url !== `${BASE_URL}/api/v1/users/sign_in`) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
      toast.error('Session expired. Please log in again.');
    } else if (error.response?.status === 500) {
      toast.error('Internal server error');
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (
  method: Method,
  url: string,
  data?: any,
  headers?: any,
  formData?: boolean,
  params?: any,
  requiresAuth: boolean = true
): Promise<AxiosResponse> => {
  return axiosInstance({
    method,
    url: `${BASE_URL}${url}`,
    data: data || null,
    headers: {
      'Content-Type': formData ? 'multipart/form-data' : 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    params: params || null,
    requiresAuth,
  } as AxiosRequestConfig);
};