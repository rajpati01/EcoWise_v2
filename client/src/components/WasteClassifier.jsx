import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wasteService } from "../services/wasteService";
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
import {
  Upload,
  Camera,
  Loader2,
  CheckCircle,
  Award,
  Recycle,
} from "lucide-react";

const WasteClassifier = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const { updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const simulateClassification = async (file) => {
    const fileName = file.name.toLowerCase();

    let category = "unknown";
    if (fileName.includes("plastic")) category = "plastic";
    else if (fileName.includes("paper")) category = "paper";
    else if (fileName.includes("organic")) category = "organic";
    else if (fileName.includes("hazard")) category = "hazardous";

    const guide = wasteGuides[category] || wasteGuides.unknown;

    return {
      category,
      confidence: Math.floor(Math.random() * 20) + 80, // simulate confidence
      instructions: guide.instructions,
      pointsEarned: guide.points,
    };
  };

  const classifyMutation = useMutation({
    mutationFn: (file) => wasteService.classifyWaste(file),
    onSuccess: (data) => {
      setClassificationResult({
        category: data.category,
        confidence: data.confidence,
        instructions: data.instructions,
        pointsEarned: data.pointsEarned,
      });
      // updateUser({ ecoPoints: (updateUser.ecoPoints || 0) + data.pointsEarned });
      // Update user eco points
      updateUser?.((prev) => ({
        ...prev,
        ecoPoints: (prev?.ecoPoints || 0) + data.pointsEarned,
      }));

      // Refetch classification stats and history
      queryClient.invalidateQueries({
        queryKey: ["/api/waste-classifications"],
      });

      toast({
        title: "Classification Complete!",
        description: `You earned ${data.pointsEarned} eco points!`,
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/waste-classifications"],
      });
      console.log(data);
    },
    onError: (error) => {
      toast({
        title: "Classification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setClassificationResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleClassify = () => {
    if (selectedFile) {
      classifyMutation.mutate(selectedFile);
    }
  };

  // const handleClassify = async () => {
  //   if (!selectedFile) return;
  //   const result = await simulateClassification(selectedFile);
  //   setClassificationResult(result);

  //   updateUser?.((prev) => ({
  //     ...prev,
  //     ecoPoints: (prev?.ecoPoints || 0) + result.pointsEarned,
  //   }));

  //   toast({
  //     title: "Classification Complete!",
  //     description: `You earned ${result.pointsEarned} eco points.`,
  //   });
  // };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setClassificationResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const sampleImages = [
    { name: "Plastic Bottle", type: "plastic" },
    { name: "Paper", type: "paper" },
    { name: "Organic Waste", type: "organic" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Waste Classifier
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload an image of your waste and our AI will classify it instantly,
          providing recycling recommendations and eco points.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Upload Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`file-upload-area rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragActive ? "drag-over" : ""
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {isDragActive
                      ? "Drop your image here"
                      : "Drop your image here"}
                  </p>
                  <p className="text-gray-600">or click to browse</p>
                </div>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleClassify}
                    disabled={classifyMutation.isPending}
                    className="flex-1"
                  >
                    {classifyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Recycle className="mr-2 h-4 w-4" />
                        Classify Waste
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {/* Sample Images */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Try with sample images:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleImages.map((sample) => (
                  <Button
                    key={sample.type}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // This would load a sample image in a real implementation
                      toast({
                        title: "Sample Image",
                        description:
                          "Sample image functionality would be implemented here",
                      });
                    }}
                  >
                    {sample.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Classification Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!classificationResult ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  Upload an image to see classification results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Classification Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Recycle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 capitalize">
                        {classificationResult.category}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Confidence: {classificationResult.confidence}%
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mb-4">
                    Classification Complete
                  </Badge>

                  {/* Instructions */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900">
                      Recycling Instructions:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {classificationResult.instructions?.map(
                        (instruction, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-primary">•</span>
                            <span>{instruction}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Points Earned */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary/20 mt-4">
                    <span className="text-sm font-medium text-gray-700">
                      Eco Points Earned:
                    </span>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-amber-600" />
                      <span className="text-lg font-bold text-amber-600">
                        +{classificationResult.pointsEarned}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteClassifier;
