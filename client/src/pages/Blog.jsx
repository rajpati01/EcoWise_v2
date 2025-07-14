import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import { useAuth } from "../hooks/useAuth";
import BlogCard from "../components/BlogCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import {
  Plus,
  Search,
  BookOpen,
  PenTool,
  TrendingUp,
  Loader2,
} from "lucide-react";

const Blog = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
  });

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["/api/blogs"],
    queryFn: () => blogService.getBlogs("approved"), 
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (blogData) =>
      blogService.createBlog({
        ...blogData,
        tags: blogData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      setDialogOpen(false);
      setNewBlog({
        title: "",
        content: "",
        excerpt: "",
        tags: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      toast({
        title: "Blog Created!",
        description: "Your blog post has been submitted for approval.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Blog",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(newBlog);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.tags &&
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const approvedBlogs = filteredBlogs.filter(
    (blog) => blog.status === "approved"
  );
  const featuredBlogs = approvedBlogs.slice(0, 3);
  const recentBlogs = approvedBlogs.slice(3);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">EcoWise Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover articles, tips, and insights on sustainable living, waste
          management, and environmental protection from our community.
        </p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isAuthenticated && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Write Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write New Article</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newBlog.title}
                    onChange={handleInputChange}
                    placeholder="10 Tips for Zero Waste Living"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={newBlog.excerpt}
                    onChange={handleInputChange}
                    placeholder="A brief summary of your article..."
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={newBlog.content}
                    onChange={handleInputChange}
                    placeholder="Write your full article here..."
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={newBlog.tags}
                    onChange={handleInputChange}
                    placeholder="sustainability, recycling, zero-waste"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Article"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {approvedBlogs.length}
            </div>
            <div className="text-sm text-gray-600">Published Articles</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <PenTool className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">
              {new Set(approvedBlogs.map((b) => b.authorId)).size}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">
              {
                approvedBlogs.filter(
                  (b) =>
                    new Date(b.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Articles */}
      {featuredBlogs.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>

        {approvedBlogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Articles Found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Be the first to write an article!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(recentBlogs.length > 0 ? recentBlogs : approvedBlogs).map(
              (blog) => (
                <BlogCard key={blog.id} blog={blog} />
              )
            )}
          </div>
        )}
      </div>

      {/* Popular Tags */}
      {approvedBlogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(
                  approvedBlogs
                    .flatMap((blog) => blog.tags || [])
                    .filter(Boolean)
                )
              )
                .slice(0, 15)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-white"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="text-center py-8">
            <PenTool className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Share Your Knowledge
            </h3>
            <p className="text-gray-600 mb-4">
              Join our community to write articles and share your eco-friendly
              tips!
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Blog;
