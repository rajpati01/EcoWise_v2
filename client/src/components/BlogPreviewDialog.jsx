import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";

const BlogPreviewDialog = ({ open, onOpenChange, blog }) => {
  if (!blog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{blog.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Author: {blog.authorName}</span>
            <Badge>{blog.status}</Badge>
          </div>
          <p className="text-gray-600 text-sm">{blog.excerpt}</p>
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="rounded-md w-full max-h-60 object-cover my-2"
            />
          )}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-4">
            Created on: {new Date(blog.createdAt).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewDialog;