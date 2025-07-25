import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";

const BlogCard = ({ blog, showStatus = false }) => {
  // Helper function for safely formatting dates
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  // Safe author display function
  const displayAuthor = () => {
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

  return (
    <Card className="hover-lift h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
            {blog.title}
          </CardTitle>
          {showStatus && getStatusBadge(blog.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Blog Image */}
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{blog.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <p className="text-sm text-gray-600">
                By {displayAuthor()}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Link href={`/blog/${blog._id}`}>
          <Button variant="outline" className="w-full group">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;