import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { IconDotsVertical } from "@tabler/icons-react";
import { formatScheduleTime } from "@/lib/formatTime";

export const adminUserColumns = ({ onEdit }) => [
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
    accessorKey: "role",
    header: "Role",

    cell: ({ row }) => {
      return (
        <span className="capitalize text-muted-foreground">
          {row.getValue("role")}
        </span>
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
    id: "scheduleStart",
    accessorFn: (row) => row.schedule?.start,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shift Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return (
        <span className="font-medium text-teal-500">
          {formatScheduleTime(row.original.schedule?.start) || "N/A"}
        </span>
      );
    },
  },

  {
    id: "scheduleEnd",
    accessorFn: (row) => row.schedule?.end,

    header: "Shift End",

    cell: ({ row }) => {
      return (
        <span className="font-medium text-orange-500">
          {formatScheduleTime(row.original.schedule?.end) || "N/A"}
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
