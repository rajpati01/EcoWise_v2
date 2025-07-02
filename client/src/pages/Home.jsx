import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Leaf, Camera, Trophy, Users, BookOpen, MapPin, 
  Brain, Award, CheckCircle, ArrowRight, Star,
  Recycle, BarChart3, Calendar
} from 'lucide-react';

const Home = () => {
  // Fetch leaderboard data
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['/api/users/leaderboard'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const stats = [
    { label: "Waste Items Classified", value: "12,543", icon: Camera },
    { label: "Active Users", value: "3,847", icon: Users },
    { label: "Eco Points Earned", value: "156,920", icon: Award },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Classification",
      description: "Upload an image of your waste and our advanced AI instantly classifies it, providing recycling and reuse recommendations.",
      color: "from-emerald-50 to-emerald-100",
      iconBg: "bg-primary",
      link: "/classify"
    },
    {
      icon: Trophy,
      title: "Eco Points & Rewards",
      description: "Earn points for every eco-friendly action. Compete with friends and climb the leaderboard while making a difference.",
      color: "from-amber-50 to-amber-100",
      iconBg: "bg-accent",
      link: "/leaderboard"
    },
    {
      icon: Users,
      title: "Community Campaigns",
      description: "Create and join local environmental campaigns. Connect with like-minded individuals in your area.",
      color: "from-sky-50 to-sky-100",
      iconBg: "bg-secondary",
      link: "/campaigns"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Access expert articles, tips, and guides on sustainable living, waste reduction, and environmental protection.",
      color: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-600",
      link: "/blog"
    },
    {
      icon: MapPin,
      title: "Smart Disposal Centers",
      description: "Find nearby recycling centers, disposal facilities, and collection points with our interactive map.",
      color: "from-green-50 to-green-100",
      iconBg: "bg-green-600",
      link: "/centers"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your environmental impact with detailed analytics and progress reports on your eco-journey.",
      color: "from-indigo-50 to-indigo-100",
      iconBg: "bg-indigo-600",
      link: "/profile"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-sky-50 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-secondary rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Smart Waste Management for a 
                <span className="text-primary"> Greener Future</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of eco-warriors using AI-powered waste classification, earning rewards, and building sustainable communities together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/classify">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto">
                    <Camera className="mr-2 h-5 w-5" />
                    Classify Waste Now
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4 h-auto"
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up">
              <img 
                src="https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800" 
                alt="EcoWise mobile app interface" 
                className="rounded-3xl shadow-2xl w-full max-w-md mx-auto" 
              />
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 hidden lg:block animate-bounce">
                <div className="flex items-center space-x-2">
                  <Award className="text-accent text-xl" />
                  <div>
                    <div className="font-semibold text-gray-900">+50 Points</div>
                    <div className="text-sm text-gray-600">Plastic Recycled</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 hidden lg:block animate-pulse">
                <div className="flex items-center space-x-2">
                  <Recycle className="text-primary text-xl" />
                  <div>
                    <div className="font-semibold text-gray-900">95% Accuracy</div>
                    <div className="text-sm text-gray-600">AI Classification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Sustainable Living
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines AI technology, community engagement, and educational resources to make waste management simple and rewarding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`bg-gradient-to-br ${feature.color} hover-lift border-0 animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                      <IconComponent className="text-white text-2xl h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link href={feature.link}>
                      <Button variant="ghost" className="p-0 h-auto font-semibold group">
                        Learn More 
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Community Leaderboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how you rank among our eco-warriors. Compete with friends and earn recognition for your environmental efforts.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Leaderboard */}
              <div className="space-y-4">
                {leaderboard.slice(0, 3).map((user, index) => (
                  <Card key={user.id} className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                          'bg-gradient-to-br from-amber-600 to-amber-800'
                        }`}>
                          {index < 3 ? (
                            <Trophy className="text-white h-6 w-6" />
                          ) : (
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{user.username}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {user.level}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-accent">
                            {user.ecoPoints?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-600">points</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="text-center pt-4">
                  <Link href="/leaderboard">
                    <Button className="bg-accent hover:bg-accent/90">
                      View Full Leaderboard
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Achievement Showcase */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 text-center lg:text-left">
                  Earn Achievements
                </h3>
                
                {/* Badge Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Star, name: "First Classification", unlocked: true },
                    { icon: Award, name: "100 Points", unlocked: true },
                    { icon: Trophy, name: "500 Points", unlocked: false },
                    { icon: Users, name: "Team Player", unlocked: true },
                    { icon: Calendar, name: "7 Day Streak", unlocked: false },
                    { icon: Award, name: "Eco Master", unlocked: false },
                  ].map((badge, index) => (
                    <Card key={index} className={`text-center p-4 ${badge.unlocked ? 'bg-white' : 'bg-gray-100 opacity-50'}`}>
                      <CardContent className="p-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          badge.unlocked ? 'bg-primary' : 'bg-gray-300'
                        }`}>
                          <badge.icon className={`h-6 w-6 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <p className={`text-xs font-medium ${badge.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                          {badge.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Progress Bar */}
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Next Level Progress</span>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      150 / 200 points to Eco Champion
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join our community of eco-warriors today and start your journey towards sustainable living. Every small action counts!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 h-auto text-lg font-bold">
                  <Users className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 h-auto text-lg font-bold"
              >
                <Camera className="mr-2 h-5 w-5" />
                Try Classifier
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-emerald-100">
              {[
                { label: "Active Users", value: "10k+" },
                { label: "Items Classified", value: "50k+" },
                { label: "Communities", value: "500+" },
                { label: "Points Earned", value: "1M+" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
