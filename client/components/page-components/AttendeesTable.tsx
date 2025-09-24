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
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(attendees.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendees.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when attendees list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [attendees.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((row) => (
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
                  colSpan={3}
                  className="text-center text-muted-foreground h-32"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}

            {attendees.length > 0 && currentItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground h-32"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {attendees.length > 0 && (
        <div className="px-2 py-4 border-t">
          <div className="text-sm text-muted-foreground text-center mb-2">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, attendees.length)} of {attendees.length}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First Page */}
              <PaginationItem>
                <PaginationLink 
                  onClick={() => setCurrentPage(1)}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis and middle pages */}
              {currentPage > 3 && <PaginationEllipsis />}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => 
                  pageNum !== 1 && 
                  pageNum !== totalPages && 
                  Math.abs(currentPage - pageNum) <= 1
                )
                .map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))
              }

              {currentPage < totalPages - 2 && <PaginationEllipsis />}

              {/* Last Page */}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink 
                    onClick={() => setCurrentPage(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
