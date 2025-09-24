"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: {
    name: string;
    location: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
  }) => void;
}

const initialState = {
  name: "",
  location: "",
  startTime: "",
  endTime: "",
  maxCapacity: 0,
};

export function CreateEventDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateEventDialogProps) {
  const [formData, setFormData] = useState(initialState);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Reset form when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
    }
  }, [isOpen]);

  // Convert local time to UTC for API submission
  const convertToUTC = (localDateTime: string) => {
    if (!localDateTime) return "";
    const localDate = new Date(localDateTime);
    return localDate.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert times to UTC before submitting
    const submissionData = {
      ...formData,
      startTime: convertToUTC(formData.startTime),
      endTime: convertToUTC(formData.endTime),
    };

    onSubmit(submissionData);
    setFormData(initialState);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new event. Times are in{" "}
              {userTimeZone}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              required
            />
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Start Time ({userTimeZone})
              </label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                End Time ({userTimeZone})
              </label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                required
              />
            </div>
            <Input
              type="number"
              placeholder="Max Capacity"
              value={formData.maxCapacity || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxCapacity: parseInt(e.target.value) || 0,
                }))
              }
              required
              min="1"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
