import api from '../lib/api';
import type { User } from '../types';

export async function getUserProfile(): Promise<User> {
  const response = await api.get<User>('/profile');
  return response.data;
}
