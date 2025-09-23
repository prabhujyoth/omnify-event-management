import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/events";

export interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateEventData {
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export interface AddAttendeeData {
  name: string;
  email: string;
  role: string;
}

export const eventService = {
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    const { data } = await axios.get(API_URL);
    return data;
  },

  // Get attendees for an event
  getEventAttendees: async (eventId: number): Promise<Attendee[]> => {
    const { data } = await axios.get(`${API_URL}/${eventId}/attendees`);
    return data;
  },

  // Create a new event
  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const { data } = await axios.post(API_URL, {
      name: eventData.name,
      location: eventData.location,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      max_capacity: eventData.maxCapacity,
    });
    return data;
  },

  // Delete an event
  deleteEvent: async (eventId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${eventId}`);
  },

  // Add an attendee to an event
  addAttendee: async (eventId: number, attendeeData: AddAttendeeData): Promise<Attendee> => {
    const { data } = await axios.post(`${API_URL}/${eventId}/register`, {
      name: attendeeData.name,
      email: attendeeData.email,
    });
    return data;
  },

  // Delete an attendee from an event
  deleteAttendee: async (eventId: number, attendeeId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${eventId}/attendees/${attendeeId}`);
  },
};
