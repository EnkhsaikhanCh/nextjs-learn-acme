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

export default function Page() {
  const { data, loading, error, refetch } = useGetAllTestQuery();
  const [useDelete] = useDeleteTestMutation();
  const [createTest] = useCreateTestMutation();
  const [testName, setTestName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const handleDeleteTest = async (id: string) => {
    try {
      await useDelete({ variables: { deleteTestId: id } });
      refetch();
    } catch (error) {
      console.error(error);
    }
    setIsOpen(false);
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
        <input
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <ActionButton
                    label=""
                    icon={<Trash2 />}
                    onClick={() => {
                      setSelectedTestId(test._id);
                      setIsOpen(true);
                    }}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you absolutely sure delete this one?
                    </DialogTitle>
                    <DialogDescription>
                      {test.name} will be permanently removed. This action
                      cannot be undone.
                      {test._id}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <ActionButton
                      label="Cancel"
                      onClick={() => setIsOpen(false)}
                      variant="outline"
                    />
                    <ActionButton
                      label="Delete"
                      onClick={() => handleDeleteTest(test._id)}
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
