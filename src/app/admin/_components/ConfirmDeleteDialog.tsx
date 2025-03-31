"use client";

import { useState } from "react";
import { CircleAlertIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmDeleteDialogProps {
  buttonLabel: string;
  label: string;
  name: string;
  onConfirm: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmDeleteDialog({
  buttonLabel,
  label,
  name,
  onConfirm,
  open,
  onOpenChange,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (inputValue === name) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          {buttonLabel}
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="tex bg-destructive/10 text-destructive border-destructive flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-destructive sm:text-center">
              Final confirmation
            </DialogTitle>
            <DialogDescription className="mt-2 sm:text-center">
              This action cannot be undone. To confirm, please enter the name{" "}
              <span className="text-foreground">{name}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirm();
          }}
        >
          <div className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="text"
              placeholder={`Type ${name} to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={inputValue !== name}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
