import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatMinutes, formatDate } from "@/lib/formatTime";

export const dailySummaryColumns = [
  {
    accessorKey: "date",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {formatDate(row.original.date)}
        </span>
      );
    },
  },

  {
    accessorKey: "regularHours",

    header: "Regular Hours",

    cell: ({ row }) => {
      return formatMinutes(row.getValue("regularHours"));
    },
  },

  {
    accessorKey: "overtime",

    header: "Overtime",

    cell: ({ row }) => {
      return formatMinutes(row.getValue("overtime"));
    },
  },

  {
    accessorKey: "nightDifferential",

    header: "Night differential",

    cell: ({ row }) => {
      return formatMinutes(row.getValue("nightDifferential"));
    },
  },

  {
    accessorKey: "late",

    header: "Late",

    cell: ({ row }) => {
      return formatMinutes(row.getValue("late"));
    },
  },

  {
    accessorKey: "undertime",

    header: "Undertime",

    cell: ({ row }) => {
      return formatMinutes(row.getValue("undertime"));
    },
  },
];
