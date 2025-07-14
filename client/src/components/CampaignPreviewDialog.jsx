import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";

const CampaignPreviewDialog = ({ open, onOpenChange, campaign }) => {
  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{campaign.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Organizer: {campaign.authorName}</span>
            <Badge>{campaign.status}</Badge>
          </div>
          <p className="text-gray-600">{campaign.description}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span><strong>Location:</strong> {campaign.location}</span>
            <span><strong>Start:</strong> {campaign.startDate && new Date(campaign.startDate).toLocaleString()}</span>
            <span><strong>End:</strong> {campaign.endDate && new Date(campaign.endDate).toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-400 mt-4">
            Created on: {campaign.createdAt && new Date(campaign.createdAt).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignPreviewDialog;