"use client";

import { ActionButton } from "@/components/ActionButton";
import {
  useCreateTestMutation,
  useDeleteTestMutation,
  useGetAllTestQuery,
} from "@/generated/graphql";
import { Trash2, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Page() {
  const { data, loading, error, refetch } = useGetAllTestQuery();
  const [deleteTest] = useDeleteTestMutation();
  const [createTest] = useCreateTestMutation();
  const [testName, setTestName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const handleDeleteTest = async (id: string) => {
    try {
      await deleteTest({ variables: { deleteTestId: id } });
      refetch();
    } catch (error) {
      console.error(error);
    }
    setOpenDialogId(null);
  };

  const handleCreateTest = async () => {
    setIsCreating(true);
    try {
      await createTest({ variables: { name: testName } });
      setTestName("");
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main>
      <h1>Test Page</h1>
      <div>
        <div className="mt-3 flex gap-2">
          <Input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Enter test name"
          />
          <ActionButton
            label={isCreating ? "Creating..." : "Create"}
            onClick={handleCreateTest}
            icon={
              isCreating ? <LoaderCircle className="animate-spin" /> : <Plus />
            }
            disabled={isCreating}
          />
        </div>
        {data?.getAllTest.map((test) => (
          <div
            key={test._id}
            className="my-4 grid grid-cols-3 gap-4 rounded-md border bg-gray-100 p-4"
          >
            <div className="col-span-2">
              <div>ID: {test._id}</div>
              <div>Name: {test.name}</div>
            </div>
            <div className="flex w-full justify-end">
              <Dialog
                open={openDialogId === test._id}
                onOpenChange={(isOpen) =>
                  setOpenDialogId(isOpen ? test._id : null)
                }
              >
                <DialogTrigger asChild>
                  <ActionButton
                    label=""
                    icon={<Trash2 />}
                    onClick={() => setOpenDialogId(test._id)}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you absolutely sure delete this one?
                    </DialogTitle>
                    <DialogDescription>
                      will be permanently removed. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <div className="flex gap-1">
                      <div>Name:</div>
                      <div>{test.name}</div>
                    </div>
                    <div className="flex gap-1">
                      <div>ID:</div>
                      <div>{test._id}</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <ActionButton
                      label="Cancel"
                      onClick={() => setOpenDialogId(null)}
                      variant="outline"
                    />
                    <ActionButton
                      label="Delete"
                      onClick={() => handleDeleteTest(test._id)}
                      variant={"destructive"}
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
