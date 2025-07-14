import React from "react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2 } from "lucide-react";

const BlogDetail = ({ params }) => {
  const id = params.id;

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/blogs", id],
    queryFn: () => blogService.getBlog(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="text-center py-16 text-red-600">Blog not found.</div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{blog.title}</CardTitle>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-gray-600 text-sm">By {blog.authorName}</span>
            <span className="text-gray-400 text-sm">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <Badge>{blog.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="mb-4 rounded-md w-full max-h-72 object-cover"
            />
          )}
          <div
            className="prose max-w-none mb-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <div className="flex gap-2 mt-4 flex-wrap">
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default BlogDetail;
