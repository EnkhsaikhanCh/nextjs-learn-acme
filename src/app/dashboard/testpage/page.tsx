"use client";

import { ActionButton } from "@/components/ActionButton";
import { useCreateTestMutation, useGetAllTestQuery } from "@/generated/graphql";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const { data, loading, error, refetch } = useGetAllTestQuery();
  const [createTest] = useCreateTestMutation();
  const [testName, setTestName] = useState("");

  const handleCreateTest = async () => {
    try {
      await createTest({ variables: { name: testName } });
      setTestName("");
      refetch();
    } catch (error) {
      console.error(error);
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
          label="Create test"
          onClick={handleCreateTest}
          icon={<Plus />}
        />
        {data?.getAllTest.map((test) => (
          <div
            key={test._id}
            className="my-4 rounded-md border bg-gray-100 p-4"
          >
            <div>ID: {test._id}</div>
            <div>Name: {test.name}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
