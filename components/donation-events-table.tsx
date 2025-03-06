"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, FileDown } from "lucide-react"
import * as XLSX from "xlsx"
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CitySelect } from "@/components/city-select"
import { DateRangePicker } from "@/components/date-range-picker"
import AllImages from "./images"
import { deleteEvent } from "@/app/dashboard/actions"

export type Event = {
  id: number
  supervisorName: string
  city: string
  venue: string
  totalDonors: number
  totalRegistrations: number
  eventDate: string
  mobileNo: string
  email: string
  coordinatorName: string
  bloodBank: string
  startTime: string
  endTime: string
  comments: string
  uuid: string
  newsLinks: string
  userId: string
}

export function DonationEventsTable() {
  const [data,setData] = React.useState([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deletingEvents, setDeletingEvents] = React.useState<Set<string>>(new Set())

  // Define columns inside the component to have access to setData
  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "supervisorName",
      header: "Supervisor",
      cell: ({ row }) => <div className="capitalize">{row.getValue("supervisorName")}</div>,
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => <div className="capitalize">{row.getValue("city")}</div>,
    },
    {
      accessorKey: "venue",
      header: "Venue",
      cell: ({ row }) => <div>{row.getValue("venue")}</div>,
    },
    {
      accessorKey: "totalDonors",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total Donors
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-right">{row.getValue("totalDonors")}</div>,
    },
    {
      accessorKey: "totalRegistrations",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total Registrations
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-right">{row.getValue("totalRegistrations")}</div>,
    },
    {
      accessorKey: "eventDate",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("eventDate")}</div>,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const dateString = row.getValue(columnId) as string;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;
        const { from, to } = filterValue;
        return date >= from && date <= to;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View/Edit Event</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Event Details</DialogTitle>
                  <DialogDescription>
                  View and edit event details for {event.city} on {event.eventDate}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="supervisorName" className="sm:text-right">
                    Supervisor Name
                  </label>
                  <Input id="supervisorName" defaultValue={event.supervisorName} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="city" className="sm:text-right">
                    City
                  </label>
                  <Input id="city" defaultValue={event.city} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="venue" className="sm:text-right">
                    Venue
                  </label>
                  <Input id="venue" defaultValue={event.venue} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="totalDonors" className="sm:text-right">
                    Total Donors
                  </label>
                  <Input id="totalDonors" defaultValue={event.totalDonors} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="totalRegistrations" className="sm:text-right">
                    Total Registrations
                  </label>
                  <Input id="totalRegistrations" defaultValue={event.totalRegistrations} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="eventDate" className="sm:text-right">
                    Date
                  </label>
                  <Input id="eventDate" defaultValue={event.eventDate} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="mobileNo" className="sm:text-right">
                    Mobile No
                  </label>
                  <Input id="mobileNo" defaultValue={event.mobileNo} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="email" className="sm:text-right">
                    Email
                  </label>
                  <Input id="email" defaultValue={event.email} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="coordinatorName" className="sm:text-right">
                    Coordinator Name
                  </label>
                  <Input id="coordinatorName" defaultValue={event.coordinatorName} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="bloodBank" className="sm:text-right">
                    Blood Bank
                  </label>
                  <Input id="bloodBank" defaultValue={event.bloodBank} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="startTime" className="sm:text-right">
                    Start Time
                  </label>
                  <Input id="startTime" defaultValue={event.startTime} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="endTime" className="sm:text-right">
                    End Time
                  </label>
                  <Input id="endTime" defaultValue={event.endTime} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="news" className="sm:text-right">
                    News Links
                  </label>
                  <Input id="news" defaultValue={event.newsLinks} className="sm:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="comments" className="sm:text-right">
                    Comments
                  </label>
                  <Input id="comments" defaultValue={event.comments} className="sm:col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
                </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Event Images</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Event Images</DialogTitle>
                  <DialogDescription>
                  Images from the event in {event.city} on {event.eventDate}
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto">
                <AllImages uuid={event.uuid} user_id={event.userId} type={'event-images'} />
                </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Donor List</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Donor List</DialogTitle>
                    <DialogDescription>
                      Donor list for the event in {event.city} on {event.eventDate}
                    </DialogDescription>
                  </DialogHeader>
                  <AllImages uuid={event.uuid} user_id={event.userId} type={'blood-donor-list'} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Newspaper Articles</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Newspaper Articles</DialogTitle>
                  <DialogDescription>
                  Newspaper Articles from the event in {event.city} on {event.eventDate}
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto">
                <AllImages uuid={event.uuid} user_id={event.userId} type={'newspaper-articles'} />
                </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      id: "delete",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original
        const isDeleting = deletingEvents.has(event.uuid)
        return (
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
            onClick={async () => {
              if (isDeleting) return
              setDeletingEvents(prev => new Set([...prev, event.uuid]))
              try {
                const result = await deleteEvent(event.uuid)
                console.log(result)
                // Refresh data after successful deletion
                const response = await fetch("/api/admin/getdata")
                const newData = await response.json()
                setData(newData)
                toast.success("Event deleted successfully")
              } catch (error) {
                console.error("Error deleting event:", error)
                toast.error("Failed to delete event")
              } finally {
                setDeletingEvents(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(event.uuid)
                  return newSet
                })
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent dark:border-zinc-100" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )
      },
    },
  ]

  React.useEffect(() => {
    fetch("/api/admin/getdata")
      .then((response) => response.json())
      .then((data) => setData(data))
  }
  , [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events")
    XLSX.writeFile(workbook, "blood_donation_events.xlsx")
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
        placeholder="Filter events..."
        value={(table.getColumn("supervisorName")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("supervisorName")?.setFilterValue(event.target.value)}
        className="w-full sm:max-w-sm"
          />
          <CitySelect onValueChange={(value) => table.getColumn("city")?.setFilterValue(value)} />
          <DateRangePicker
            onValueChange={(range) => {
              const column = table.getColumn("eventDate");
              if (range?.from && range?.to && column) {
                column.setFilterValue({
                  from: range.from,
                  to: range.to,
                });
              } else if (column) {
                column.setFilterValue(undefined);
              }
            }}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
          <Button variant="outline" className="w-full sm:w-auto" onClick={exportToExcel}>
        <FileDown className="mr-2 h-4 w-4" />
        Export to Excel
          </Button>
          <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          )
            })}
        </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-zinc-500 dark:text-zinc-400">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

