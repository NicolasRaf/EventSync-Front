export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'PARTICIPANT';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  locationType: 'ONLINE' | 'IN_PERSON';
  organizerId: string;
  organizer: {
    id?: string;
    name: string;
    email: string;
  };
  participants?: {
    id: string;
  }[];
  reviews?: {
    id: string;
    userId: string;
    rating: number;
    comment: string;
  }[];
}

export interface EventDetails extends Event {
  participants: {
    id: string;
    name: string;
  }[];
}

export interface Registration {
  id: string;
  date: string;
  event: Event;
  user?: {
    name: string;
    email: string;
  };
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN';
  checkedInAt?: string | null;
  createdAt?: string;
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}
