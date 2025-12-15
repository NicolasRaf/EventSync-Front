export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: {
    name: string;
    email: string;
  };
}

export interface Registration {
  id: string;
  date: string;
  event: Event;
}
