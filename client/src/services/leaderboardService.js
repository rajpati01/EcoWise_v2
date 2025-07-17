import { apiService } from "./api";

class LeaderboardService {
  async getLeaderboard(page = 1, limit = 10) {
    try {
      // Note: no /api prefix needed since it's in baseURL
      const response = await apiService.get(`/leaderboard?page=${page}&limit=${limit}`);
      
      // Handle the server's response structure
      if (response && response.success === true && response.leaderboard) {
        return this._transformLeaderboardData(response.leaderboard);
      } else if (response && Array.isArray(response)) {
        console.log(`Received ${response.length} leaderboard entries (direct array)`);
        return this._transformLeaderboardData(response);
      } else {
        console.warn("Unexpected leaderboard response format:", response);
        // Fall back to mock data if the structure is unexpected
        return this._getMockData();
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return this._getMockData();
    }
  }

  async getUserRank(userId) {
    try {
      const url = userId ? `/leaderboard/user/${userId}` : '/leaderboard/user';
      const response = await apiService.get(url);
      
      if (response && response.success === true) {
        return {
          rank: response.rank || 'N/A',
          totalPoints: response.totalPoints || 0
        };
      }
      return { rank: 'N/A', totalPoints: 0 };
    } catch (error) {
      console.error("Error fetching user rank:", error);
      return { rank: 'N/A', totalPoints: 0 };
    }
  }
  
  // Transform leaderboard data from API format to component format
  _transformLeaderboardData(leaderboardData) {    
    return leaderboardData.map(entry => {
      // Extract user data handling different possible structures
      const user = entry.user || entry;
      const userId = user._id || user.id;
      const points = entry.totalPoints || entry.ecoPoints || user.ecoPoints || 0;
      
      return {
        id: userId,
        _id: userId,
        username: user.username || user.name || "User",
        level: this.getLevelFromPoints(points),
        ecoPoints: points,
        profileImage: user.profileImage || "",
        rank: entry.rank || 0
      };
    });
  }

  // Helper method to determine level from points
  getLevelFromPoints(points) {
    if (points >= 1000) return 'Eco Master';
    if (points >= 500) return 'Eco Champion';
    if (points >= 200) return 'Eco Warrior';
    if (points >= 50) return 'Eco Explorer';
    return 'Beginner';
  }
  
  // Mock data for testing or fallback
  _getMockData() {
    console.log("Returning mock leaderboard data");
    return [
      { id: "1", _id: "1", username: "rajpati01", level: "Eco Master", ecoPoints: 1250, rank: 1 },
      { id: "2", _id: "2", username: "ecoUser", level: "Eco Champion", ecoPoints: 750, rank: 2 },
      { id: "3", _id: "3", username: "greenHero", level: "Eco Warrior", ecoPoints: 450, rank: 3 },
      { id: "4", _id: "4", username: "wasteFighter", level: "Eco Explorer", ecoPoints: 300, rank: 4 },
      { id: "5", _id: "5", username: "earthFriend", level: "Beginner", ecoPoints: 120, rank: 5 },
    ];
  }
}

export const leaderboardService = new LeaderboardService();