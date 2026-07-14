"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, deleteAccount } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncButton } from "@/components/ui/async-button";

export default function EditProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  if (sessionLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!session?.user) {
    redirect("/auth");
  }

  // Cast user to include bio (which exists in DB but may be missing in type)
  const user = session.user as {
    name?: string;
    image?: string;
    bio?: string;
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={user.name || ""}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={user.bio || ""}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Avatar URL
          </label>
          <Input
            id="image"
            name="image"
            type="url"
            defaultValue={user.image || ""}
            placeholder="https://example.com/avatar.jpg"
            disabled={isPending}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

          <AsyncButton
            action={handleDeleteAccount}
            variant="destructive"
            loadingText="Deleting..."
          >
            Delete Account
          </AsyncButton>
        </div>
      </form>
    </div>
  );
}
