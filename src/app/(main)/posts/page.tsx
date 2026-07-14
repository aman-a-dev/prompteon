import { getAllPosts } from "@/actions/post";
import PostCard from "@/components/post-card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import Link from "next/link";

/**
 * Server component that fetches and displays all posts.
 * Uses streaming and suspense-ready data fetching.
 */
export default async function PostsPage() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No Post yet.</EmptyTitle>
          <EmptyDescription>Create the first post.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/post/new">Create Post</Link>
        </EmptyContent>
      </Empty>
    );
  }

  // Placeholder callbacks – replace with actual implementations (e.g., using server actions)
  const handleLike = async (postId: string) => {
    // TODO: implement like logic
    console.log("Like", postId);
  };

  const handleFavorite = async (postId: string) => {
    // TODO: implement favorite logic
    console.log("Favorite", postId);
  };

  const handleView = async (postId: string) => {
    // TODO: implement view tracking
    console.log("View", postId);
  };

  const handleComment = async (postId: string, content: string) => {
    // TODO: implement comment creation
    console.log("Comment", postId, content);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onFavorite={handleFavorite}
            onView={handleView}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
}
