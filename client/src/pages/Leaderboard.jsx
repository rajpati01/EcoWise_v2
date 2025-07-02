import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LeaderboardCard from '../components/LeadreboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge'; 
import { Trophy, Award, Users, TrendingUp, Crown, Star, Loader2 } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['/api/users/leaderboard'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const userRank = leaderboard.findIndex(u => u.id === user?.id) + 1;
  const totalUsers = leaderboard.length;

  const getLevelStats = () => {
    const levels = leaderboard.reduce((acc, user) => {
      acc[user.level] = (acc[user.level] || 0) + 1;
      return acc;
    }, {});
    return levels;
  };

  const levelStats = getLevelStats();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="h-10 w-10 text-amber-500" />
          <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how you rank among our eco-warriors. Every sustainable action counts towards building a greener future!
        </p>
      </div>

      {/* User Stats */}
      {user && userRank > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your Ranking</h3>
                  <p className="text-gray-600">Keep up the great work!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">#{userRank}</div>
                <div className="text-sm text-gray-600">out of {totalUsers} users</div>
                <Badge className="mt-2">
                  {user.level}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {leaderboard[0]?.ecoPoints.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Top Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">
              {Math.round(leaderboard.reduce((sum, u) => sum + u.ecoPoints, 0) / totalUsers) || 0}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">
              {levelStats['Eco Master'] || 0}
            </div>
            <div className="text-sm text-gray-600">Eco Masters</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Star className="h-6 w-6 text-amber-500" />
            <span>Top Eco-Warriors</span>
          </h2>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <Card className="bg-gradient-to-br from-gray-100 to-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{leaderboard[1].username}</h3>
                  <Badge variant="secondary" className="mb-2">{leaderboard[1].level}</Badge>
                  <div className="text-xl font-bold text-gray-700">
                    {leaderboard[1].ecoPoints.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </CardContent>
              </Card>

              {/* 1st Place */}
              <Card className="bg-gradient-to-br from-amber-100 to-amber-200 scale-105 z-10">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{leaderboard[0].username}</h3>
                  <Badge className="bg-amber-600 mb-2">{leaderboard[0].level}</Badge>
                  <div className="text-2xl font-bold text-amber-700">
                    {leaderboard[0].ecoPoints.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </CardContent>
              </Card>

              {/* 3rd Place */}
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{leaderboard[2].username}</h3>
                  <Badge variant="secondary" className="mb-2">{leaderboard[2].level}</Badge>
                  <div className="text-xl font-bold text-amber-700">
                    {leaderboard[2].ecoPoints.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Full Rankings */}
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <LeaderboardCard
                key={user.id}
                user={user}
                rank={index + 1}
                showRank={true}
              />
            ))}
          </div>

          {leaderboard.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Rankings Yet</h3>
                <p className="text-gray-600">Be the first to start earning eco points!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Level Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(levelStats).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{level}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(count / totalUsers) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Achievement Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { level: 'Beginner', points: '0-49', color: 'bg-gray-500' },
                { level: 'Eco Explorer', points: '50-199', color: 'bg-yellow-500' },
                { level: 'Eco Warrior', points: '200-499', color: 'bg-green-500' },
                { level: 'Eco Champion', points: '500-999', color: 'bg-blue-500' },
                { level: 'Eco Master', points: '1000+', color: 'bg-purple-500' },
              ].map((achievement) => (
                <div key={achievement.level} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${achievement.color}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.level}</div>
                    <div className="text-xs text-gray-600">{achievement.points} points</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Earn More Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Classify waste items (+20-40 points)</div>
              <div>• Join campaigns (+10 points)</div>
              <div>• Write blog posts (+25 points)</div>
              <div>• Comment on articles (+5 points)</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
