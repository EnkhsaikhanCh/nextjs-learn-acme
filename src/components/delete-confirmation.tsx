"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface DeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading: boolean;
  confirmName: string;
}

export function DeleteConfirmation({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  loading,
  confirmName,
}: DeleteConfirmationProps) {
  const [inputValue, setInputValue] = useState("");

  const isMatched = inputValue.trim() === confirmName;

  // Reset input when dialog opens
  useEffect(() => {
    if (open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <Label htmlFor="confirmation-input" className="font-normal">
            To confirm, type{" "}
            <span className="bg-accent rounded-sm border px-2 py-0.5 font-semibold">
              {confirmName}
            </span>
          </Label>
          <Input
            id="confirmation-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="mt-3"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}
            disabled={!isMatched || loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
