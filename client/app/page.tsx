"use client";
import { useState, useEffect } from "react";
import { LeftPanel } from "@/components/page-components/LeftPanel";
import { RightPanel } from "@/components/page-components/RightPanel";
import { CreateEventDialog } from "@/components/page-components/CreateEventDialog";
import { AddAttendeesDialog } from "@/components/page-components/AddAttendeesDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { eventService, Event, Attendee } from "@/services/eventService";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isAddAttendeeOpen, setIsAddAttendeeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const events = await eventService.getAllEvents();
        setEvents(events);
        // Set the first event as selected if we have events and no event is selected
        if (events.length > 0 && !selectedEvent) {
          setSelectedEvent(events[0]);
          await fetchAttendees(events[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err?.response?.data?.detail
            : "An error occurred while fetching events"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fetchAttendees = async (eventId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const attendees = await eventService.getEventAttendees(eventId);
      setAttendees(attendees);
    } catch (err) {
      setError(
        err instanceof Error
          ? err?.response?.data?.detail
          : "An error occurred while fetching attendees"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    fetchAttendees(event.id);
  };

  const handleEventDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await eventService.deleteEvent(id);

      setEvents((prev) => prev.filter((event) => event.id !== id));
      if (selectedEvent?.id === id) {
        const firstEvent = events.find((e) => e.id !== id);
        setSelectedEvent(firstEvent);
        if (firstEvent) {
          fetchAttendees(firstEvent.id);
        } else {
          setAttendees([]);
        }
      }
      setSuccessMessage("Event deleted successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err?.response?.data?.detail
          : "An error occurred while deleting the event"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendeeDelete = async (id: number) => {
    if (!selectedEvent) {
      setError("No event selected");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await eventService.deleteAttendee(selectedEvent.id, id);

      setAttendees((prev) => prev.filter((attendee) => attendee.id !== id));
      setSuccessMessage("Attendee removed successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err?.response?.data?.detail
          : "An error occurred while removing the attendee"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: {
    name: string;
    location: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
  }) => {
    // Validate times
    const startTime = new Date(eventData.startTime);
    const endTime = new Date(eventData.endTime);

    if (endTime <= startTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newEvent = await eventService.createEvent(eventData);
      setEvents((prev) => [...prev, newEvent]);
      setSelectedEvent(newEvent);
      setIsCreateEventOpen(false);
      setSuccessMessage("Event created successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err?.response?.data?.detail
          : "An error occurred while creating the event"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendee = async (attendeeData: {
    name: string;
    email: string;
    role: string;
  }) => {
    if (!selectedEvent) {
      setError("Please select an event first");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newAttendee = await eventService.addAttendee(
        selectedEvent.id,
        attendeeData
      );
      setAttendees((prev) => [...prev, newAttendee]);
      setIsAddAttendeeOpen(false);
      setSuccessMessage("Attendee added successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err?.response?.data?.detail
          : "An error occurred while registering the attendee"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 grid grid-cols-4 max-lg:grid-cols-5 gap-2 h-full">
        <div className="w-full col-span-1 max-lg:col-span-2 max-sm:col-span-5">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <LeftPanel
              events={events}
              selectedEventId={selectedEvent?.id}
              onEventDelete={handleEventDelete}
              onCreateEvent={() => setIsCreateEventOpen(true)}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>
        <div className="w-full col-span-3 max-lg:col-span-3 max-sm:col-span-5 h-full">
          <RightPanel
            selectedEvent={selectedEvent}
            attendees={attendees}
            onAttendeeDelete={handleAttendeeDelete}
            onAddAttendee={() => setIsAddAttendeeOpen(true)}
          />
        </div>

        <CreateEventDialog
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={handleCreateEvent}
        />

        <AddAttendeesDialog
          isOpen={isAddAttendeeOpen}
          onClose={() => setIsAddAttendeeOpen(false)}
          onSubmit={handleAddAttendee}
        />
      </div>

      {/* Alert Container */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {successMessage && (
          <Alert className="w-[400px] shadow-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="w-[400px] shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
