"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  useCreateMuxUploadUrlMutation,
  useUpdateLessonV2Mutation,
} from "@/generated/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

interface Props {
  lessonId: string;
}

export function MuxUploaderComponent({ lessonId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const [createUpload] = useCreateMuxUploadUrlMutation();
  const [updateLessonV2] = useUpdateLessonV2Mutation();

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file first");
    }
    setIsLoading(true);

    try {
      // 1. createMuxUploadUrl → get uploadId + uploadUrl
      const { data } = await createUpload();
      const { uploadId, uploadUrl, passthrough } =
        data?.createMuxUploadUrl ?? {};

      if (!uploadId || !uploadUrl) {
        throw new Error("Invalid upload URL");
      }

      // 2. PUT file to Mux
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total ?? 1));
          setProgress(percent);
        },
      });

      // 3. Update lesson with uploadId
      await updateLessonV2({
        variables: {
          id: lessonId,
          input: {
            muxUploadId: uploadId,
            passthrough: passthrough,
          },
        },
      });

      toast.success("Video uploaded and lesson updated successfully");
      setFile(null);
      setProgress(0);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <Button onClick={handleUpload} disabled={!file}>
        {isLoading ? <Loader className="animate-spin" /> : "Upload Video"}
      </Button>

      {progress > 0 && (
        <div className="text-muted-foreground text-sm">
          {isLoading ? "Uploading..." : "Upload progress:"} {progress}%
        </div>
      )}
    </div>
  );
}
