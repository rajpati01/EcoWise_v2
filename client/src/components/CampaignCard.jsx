import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignService } from "../services/campaignService";
import { useAuth } from "../hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { Calendar, MapPin, Users, User } from "lucide-react";
import { format } from "date-fns";

const CampaignCard = ({ campaign }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [justJoined, setJustJoined] = useState(false);

   const hasJoined = justJoined || (user && campaign.participants && (
    // Check if participants is an array of objects with user property
    (campaign.participants.length > 0 && campaign.participants[0].user) 
      ? campaign.participants.some(p => p.user && p.user.toString() === user._id.toString())
      // Fallback to simple array check
      : campaign.participants.some(id => id && id.toString() === user._id.toString())
  ));

  const joinMutation = useMutation({
    mutationFn: () => campaignService.joinCampaign(campaign._id),
    onSuccess: () => {
      setJustJoined(true);
      toast({
        title: "Joined Campaign!",
        description:
          "You've successfully joined this campaign and earned 10 eco points!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Join",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const isUpcoming = new Date(campaign.startDate) > new Date();
  const isActive =
    new Date() >= new Date(campaign.startDate) &&
    new Date() <= new Date(campaign.endDate);
  const isEnded = new Date() > new Date(campaign.endDate);

  return (
    <Card className="hover-lift">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
            {campaign.title}
          </CardTitle>
          {getStatusBadge(campaign.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campaign Image */}
        {campaign.imageUrl && (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {campaign.description}
        </p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{campaign.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              {format(new Date(campaign.startDate), "MMM dd")} -{" "}
              {format(new Date(campaign.endDate), "MMM dd, yyyy")}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{campaign.participantCount} participants</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          {isUpcoming && (
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Upcoming
            </Badge>
          )}
          {isActive && (
            <Badge className="bg-green-100 text-green-800">Active Now</Badge>
          )}
          {isEnded && <Badge variant="secondary">Completed</Badge>}
        </div>

        {/* Action Button */}
        {campaign.status === "approved" && isAuthenticated && !isEnded && (
          <Button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending || hasJoined}
            className="w-full"
          >
            {hasJoined ? (
              <>
                <User className="mr-2 h-4 w-4" />
                Joined
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                {joinMutation.isPending ? "Joining..." : "Join Campaign"}
              </>
            )}
          </Button>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-gray-500 text-center py-2">
            Login to join campaigns
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
