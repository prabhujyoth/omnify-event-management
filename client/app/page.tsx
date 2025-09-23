"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTrash } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { IconMapPin } from "@tabler/icons-react";
import { IconCalendarWeek } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const events = [
  {
    name: "Test Event",
    location: "Kamanahalli",
    start_time: "2025-09-22T20:15:57.830000+05:30",
    end_time: "2025-09-22T20:15:57.830000+05:30",
    max_capacity: 100,
    id: 1,
  },

  {
    name: "Test Event 2",
    location: "Kamanahalli",
    start_time: "2025-09-22T20:15:57.830000+05:30",
    end_time: "2025-09-22T20:15:57.830000+05:30",
    max_capacity: 10,
    id: 2,
  },
];

export default function Home() {
  const [data, setData] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "Member" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "Member" },
  ]);

  const onDelete = (id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };
  return (
    <div className="p-4 flex gap-2 h-full">
      {/* Left Panel - Events */}
      <div className="w-1/4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <div className="flex items-end gap-2">
              <Input
                type="text"
                className="mt-3"
                placeholder="Filter by Event Name"
              />

              <Button>
                <IconPlus />
                Create Event
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {events.map((event) => {
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{event.name}</CardTitle>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="size-8"
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
      </div>
      {/* Right Panel - Event Details & Attendees List */}

      <div className="w-3/4 h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 h-full flex-col gap-2">
            <div className="flex gap-2">
              <Card className="h-full bg-[#6d6dcc] flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconMapPin />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  Details
                </CardContent>
              </Card>
              <Card className="h-full bg-[#4d9f4d] flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCalendarWeek />
                    Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  Details
                </CardContent>
              </Card>
              <Card className="h-full bg-[#be6d6d] flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCalendarWeek />
                    End Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  Details
                </CardContent>
              </Card>
              <Card className="h-full bg-[#9c9c48] flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconUser />
                    Max Capactiy
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  Details
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
                    placeholder="Filter by Attendee Name"
                  />

                  <Button>
                    <IconPlus />
                    Add Attendee
                  </Button>
                </div>
                <div className="overflow-auto h-20" style={{ flexGrow: 1 }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">
                            {row.id}
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.role}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete?.(row.id)}
                            >
                              <IconTrash size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {data.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
