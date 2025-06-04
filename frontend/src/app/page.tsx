"use client";

import { useState, useEffect, ChangeEvent, DragEvent } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { UploadCloud, Image as ImageIcon, Lightbulb, Zap, Scale, Brain, FileText, Github, Moon, Sun, XCircle, CheckCircle, Edit3, Utensils, History, MessageSquareWarning, Send, BarChart3, ListChecks, Search} from 'lucide-react';
import {food101SampleItems} from "@/app/foodsamples"
import { useMutation} from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { usePing } from "@/hooks/usePing";

// Define a type for the prediction result
interface PredictionResult {
  name: string;
  confidence: number;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
}

// New interface for Top 5 Probabilities
interface ProbabilityItem {
  name: string;
  value: number;
}



export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  console.log(mounted)
  const { theme, setTheme } = useTheme();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState("model-info"); // Default to model-info
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [isDialogCorrectPredictionOpen, setIsDialogCorrectPredictionOpen] = useState(false);
  const [correctPredictionInput, setCorrectPredictionInput] = useState("");
  const [isSubmitFeedBackLoading , setIsSubmitFeedBackLoading] = useState(false);

  // States for Top 5 Probabilities Modal
  const [isProbabilitiesModalOpen, setIsProbabilitiesModalOpen] = useState(false);
  const [isLoadingProbabilities, setIsLoadingProbabilities] = useState(false);
  const [topProbabilitiesData, setTopProbabilitiesData] = useState<ProbabilityItem[]>([]);

  // States for Predictable Items Modal
  const [isPredictableItemsModalOpen, setIsPredictableItemsModalOpen] = useState(false);
  const [isLoadingPredictableItems, setIsLoadingPredictableItems] = useState(false);
  const [predictableItemsSearchTerm, setPredictableItemsSearchTerm] = useState("");
  const [filteredPredictableItems, setFilteredPredictableItems] = useState<string[]>(food101SampleItems);
   const models = [
    {name: "pizza_steak_sushi", displayName:" TinyVGG Beta"},
    { name: "model_0", displayName: "Model 0"},
    { name: "model_1", displayName: "Model 1"},
  ]
  const [selectedModel, setSelectedModel] = useState(models[0].name); // Default model

  useEffect(() => {
    setMounted(false);
  }, []);
  const {isLoading: isPingLoading} = usePing();

  // Effect to filter predictable items based on search term
  useEffect(() => {
    if (predictableItemsSearchTerm === "") {
      setFilteredPredictableItems(food101SampleItems);
    } else {
      setFilteredPredictableItems(
        food101SampleItems.filter(item =>
          item.toLowerCase().includes(predictableItemsSearchTerm.toLowerCase())
        )
      );
    }
  }, [predictableItemsSearchTerm]);



  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setPrediction(null);
      setShowFeedbackButtons(false);
      setTopProbabilitiesData([]); // Clear probabilities on new image
    }
  };

  // Define the argument type for the mutation function
  interface PredictArgs {
    file: File;
    model: string;
  }

  interface PredictResponse {
    success: boolean;
    model: string;
    class_name: string;
    confidence_scores: {[key: string]: number};
    class_id: Int16Array,
    nutrients: {
      id: Int16Array;
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
      fiber: string;
      sugar: string;
    }
  }


  const { mutate: usePredict, isError, isPending } = useMutation({
  mutationFn: async ({ file, model }: PredictArgs) => {
    const formData = new FormData();
    formData.append('file', file);           // file: File object
    formData.append('model_name', model);    // model: "model_0" or "model_1"

    const res = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      body: formData, // No need to set Content-Type manually
    });

    if (!res.ok) {
      throw new Error('Failed to fetch prediction');
    }

    const data: PredictResponse = await res.json();
    return data;
  },

  onSuccess: (data: PredictResponse) => {
    if (data.success) {
      console.log("Prediction data:", data);
      
      setPrediction({
        name: data.class_name,
        confidence: Math.round(data.confidence_scores[data.class_name] * 100),
        calories: data.nutrients.calories,
        protein: data.nutrients.protein,       
        carbs: data.nutrients.carbs,         
        fat: data.nutrients.fat,           
        fiber: data.nutrients.fiber,        
        sugar: data.nutrients.sugar,        
      });
      setIsLoading(false);
      setShowFeedbackButtons(true);
      setTopProbabilitiesData(
        Object.entries(data.confidence_scores)
          .map(([name, value]) => ({ name, value: Math.round(value * 100) }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5) // Show top 5 probabilities
      );
    } else {
      toast.error("Prediction failed. Please try again.");
    }
  },
  onError: (error: any) => {
    setIsLoading(false);
    console.error("Prediction error:", error);
    toast.error(error.message || "An error occurred while fetching prediction. Please try again.");
  }
});

