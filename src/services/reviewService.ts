import api from '../lib/api';

export interface CreateReviewData {
  rating: number;
  comment: string;
}

export const createReview = async (eventId: string, data: CreateReviewData): Promise<void> => {
  await api.post(`/events/${eventId}/reviews`, data);
};
