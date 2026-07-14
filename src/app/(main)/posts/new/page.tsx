"use client";

import { useActionState, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/post";
import { uploadFile } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  ImageIcon,
  VideoIcon,
  AudioLines,
  FileIcon,
  X,
  Upload,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type AttachmentItem = {
  type: string;
  url: string;
  caption?: string;
};

export default function NewPostPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(createPost, null);

  // Handle authentication errors
  if (!session?.user) {
    toast.error("You must be logged in");
  }

  if (state?.success) {
    toast.success("Post created successfully!");
    router.push(`/posts/${state.postId}`);
  }

  // Handle file upload
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(formData);
      setAttachments((prev) => [
        ...prev,
        { url: result.url, type: result.type, caption: "" },
      ]);
      toast.success("File uploaded");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
    },
    maxFiles: 1,
    disabled: uploading || isPending,
  });

  const addAttachment = (url: string, type: string) => {
    setAttachments((prev) => [...prev, { url, type, caption: "" }]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setAttachments((prev) => {
      const updated = [...prev];
      updated[index].caption = caption;
      return updated;
    });
  };

  const attachmentsJson = JSON.stringify(
    attachments.map(({ url, type, caption }) => ({ url, type, caption })),
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Enter title"
            required
            disabled={isPending}
            className="text-lg"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Write your post..."
            required
            disabled={isPending}
            className="resize-y"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <Input
            id="tags"
            name="tags"
            placeholder="react, nextjs, typescript"
            disabled={isPending}
          />
        </div>

        {/* Attachment management */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Attachments</label>

          {/* Drag & Drop zone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:bg-accent/50",
              (uploading || isPending) && "opacity-50 pointer-events-none",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm">
              {isDragActive
                ? "Drop the file here"
                : "Drag & drop a file here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports images, videos, audio (max 10MB)
            </p>
          </div>

          {/* Manual file input fallback */}
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || isPending}
            >
              Browse Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
                e.target.value = ""; // reset
              }}
            />
            {uploading && <Spinner className="ml-2" />}
          </div>

          {/* Attachment list with captions */}
          {attachments.length > 0 && (
            <div className="grid gap-4 mt-4">
              {attachments.map((att, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 border rounded-lg bg-card"
                >
                  {/* Preview */}
                  <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {att.type === "image" && (
                      <img
                        src={att.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    {att.type === "video" && <VideoIcon className="h-8 w-8" />}
                    {att.type === "audio" && <AudioLines className="h-8 w-8" />}
                    {att.type === "other" && <FileIcon className="h-8 w-8" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <Textarea
                      placeholder="Add a caption / content for this attachment (long text supported)"
                      value={att.caption || ""}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      rows={2}
                      disabled={isPending}
                      className="resize-y text-sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      {att.type}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttachment(index)}
                    disabled={isPending}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden field for attachments JSON */}
        <input type="hidden" name="attachments" value={attachmentsJson} />

        <Button
          type="submit"
          disabled={isPending || uploading}
          className="w-full"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Post"
          )}
        </Button>
      </form>
    </div>
  );
}
