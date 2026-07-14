// app/profile/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const { user } = session;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback>
            {user.name?.slice(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        {user.bio && <p className="text-center max-w-md">{user.bio}</p>}

        <Link href="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}