interface FeedbackArgs {
  model_name: string;
  image: File | null;
  predicted: string;
  response: string;
}

const {mutate: useFeedback, isPending: isFeedBackPending} = useMutation({
  mutationFn: async ({model_name , image, predicted , response}: FeedbackArgs) => {
    const formData = new FormData();
    formData.append('model_name', model_name); // model: "model_0" or "model_1"
    formData.append('predicted', predicted); // predicted food item
    formData.append('response', response); // user feedback (corrected food item)
    if (image) {
      formData.append('image', image); // Optional: include the image file if available
    }
    const res = await fetch(`${backendUrl}/feedback`, {
      method: 'POST',
      body: formData, // No need to set Content-Type manually
    });
    if (!res.ok) {
      throw new Error('Failed to submit feedback');
    }
    const data = await res.json();
    return data;
  },

  onSuccess: ()=>{
    setIsSubmitFeedBackLoading(false);
    toast.info(`Feedback submitted: ${correctPredictionInput}`, { description: "Thanks for helping us improve our model!" });
    setCorrectPredictionInput("");
    setIsDialogCorrectPredictionOpen(false);
    setShowFeedbackButtons(false);
  },
  onError: (error: any) => {
    setIsSubmitFeedBackLoading(false);
    console.error("Feedback error:", error);
    toast.error(error.message || "An error occurred while submitting feedback. Please try again.");
  }
})


  const handlePredict = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setPrediction(null); // Clear previous prediction
    setActiveTab("prediction-results"); // Switch to prediction tab
    setShowFeedbackButtons(false);
    setTopProbabilitiesData([]); // Clear previous probabilities
    
    usePredict({
      file: selectedImage,
      model: selectedModel
    })
  };
  
  // Placeholder for drag and drop handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setPrediction(null);
      setShowFeedbackButtons(false);
      setTopProbabilitiesData([]); // Clear probabilities on new image
    } else {
      // Handle invalid file type
      alert("Please upload a JPG, PNG, or WEBP image.");
    }
  };

  const handleYesCorrect = () => {
    toast.success("Thank you for your feedback!", { description: "We appreciate you helping us improve." });
    setShowFeedbackButtons(false);
  };

  const handleNoIncorrect = () => {
    setIsDialogCorrectPredictionOpen(true);
  };

  const handleSubmitCorrectedPrediction = async() => {
    if (correctPredictionInput.trim() === "") {
        toast.error("Please enter the correct food item.");
        return;
    }
    setIsSubmitFeedBackLoading(true);
    useFeedback({
      model_name: selectedModel,
      image: selectedImage, // Include the image file if available
      predicted: prediction?.name || "",
      response: correctPredictionInput.trim()
    })
    
  };

  const handleViewTopProbabilities = () => {
    setIsProbabilitiesModalOpen(true);
    setIsLoadingProbabilities(false);
  };

  const handleOpenPredictableItemsModal = async () => {
    setIsPredictableItemsModalOpen(true);
    setIsLoadingPredictableItems(true); // Simulate loading
    setPredictableItemsSearchTerm(""); // Reset search
    // Simulate fetching/preparing list
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setFilteredPredictableItems(food101SampleItems); // Set initial list
    setIsLoadingPredictableItems(false);
  };

  if (isPingLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="py-4 px-6 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">FoodVision</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" disabled><Github className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" disabled><Moon className="h-5 w-5" /></Button>
          </div>
        </header>
        {/*
        <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col gap-6">
                <Skeleton className="h-[150px] w-full rounded-lg" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </main> */}
        <Loading/>
      </div>
    );
  }

 
  

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">FoodVision</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Model Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
              <CardDescription>Choose a model trained on food recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => {
                console.log("Selected model:", selectedModel);
                setSelectedModel(value)}} value={selectedModel} >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {/*<SelectItem value="efficientnet-b0">EfficientNet-B0</SelectItem>*/}
                  {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Image Upload Card */}
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>Upload or drag & drop a food image</CardDescription>
            </CardHeader>
            <CardContent 
              className="flex flex-col items-center justify-center h-full space-y-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="Selected food" className="object-contain w-full h-full" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => { 
                        setImagePreview(null); 
                        setSelectedImage(null); 
                        setPrediction(null); 
                        setShowFeedbackButtons(false);
                        setTopProbabilitiesData([]); // Clear probabilities
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="w-full cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:border-primary/70 transition-colors">
                  <UploadCloud className="h-16 w-16 text-muted-foreground/70 mb-4" />
                  <p className="text-muted-foreground font-semibold">Drag and drop or click to upload</p>
                  <p className="text-sm text-muted-foreground/80">Supports JPG, PNG, WEBP</p>
                </label>
              )}
              <input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
              {!imagePreview && (
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Button size="lg" className="w-full" onClick={handlePredict} disabled={!selectedImage || isLoading}>
            {isLoading ?(
              <>
            <span className="loading-spinner"></span> 
            <span>Predicting... </span>
            </>
            )
            : "Predict Food Item"}
          </Button>
          <Button variant="outline" size="lg" className="w-full flex items-center" onClick={handleOpenPredictableItemsModal}>
            <ListChecks className="mr-2 h-5 w-5" /> View Predictable Items
          </Button>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prediction-results">Prediction Results</TabsTrigger>
              <TabsTrigger value="model-info">Model Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prediction-results" className="flex-grow p-4 border rounded-b-md">
              {isLoading ? (
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-10 w-1/2 mx-auto rounded-md" /> 
                  
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="pt-6 space-y-2">
                     <Skeleton className="h-5 w-1/3"/>
                     <div className="flex gap-4">
                        <Skeleton className="h-10 w-1/2"/>
                        <Skeleton className="h-10 w-1/2"/>
                     </div>
                  </div>
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Model's analysis of the food image</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <Utensils className="h-7 w-7 text-primary" />
                        <h2 className="text-2xl font-semibold">{prediction.name}</h2>
                        <span className="ml-auto text-lg font-medium text-primary">{prediction.confidence}% confident</span>
                    </div>
                  </div>
                  <Progress value={prediction.confidence} className="h-3 [&>div]:bg-primary" />
                  <Button variant="outline" className="w-full sm:w-auto sm:mx-auto flex items-center" onClick={handleViewTopProbabilities}>
                    <History className="mr-2 h-4 w-4" /> View Top 5 Probabilities
                  </Button>

                  <div className="pt-2">
                    <h3 className="text-xl font-semibold flex items-center"><Edit3 className="mr-2 h-5 w-5 text-primary" />Nutritional Information</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {(Object.keys(prediction) as Array<keyof PredictionResult>).filter(key => !['name', 'confidence', 'fiber', 'sugar'].includes(key)).map((key) => (
                        <Card key={key} className="p-4 bg-muted/30">
                          <CardTitle className="text-sm font-medium capitalize text-muted-foreground">{key}</CardTitle>
                          <p className="text-2xl font-semibold">{prediction[key]}</p>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                        <span>Fiber: {prediction.fiber}</span>
                        <span>Sugar: {prediction.sugar}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                   
                    {showFeedbackButtons && (
                      <>
                       <h4 className="text-md font-semibold mb-3 text-center">Is this prediction correct?</h4>
                      <div className="flex gap-4">
                        <Button variant="destructive" className="flex-1" onClick={handleNoIncorrect}>
                          <XCircle className="mr-2 h-4 w-4" /> No, it's incorrect
                        </Button>
                        <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleYesCorrect}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Yes, it's correct
                        </Button>
                      </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ImageIcon className="h-24 w-24 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Upload an image and click "Predict Food Item" to see results.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="model-info" className="flex-grow p-1 border rounded-b-md">
              <Card className="shadow-none border-none h-full">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">EfficientNet-B0</CardTitle>
                    <CardDescription>Model Specifications & Performance</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1 flex items-center"><Lightbulb className="h-4 w-4 mr-2 text-primary" />Model Architecture</h3>
                    <p className="text-muted-foreground">EfficientNet architecture with compound scaling method that uniformly scales all dimensions of depth/width/resolution using a compound coefficient.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Accuracy</p>
                        <p className="text-muted-foreground">91.2%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Scale className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Inference Time</p>
                        <p className="text-muted-foreground">35 ms</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Model Size</p>
                        <p className="text-muted-foreground">29 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Training Data</p>
                        <p className="text-muted-foreground">25000 images</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Description</h3>
                    <p className="text-muted-foreground">A compact and efficient model optimized for mobile and edge devices. Achieves good accuracy while maintaining low inference time.</p>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                    View Research Paper <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Dialog open={isDialogCorrectPredictionOpen} onOpenChange={setIsDialogCorrectPredictionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center"><MessageSquareWarning className="mr-2 h-5 w-5 text-destructive"/> Oops! Our Mistake</DialogTitle>
            <DialogDescription>
              We are sorry that our prediction was incorrect. Please help us improve by telling us the correct food item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="correct-prediction"
              placeholder="e.g., Apple, Banana, etc."
              value={correctPredictionInput}
              onChange={(e) => setCorrectPredictionInput(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitFeedBackLoading}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitCorrectedPrediction} disabled={isFeedBackPending}>
              {isFeedBackPending ? <span className="loading-spinner"></span> : <Send className="mr-2 h-4 w-4"/>}
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Top 5 Probabilities Modal */}
      <Dialog open={isProbabilitiesModalOpen} onOpenChange={setIsProbabilitiesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary"/>Top 5 Probabilities</DialogTitle>
            <DialogDescription>
              Detailed breakdown of the model's top predictions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {isLoadingProbabilities ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-4 w-1/5" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))
            ) : topProbabilitiesData.length > 0 ? (
              topProbabilitiesData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2 [&>div]:bg-primary/80" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">No probability data available.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProbabilitiesModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Predictable Items Modal */}
      <Dialog open={isPredictableItemsModalOpen} onOpenChange={setIsPredictableItemsModalOpen}>
        <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Predictable Food Items ({filteredPredictableItems.length})</DialogTitle>
            <DialogDescription>
              List of food items the model is trained to recognize (Food101 Dataset - Sample).
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-2 mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search food items..."
              className="pl-10"
              value={predictableItemsSearchTerm}
              onChange={(e) => setPredictableItemsSearchTerm(e.target.value)}
            />
          </div>
          {isLoadingPredictableItems ? (
            <div className="flex-grow space-y-2 min-h-0 overflow-y-auto">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <ScrollArea className="flex-grow pr-3 min-h-0">
              {filteredPredictableItems.length > 0 ? (
                <ul className="space-y-1">
                  {filteredPredictableItems.map((item, index) => (
                    <li key={index} className="p-2 text-sm border-b border-border/50 hover:bg-muted/50 rounded-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">No items match your search.</p>
              )}
            </ScrollArea>
          )}
          <DialogFooter className="mt-auto pt-4">
            <Button variant="outline" onClick={() => setIsPredictableItemsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
