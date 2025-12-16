import api from '../lib/api';
import type { Friend, FriendRequest } from '../types';

export const sendFriendRequest = async (userId: string): Promise<void> => {
  await api.post(`/users/${userId}/friend-request`);
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await api.get<FriendRequest[]>('/friends/requests');
  return response.data;
};

export const getFriends = async (): Promise<Friend[]> => {
  const response = await api.get<Friend[]>('/friends');
  return response.data;
};

export const respondToFriendRequest = async (requestId: string, accept: boolean): Promise<void> => {
  await api.put(`/friends/requests/${requestId}`, { accept });
};
