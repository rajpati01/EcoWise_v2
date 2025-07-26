import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./ui/use-toast"; // Updated import
import { blogService } from "../services/blogService";

const CommentForm = ({ blogId, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast(); // Updated hook usage

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to post a comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await blogService.addComment(blogId, comment);
      setComment("");
      toast({
        title: "Comment Posted",
        description: "Your comment has been added successfully",
      });
      
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 mb-2">Login to join the discussion</p>
        <Button variant="outline" onClick={() => window.location.href = "/login"}>
          Login to Comment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <Textarea
            placeholder="Add to the discussion..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[80px]"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !comment.trim()}
          className="flex items-center"
        >
          {isSubmitting ? (
            <>Posting...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;