"use client";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, Eye, MessageSquare, Copy } from "lucide-react";
import { useState } from "react";
import CommentBox from "./comment-box";
import { useCopy } from "@/hooks/use-copy";

type Attachment = {
  id: string;
  url: string;
  type: string;
  caption?: string;
};

interface PostCardProps {
  post: {
    id: string;
    title?: string;
    description?: string;
    attachments?: Attachment[];
    tags?: string[];
    viewsCount: number;
    likesCount: number;
    favoritesCount: number;
    commentCount: number;
    user: {
      name: string;
      image?: string;
    };
  };
  onLike: (postId: string) => void;
  onFavorite: (postId: string) => void;
  onView: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export default function PostCard({
  post,
  onLike,
  onFavorite,
  onView,
  onComment,
}: PostCardProps) {
  const { copyToClipboard } = useCopy();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite(post.id);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {post.attachments && post.attachments.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {post.attachments.map((attachment) => (
              <CarouselItem
                key={attachment.id}
                className="relative aspect-video"
              >
                <Image
                  src={attachment.url}
                  alt={attachment.caption || post.title || "Post image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {attachment.caption && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-3 py-1.5 text-xs rounded-md line-clamp-2 max-w-[90%]">
                    {attachment.caption}
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <CardHeader>
        <CardTitle className="line-clamp-2">
          {post.title || "Untitled"}
        </CardTitle>
        {post.description && (
          <CardDescription className="line-clamp-2">
            {post.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle
            pressed={isLiked}
            onPressedChange={handleLike}
            className="gap-1 data-[state=on]:bg-red-100 dark:data-[state=on]:bg-red-900/20"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{post.likesCount}</span>
          </Toggle>

          <Toggle
            pressed={isFavorited}
            onPressedChange={handleFavorite}
            className="gap-1 data-[state=on]:bg-yellow-100 dark:data-[state=on]:bg-yellow-900/20"
          >
            <Bookmark
              className={`h-4 w-4 transition-colors ${
                isFavorited ? "fill-yellow-500 text-yellow-500" : ""
              }`}
            />
            <span>{post.favoritesCount}</span>
          </Toggle>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </Button>
            </DrawerTrigger>
            <CommentBox
              comments={[]} // Pass actual comments from state
              onCommentSubmit={(content) => onComment(post.id, content)}
            />
          </Drawer>

          <Button variant="ghost" className="gap-1" disabled>
            <Eye className="h-4 w-4" />
            <span>{post.viewsCount}</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <Link href={`/posts/${post.id}`} className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.user.image} />
            <AvatarFallback>
              {post.user.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{post.user.name}</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            copyToClipboard(`${window.location.origin}/posts/${post.id}`)
          }
          className="gap-1"
        >
          <Copy className="h-3 w-3" />
          Copy Link
        </Button>
      </CardFooter>
    </Card>
  );
}
