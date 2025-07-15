import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { wasteService } from "../services/wasteService";
import { blogService } from "../services/blogService";
import { campaignService } from "../services/campaignService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import {
  User,
  Mail,
  Award,
  Camera,
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  Edit,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  // Fetch user's data
  const { data: classifications = [] } = useQuery({
    queryKey: ["/api/waste-classifications"],
    staleTime: 5 * 60 * 1000,
  });

  // const { data: classifications = [] } = useQuery({
  //   queryKey: ["waste-classifications", user?._id],
  //   queryFn: () => wasteService.getClassifications(user?._id),
  //   enabled: !!user?._id,
  // });

  const { data: userBlogs = [] } = useQuery({
    queryKey: ["/api/blogs/my"],
    queryFn: () => blogService.getMyBlogs(),
    enabled: !!user?._id,
  });

  const { data: userCampaigns = [] } = useQuery({
    queryKey: ["/api/campaigns/my"],
    queryFn: () => campaignService.getMyCampaigns(),
    enabled: !!user?._id,
  });

  const { data: joinedCampaigns = [] } = useQuery({
    queryKey: ["/api/campaigns", "joined"],
    queryFn: async () => {
      const allCampaigns = await campaignService.getCampaigns("");
      return allCampaigns.filter(
        (campaign) =>
          Array.isArray(campaign.participants) &&
          campaign.participants
            .map((id) => id.toString())
            .includes(user?._id?.toString())
      );
    },
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData({
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const totalPoints = classifications.reduce(
    (sum, item) => sum + item.pointsEarned,
    0
  );
  const thisWeekClassifications = classifications.filter(
    (item) =>
      new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const getLevelProgress = () => {
    const levels = {
      Beginner: { min: 0, max: 49 },
      "Eco Explorer": { min: 50, max: 199 },
      "Eco Warrior": { min: 200, max: 499 },
      "Eco Champion": { min: 500, max: 999 },
      "Eco Master": { min: 1000, max: Infinity },
    };

    const currentLevel = levels[user?.level] || levels["Beginner"];
    const progress =
      currentLevel.max === Infinity
        ? 100
        : Math.min(
            (((user?.ecoPoints || 0) - currentLevel.min) /
              (currentLevel.max - currentLevel.min)) *
              100,
            100
          );

    return {
      current: user?.ecoPoints || 0,
      required:
        currentLevel.max === Infinity ? "Max Level" : currentLevel.max + 1,
      percentage: Math.round(progress),
    };
  };

  const levelProgress = getLevelProgress();

  const getBlogStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
        <p className="text-xl text-gray-600">
          Track your eco-journey and manage your account
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user?.profileImage} alt={user?.username} />
                  <AvatarFallback className="text-2xl">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Badge className="text-sm">{user?.level}</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{user?.username}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Member Since</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {format(
                        new Date(user?.createdAt || Date.now()),
                        "MMMM yyyy"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Level Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {user?.ecoPoints?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Eco Points</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to next level</span>
                  <span>{levelProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  {typeof levelProgress.required === "number"
                    ? `${levelProgress.current} / ${levelProgress.required} points`
                    : levelProgress.required}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">This Week</span>
                </div>
                <span className="font-semibold">{thisWeekClassifications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Articles</span>
                </div>
                <span className="font-semibold">{userBlogs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Campaigns</span>
                </div>
                <span className="font-semibold">{userCampaigns.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="classifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="classifications">Classifications</TabsTrigger>
              <TabsTrigger value="blogs">My Articles</TabsTrigger>
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="classifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Classifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {classifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No classifications yet</p>
                      <p className="text-sm text-gray-500">
                        Start classifying waste to see your history here!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {classifications.slice(0, 10).map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.imageUrl}
                            alt="Classified waste"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-1">
                              {item.category}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {format(new Date(item.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4 text-amber-600" />
                              <span className="font-semibold text-amber-600">
                                +{item.pointsEarned}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blogs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  {userBlogs.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No articles yet</p>
                      <p className="text-sm text-gray-500">
                        Write your first article to share your knowledge!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBlogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {blog.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {blog.excerpt}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(
                                  new Date(blog.createdAt),
                                  "MMM dd, yyyy"
                                )}
                              </p>
                            </div>
                            <Badge className={getBlogStatusColor(blog.status)}>
                              {blog.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  {userCampaigns.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No campaigns created yet</p>
                      <p className="text-sm text-gray-500">
                        Create your first campaign to bring your community
                        together!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userCampaigns.map((campaign) => (
                        <div
                          key={campaign._id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {campaign.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {campaign.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{campaign.location}</span>
                                <span>
                                  {campaign.participantCount} participants
                                </span>
                                <span>
                                  {format(
                                    new Date(campaign.startDate),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={getBlogStatusColor(campaign.status)}
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* Joined Campaigns Tab */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Joined Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {joinedCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    You have not joined any campaigns yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {joinedCampaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {campaign.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{campaign.location}</span>
                            <span>
                              {campaign.participants?.length ?? 0} participants
                            </span>
                            <span>
                              {format(
                                new Date(campaign.startDate),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={getBlogStatusColor?.(campaign.status)}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
