import api from '../lib/api';
import type { Event, EventDetails } from '../types';

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events');
  return response.data;
};

export const subscribeToEvent = async (eventId: string): Promise<void> => {
  await api.post(`/events/${eventId}/registrations`);
};

export const getMyRegistrations = async (): Promise<import('../types').Registration[]> => {
  const response = await api.get<import('../types').Registration[]>('/registrations');
  return response.data;
};

export const performCheckIn = async (eventId: string, participantId: string): Promise<void> => {
  await api.post(`/events/${eventId}/check-in`, { participantId });
};

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
}

export const createEvent = async (data: CreateEventData): Promise<void> => {
  await api.post('/events', data);
};

export const getEventRegistrations = async (eventId: string): Promise<import('../types').Registration[]> => {
  const response = await api.get<import('../types').Registration[]>(`/events/${eventId}/registrations`);
  return response.data;
};

export const getEventDetails = async (eventId: string): Promise<EventDetails> => {
  const response = await api.get<EventDetails>(`/events/${eventId}`);
  return response.data;
};
