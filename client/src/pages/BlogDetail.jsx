import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  Calendar,
  User,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Share,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";

const BlogDetail = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  // Helper function for safely formatting dates
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return format(parseISO(dateString), "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  // Safe author display function
  const displayAuthor = (blog) => {
    if (!blog) return "Unknown";
    
    if (blog.authorName && blog.authorName !== "Unknown") {
      return blog.authorName;
    }
    
    if (blog.authorId) {
      if (typeof blog.authorId === "object") {
        return blog.authorId.name || blog.authorId.username || "Community Member";
      }
      return "Community Member";
    }
    
    return "Anonymous";
  };

  // Fetch blog data
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["/api/blogs", id],
    queryFn: async () => {
      try {
        const result = await blogService.getBlogById(id);
        console.log("Blog detail data:", result);
        
        // Normalize data structure based on API response
        if (result?.data) {
          return result.data;
        }
        return result;
      } catch (error) {
        console.error("Error fetching blog:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Blog</h1>
        <p className="mt-4 text-gray-600">
          {error?.message || "Unable to load this article"}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setLocation("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => setLocation("/blog")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Button>

      {/* Blog Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>By {displayAuthor(blog)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      )}

      {/* Blog Content */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6 md:p-8">
          {/* Excerpt as intro paragraph */}
          {blog.excerpt && (
            <>
              <p className="text-lg font-medium text-gray-700 italic mb-6">
                {blog.excerpt}
              </p>
              <Separator className="my-6" />
            </>
          )}

          {/* Main Content */}
          <div className="prose prose-green max-w-none">
            {/* If you're using Markdown, render with ReactMarkdown */}
            {blog.content && typeof blog.content === 'string' && blog.content.includes('#') ? (
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            ) : (
              // Otherwise, split paragraphs and render them
              blog.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interaction Buttons */}
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <ThumbsUp className="mr-2 h-4 w-4" />
            <span>Like</span>
            {blog.likes?.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {blog.likes.length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Comment</span>
            {blog.comments?.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {blog.comments.length}
              </Badge>
            )}
          </Button>
        </div>
        <Button variant="outline" className="flex items-center">
          <Share className="mr-2 h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Section - Add your comment logic here */}
    </div>
  );
};

export default BlogDetail;