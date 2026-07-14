// components/comment-box.tsx
"use client";

import {
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  user: {
    name: string;
    image?: string;
  };
  createdAt: string;
}

interface CommentBoxProps {
  comments: Comment[];
  onCommentSubmit: (content: string) => void;
}

export default function CommentBox({
  comments,
  onCommentSubmit,
}: CommentBoxProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      onCommentSubmit(newComment);
      setNewComment("");
    }
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Comments</DrawerTitle>
      </DrawerHeader>

      <div className="px-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.image} />
                <AvatarFallback>
                  {comment.user.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{comment.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {comment.content}
                </p>
                <time className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          ))
        )}
      </div>

      <DrawerFooter>
        <div className="flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSubmit} className="shrink-0">
            Post
          </Button>
        </div>
      </DrawerFooter>
    </>
  );
}
