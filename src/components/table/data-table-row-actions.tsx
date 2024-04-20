"use client";
// @ts-ignore
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
// @ts-ignore
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { labels } from "../../helpers/data/data";
import { taskSchema } from "../../helpers/data/schema";
import { AssignedUser, TaskStatus } from "@/types";
import { setIdTask } from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";

export interface RowTaskType {
  __typename: string;
  original: {
    node: {
      id: number;
      user_id: string;
      created_at?: string;
      title: string;
      description: string;
      updated_at?: string;
      due_date?: string;
      priority?: number;
      assigned_to?: AssignedUser[];
      label?: string[];
      completed_at?: string;
      is_archived?: boolean;
      status: TaskStatus;
      order: number;
    };
  };
}

interface DataTableRowActionsProps {
  row: RowTaskType;
  onDelete: (id: number) => void;
  onClickEdit: (isEditing: boolean, id: number) => void;
}

export function DataTableRowActions<TData>({
  row,
  onDelete,
  onClickEdit,
}: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          // @ts-ignore
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            localStorage.setItem("id", row.original.node.id.toString());
            setIdTask(row.original.node.id);
            onClickEdit(true, row.original.node.id);
          }}
        >
          Edit
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        <DropdownMenuSeparator />
        {/* @ts-ignore */}
        <DropdownMenuItem onClick={() => onDelete(row.original.node.id)}>
          Delete
          {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
