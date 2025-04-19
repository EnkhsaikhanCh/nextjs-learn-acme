// src/components/SectionDeleteDialog.tsx
"use client";

import React from "react";
import { useDeleteSectionMutation } from "@/generated/graphql";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { toast } from "sonner";

interface SectionDeleteDialogProps {
  sectionId: string;
  sectionTitle: string;
  onDeleted: () => void;
  trigger: React.ReactNode;
}

export const SectionDeleteDialog: React.FC<SectionDeleteDialogProps> = ({
  sectionId,
  sectionTitle,
  onDeleted,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteSection, { loading }] = useDeleteSectionMutation();

  const handleConfirm = async () => {
    try {
      await deleteSection({ variables: { id: sectionId } });
      setOpen(false);
      onDeleted();
      toast.success(`Section "${sectionTitle}" deleted`);
    } catch (err) {
      toast.error("Failed to delete section", {
        description: (err as Error).message,
      });
    }
  };

  return (
    <>
      {/* Wrap your trigger so clicking it simply opens the dialog */}
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {/* This is your existing AlertDialog wrapper */}
      <DeleteConfirmation
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        title="Delete Section"
        description={`Type "${sectionTitle}" to confirm deletion.`}
        confirmName={sectionTitle}
        loading={loading}
      />
    </>
  );
};
