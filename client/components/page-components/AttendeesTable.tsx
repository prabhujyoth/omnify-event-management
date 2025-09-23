"use client";
import { Button } from "../ui/button";
import { IconTrash } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Attendee {
  id: number;
  name: string;
  email: string;
}

interface AttendeesTableProps {
  attendees: Attendee[];
  onDelete?: (id: number) => void;
}

export function AttendeesTable({ attendees, onDelete }: AttendeesTableProps) {
  return (
    <div className="overflow-auto h-20" style={{ flexGrow: 1 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
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

          {attendees.length === 0 && (
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
  );
}
