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
  locationType: 'ONLINE' | 'IN_PERSON';
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

export const updateRegistrationStatus = async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
  const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
  await api.patch(`/registrations/${id}/${endpoint}`);
};

export const cancelRegistration = async (registrationId: string): Promise<void> => {
  await api.delete(`/registrations/${registrationId}`);
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await api.delete(`/events/${eventId}`);
};

export const updateEvent = async (eventId: string, data: Partial<CreateEventData>): Promise<void> => {
  await api.put(`/events/${eventId}`, data);
};

