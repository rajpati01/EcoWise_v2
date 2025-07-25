import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { campaignService } from "../../services/campaignService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import {
  Shield,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import BlogPreviewDialog from "../../components/BlogPreviewDialog";
import CampaignPreviewDialog from "../../components/CampaignPreviewDialog";

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ========== STATE ==========
  const [blogPreviewOpen, setBlogPreviewOpen] = useState(false);
  const [campaignPreviewOpen, setCampaignPreviewOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // ========== QUERIES ==========
  // Query for all blogs (admin view)
  const { data: allBlogsData, isLoading: allBlogsLoading } = useQuery({
    queryKey: ["/api/blogs", "all"],
    queryFn: async () => {
      try {
        // Use "all" as a parameter to get all blogs from admin endpoint
        const result = await blogService.getBlogs("all");
        
        // Normalize the data to always return an array
        if (Array.isArray(result)) return result;
        if (result?.data && Array.isArray(result.data)) return result.data;
        if (result?.data?.data && Array.isArray(result.data.data)) return result.data.data;
        
        console.warn("Unexpected blog data format:", result);
        return [];
      } catch (error) {
        console.error("Error fetching all blogs:", error);
        return [];
      }
    },
    staleTime: 30 * 1000,
    retry: 2,
  });

  // Query specifically for pending blogs
  const { data: pendingBlogsData, isLoading: pendingBlogsLoading } = useQuery({
    queryKey: ["/api/blogs", "pending"],
    queryFn: async () => {
      try {
        const result = await blogService.getBlogs("pending");
        
        if (Array.isArray(result)) return result;
        if (result?.data && Array.isArray(result.data)) return result.data;
        if (result?.data?.data && Array.isArray(result.data.data)) return result.data.data;
        
        console.warn("Unexpected pending blog data format:", result);
        return [];
      } catch (error) {
        console.error("Error fetching pending blogs:", error);
        return [];
      }
    },
    staleTime: 30 * 1000,
    retry: 2,
  });

  // Query for campaigns
  const { data: allCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ["/api/campaigns", "all"],
    queryFn: () => campaignService.getCampaigns(""),
    staleTime: 30 * 1000,
    retry: 2,
  });

  // ========== MUTATIONS ==========
  // Blog moderation mutations
  const approveBlogMutation = useMutation({
    mutationFn: (id) => blogService.approveBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      toast({
        title: "Blog Approved",
        description: "The blog post has been published.",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to approve blog",
        variant: "destructive",
      });
    },
  });

  const rejectBlogMutation = useMutation({
    mutationFn: (id) => blogService.rejectBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      toast({
        title: "Blog Rejected",
        description: "The blog post has been rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to reject blog",
        variant: "destructive",
      });
    },
  });

  // Campaign moderation mutations
  const approveCampaignMutation = useMutation({
    mutationFn: (id) => campaignService.approveCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign Approved",
        description: "The campaign is now active.",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to approve campaign",
        variant: "destructive",
      });
    },
  });

  const rejectCampaignMutation = useMutation({
    mutationFn: (id) => campaignService.rejectCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign Rejected",
        description: "The campaign has been rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to reject campaign",
        variant: "destructive",
      });
    },
  });

  // ========== HELPER FUNCTIONS ==========
  const handlePreviewBlog = (blog) => {
    setSelectedBlog(blog);
    setBlogPreviewOpen(true);
  };

  const handlePreviewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setCampaignPreviewOpen(true);
  };
  
  const displayUser = (user) => {
    if (!user) return "Unknown";
    if (typeof user === "string") return user;
    if (typeof user === "object") {
      return user.name || user.username || (user._id ? String(user._id) : "Unknown");
    }
    return String(user);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // ========== DERIVED DATA ==========
  const allBlogs = allBlogsData || [];
  const pendingBlogs = pendingBlogsData || [];
  const pendingCampaigns = allCampaigns.filter(campaign => campaign.status === "pending");
  const approvedBlogs = allBlogs.filter(blog => blog.status === "approved");
  const approvedCampaigns = allCampaigns.filter(campaign => campaign.status === "approved");

  // ========== LOADING STATE ==========
  if (allBlogsLoading || pendingBlogsLoading || campaignsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage content and moderate community submissions
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {pendingBlogs.length + pendingCampaigns.length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {allBlogs.length}
            </div>
            <div className="text-sm text-gray-600">Total Blogs</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">
              {allCampaigns.length}
            </div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">
              {Math.round(
                ((approvedBlogs.length + approvedCampaigns.length) /
                  (allBlogs.length + allCampaigns.length)) *
                  100
              ) || 0}
              %
            </div>
            <div className="text-sm text-gray-600">Approval Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending items */}
      {(pendingBlogs.length > 0 || pendingCampaigns.length > 0) && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Items Awaiting Review
                </h3>
                <p className="text-yellow-700">
                  You have {pendingBlogs.length} blog
                  {pendingBlogs.length !== 1 ? "s" : ""} and{" "}
                  {pendingCampaigns.length} campaign
                  {pendingCampaigns.length !== 1 ? "s" : ""} pending approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Moderation Tabs */}
      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="blogs" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Blog Posts</span>
            {pendingBlogs.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {pendingBlogs.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Campaigns</span>
            {pendingCampaigns.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {pendingCampaigns.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="space-y-6">
          {/* Pending Blogs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span>Pending Blog Posts ({pendingBlogs.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending blog posts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                            <span>
                              Author:{" "}
                              {blog.authorName || displayUser(blog.authorId)}
                            </span>
                            <span>
                              {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(blog.status)}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => approveBlogMutation.mutate(blog._id)}
                          disabled={approveBlogMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => rejectBlogMutation.mutate(blog._id)}
                          disabled={rejectBlogMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewBlog(blog)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Blogs */}
          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts ({allBlogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {allBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No blog posts yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allBlogs.slice(0, 10).map((blog) => (
                    <div
                      key={blog._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {blog.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Author:{" "}
                          {blog.authorName || displayUser(blog.authorId)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(blog.status)}
                        <span className="text-xs text-gray-500">
                          {format(new Date(blog.createdAt), "MMM dd")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Pending Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span>Pending Campaigns ({pendingCampaigns.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending campaigns</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCampaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {campaign.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                            <span>
                              Organizer:{" "}
                              {campaign.authorName ||
                                displayUser(campaign.authorId)}
                            </span>
                            <span>{campaign.location}</span>
                            <span>
                              {format(
                                new Date(campaign.startDate),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(campaign.status)}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() =>
                            approveCampaignMutation.mutate(campaign._id)
                          }
                          disabled={approveCampaignMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() =>
                            rejectCampaignMutation.mutate(campaign._id)
                          }
                          disabled={rejectCampaignMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewCampaign(campaign)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>All Campaigns ({allCampaigns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {allCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No campaigns yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allCampaigns.slice(0, 10).map((campaign) => (
                    <div
                      key={campaign._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {campaign.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Organizer:{" "}
                          {campaign.authorName ||
                            displayUser(campaign.authorId)}{" "}
                          • {campaign.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(campaign.status)}
                        <span className="text-xs text-gray-500">
                          {format(new Date(campaign.startDate), "MMM dd")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <BlogPreviewDialog
        open={blogPreviewOpen}
        onOpenChange={setBlogPreviewOpen}
        blog={selectedBlog}
      />
      <CampaignPreviewDialog
        open={campaignPreviewOpen}
        onOpenChange={setCampaignPreviewOpen}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default AdminDashboard;