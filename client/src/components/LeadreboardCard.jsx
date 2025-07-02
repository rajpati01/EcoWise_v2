import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge'; 
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardCard = ({ user, rank, showRank = true }) => {
  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Eco Master':
        return 'bg-purple-100 text-purple-800';
      case 'Eco Champion':
        return 'bg-blue-100 text-blue-800';
      case 'Eco Warrior':
        return 'bg-green-100 text-green-800';
      case 'Eco Explorer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${rank <= 3 ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          {showRank && (
            <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(rank)} rounded-full flex items-center justify-center flex-shrink-0`}>
              {rank <= 3 ? getRankIcon(rank) : (
                <span className="text-white font-bold">#{rank}</span>
              )}
            </div>
          )}

          {/* Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {user.username}
            </h4>
            <Badge variant="secondary" className={getLevelColor(user.level)}>
              {user.level}
            </Badge>
          </div>

          {/* Points */}
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">
              {user.ecoPoints?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
