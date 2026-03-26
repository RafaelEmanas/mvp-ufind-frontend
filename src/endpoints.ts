import { environment } from './environment';

export const API_ENDPOINTS = {
  ITEM: (id?: string) => `${environment.apiUrl}/item${id ? '/' + id : ''}`,
  REGISTER: `${environment.apiUrl}/auth/register`,
  LOGIN: `${environment.apiUrl}/auth/login`,
  LOGOUT: `${environment.apiUrl}/auth/logout`,
  USER: `${environment.apiUrl}/auth/me`,
  SEARCH: `${environment.apiUrl}/item/search?query=`,
  PRESIGNED_URL: `${environment.apiUrl}/upload-url?contentType=`
};