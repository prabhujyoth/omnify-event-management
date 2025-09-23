"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTrash } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";

interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

interface LeftPanelProps {
  events: Event[];
  selectedEventId?: number;
  onEventDelete?: (id: number) => void;
  onCreateEvent?: () => void;
  onEventSelect?: (event: Event) => void;
}

export function LeftPanel({ 
  events, 
  selectedEventId,
  onEventDelete, 
  onCreateEvent,
  onEventSelect 
}: LeftPanelProps) {
  const [filterText, setFilterText] = useState("");

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <div className="flex items-end gap-2">
          <Input
            type="text"
            className="mt-3"
            placeholder="Filter by Event Name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <Button onClick={onCreateEvent}>
            <IconPlus />
            Create Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {filteredEvents.map((event) => {
          const isSelected = event.id === selectedEventId;
          return (
            <Card 
              key={event.id}
              className={`cursor-pointer transition-colors hover:bg-muted ${isSelected ? 'bg-muted' : ''}`}
              onClick={() => onEventSelect?.(event)}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{event.name}</CardTitle>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventDelete?.(event.id);
                    }}
                  >
                    <IconTrash />
                  </Button>
                </div>
                <CardDescription>
                  Location: {event.location}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}