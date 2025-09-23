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
import { useState } from "react";

interface AddAttendeesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attendeeData: { name: string; email: string }) => void;
}

const initialState = {
  name: "",
  email: "",
};

export function AddAttendeesDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddAttendeesDialogProps) {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            <DialogTitle>Add New Attendee</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new attendee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Attendee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
