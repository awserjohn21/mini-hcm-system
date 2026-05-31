import { ArrowUpDown, CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/formatTime";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { IconDotsVertical } from "@tabler/icons-react";
export const adminAttendanceColumns = ({ onEdit }) => [
  {
    accessorKey: "email",
    header: "Email",

    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">{row.getValue("email")}</span>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",

    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">{row.getValue("name")}</span>
      );
    },
  },

  {
    id: "date",
    accessorKey: "timeIn",

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
      return formatDate(row.original.timeIn);
    },
  },

  {
    accessorKey: "timeIn",

    header: "Time In",

    cell: ({ row }) => {
      const time = formatTime(row.original.timeIn);

      return (
        <div className="font-medium tabular-nums text-teal-400">{time}</div>
      );
    },
  },

  {
    accessorKey: "timeOut",

    header: () => <div className="text-center">Time Out</div>,

    cell: ({ row }) => {
      if (!row.original.timeOut) {
        return (
          <div className="flex items-center justify-center w-full">
            <span className="text-muted-foreground">-----</span>
          </div>
        );
      }

      return (
        <div className="text-center">{formatTime(row.original.timeOut)}</div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Status",

    cell: ({ row }) => {
      const completed = row.getValue("completed");

      return (
        <Badge
          variant="outline"
          className={`
            w-24
            h-7
            flex
            items-center
            justify-center
            gap-1
            text-xs
            font-medium
            ${
              completed
                ? "text-teal-600 border-teal-500"
                : "text-yellow-600 border-yellow-500"
            }
          `}
        >
          {completed ? (
            <CircleCheck className="w-3.5 h-3.5" />
          ) : (
            <CircleX className="w-3.5 h-3.5" />
          )}

          {completed ? "Completed" : "Active"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "timezone",
    header: "Timezone",

    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.getValue("timezone")}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
