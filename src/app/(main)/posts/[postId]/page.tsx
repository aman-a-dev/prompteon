import { getPost } from "@/actions/post";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

interface PostPageProps {
  params: { postId: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = params;
  const post = await getPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.description && (
        <p className="text-xl text-muted-foreground mb-6">{post.description}</p>
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>By {post.user?.name || "Anonymous"}</span>
        <span>•</span>
        <time dateTime={String(post.createdAt)}>
          {format(new Date(post.createdAt), "MMMM d, yyyy")}
        </time>
        {post.updatedAt > post.createdAt && (
          <>
            <span>•</span>
            <span>
              Updated {format(new Date(post.updatedAt), "MMMM d, yyyy")}
            </span>
          </>
        )}
      </div>

      {post.attachments && post.attachments.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {post.attachments.map((attachment) => (
            <div key={attachment.id} className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={attachment.url}
                  alt={attachment.caption || "Post image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {attachment.caption && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {attachment.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
