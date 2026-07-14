"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPost, updatePost, deletePost } from "@/actions/post";
import { uploadFile } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncButton } from "@/components/ui/async-button";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  VideoIcon,
  AudioLines,
  FileIcon,
  X,
  Upload,
} from "lucide-react";

type AttachmentItem = {
  type: string;
  url: string;
  caption?: string;
};

interface EditPostPageProps {
  params: { postId: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = params;
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session?.user) {
      redirect("/auth");
      return;
    }
    getPost(postId)
      .then((data) => {
        setPost(data);
        if (data?.attachments) {
          setAttachments(
            data.attachments.map((a: any) => ({
              type: a.type,
              url: a.url,
              caption: a.caption || "",
            })),
          );
        }
      })
      .catch(() => toast.error("Failed to load post"))
      .finally(() => setLoading(false));
  }, [postId, session]);

  const [state, formAction, isPending] = useActionState(updatePost, null);

  if (state?.success) {
    toast.success("Post updated successfully!");
    router.push(`/posts/${postId}`);
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

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully");
      router.push("/posts");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!post) {
    toast.error("Post not found");
    redirect("/posts");
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={postId} />

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            defaultValue={post.title || ""}
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
            defaultValue={post.description || ""}
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
            defaultValue={post.tags?.join(", ") || ""}
            disabled={isPending}
          />
        </div>

        {/* Attachment management */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Attachments</label>

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
                e.target.value = "";
              }}
            />
            {uploading && <Spinner className="ml-2" />}
          </div>

          {attachments.length > 0 && (
            <div className="grid gap-4 mt-4">
              {attachments.map((att, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 border rounded-lg bg-card"
                >
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
                      placeholder="Add a caption / content for this attachment"
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

        <input type="hidden" name="attachments" value={attachmentsJson} />

        <div className="flex flex-wrap gap-4">
          <Button type="submit" disabled={isPending || uploading}>
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Post"
            )}
          </Button>

          <AsyncButton
            action={handleDelete}
            variant="destructive"
            loadingText="Deleting..."
          >
            Delete Post
          </AsyncButton>
        </div>
      </form>
    </div>
  );
}
