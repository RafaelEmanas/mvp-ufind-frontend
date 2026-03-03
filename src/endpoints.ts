import { environment } from './environment';

export const API_ENDPOINTS = {
  ITEM: `${environment.apiUrl}/item`,
  REGISTER: `${environment.apiUrl}/auth/register`,
  LOGIN: `${environment.apiUrl}/auth/login`,
  LOGOUT: `${environment.apiUrl}/auth/logout`,
  USER: `${environment.apiUrl}/auth/me`
};