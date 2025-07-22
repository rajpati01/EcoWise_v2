
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wasteService } from '../services/wasteService';
import WasteClassifier from '../components/WasteClassifier';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Camera, History, Award, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const WasteClassification = () => {
  const { data: classifications = [], isLoading } = useQuery({
    queryKey: ['/api/waste-classifications'],
    queryFn: () => wasteService.getClassifications(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const totalPoints = classifications.reduce((sum, item) => sum + item.pointsEarned, 0);
  const totalClassifications = classifications.length;

  const getCategoryColor = (category) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-800',
      paper: 'bg-green-100 text-green-800',
      glass: 'bg-purple-100 text-purple-800',
      metal: 'bg-gray-100 text-gray-800',
      organic: 'bg-amber-100 text-amber-800',
      electronic: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Waste Classification</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Use our AI-powered classifier to identify your waste and get recycling recommendations. 
          Earn eco points for every classification!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalClassifications}</div>
            <div className="text-sm text-gray-600">Total Classifications</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-600">{totalPoints}</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">
              {totalClassifications > 0 ? Math.round(totalPoints / totalClassifications) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Points/Item</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Classifier */}
      <WasteClassifier />

      {/* Classification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Classification History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading history...</p>
            </div>
          ) : classifications.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No classifications yet</p>
              <p className="text-sm text-gray-500">Upload your first image above to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {classifications.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.imageUrl}
                    alt="Classified waste"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {item.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(item.createdAt), 'MMM dd, yyyy at h:mm a')}
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
              
              {classifications.length > 10 && (
                <p className="text-center text-sm text-gray-500 pt-4">
                  Showing recent 10 classifications out of {classifications.length} total
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteClassification;
