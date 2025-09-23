"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus } from "@tabler/icons-react";
import { IconMapPin } from "@tabler/icons-react";
import { IconCalendarWeek } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import { AttendeesTable } from "./AttendeesTable";

interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

interface Attendee {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface RightPanelProps {
  selectedEvent?: Event;
  attendees: Attendee[];
  onAttendeeDelete?: (id: number) => void;
  onAddAttendee?: () => void;
}

export function RightPanel({
  selectedEvent,
  attendees,
  onAttendeeDelete,
  onAddAttendee,
}: RightPanelProps) {
  const [filterText, setFilterText] = useState("");

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(filterText.toLowerCase()) ||
      attendee.email.toLowerCase().includes(filterText.toLowerCase())
  );

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " at");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 h-full flex-col gap-2">
        <div className="flex gap-2">
          <Card className="h-full bg-gradient-to-r from-[#6d6dcc] to-[#8d8dde]  flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMapPin />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedEvent?.location || ""}
            </CardContent>
          </Card>
          <Card className="h-full bg-gradient-to-r from-[#4d9f4d] to-[#6fcf97] flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendarWeek />
                Start Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedEvent?.start_time
                ? formatDateTime(selectedEvent.start_time)
                : ""}
            </CardContent>
          </Card>
          <Card className="h-full bg-gradient-to-r from-[#be6d6d] to-[#e57373] flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendarWeek />
                End Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedEvent?.end_time
                ? formatDateTime(selectedEvent.end_time)
                : ""}
            </CardContent>
          </Card>
          <Card className="h-full bg-gradient-to-r from-[#9c9c48] to-[#c2c264] flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser />
                Max Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedEvent?.max_capacity || ""}
            </CardContent>
          </Card>
        </div>
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Attendees Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <div className="flex items-end justify-between w-full gap-2">
              <Input
                type="text"
                className="mt-3 w-1/4"
                placeholder="Filter by Attendee Name or Email"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />

              <Button onClick={onAddAttendee}>
                <IconPlus />
                Add Attendee
              </Button>
            </div>
            <AttendeesTable
              attendees={filteredAttendees}
              onDelete={onAttendeeDelete}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
