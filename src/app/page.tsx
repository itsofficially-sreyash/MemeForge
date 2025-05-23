
"use client";

import { useState, useRef, useCallback } from "react";
import { ImageUploader } from "@/components/meme-forge/image-uploader";
import { MemeCanvas } from "@/components/meme-forge/meme-canvas";
import { CaptionControls } from "@/components/meme-forge/caption-controls";
import { AiSuggestions } from "@/components/meme-forge/ai-suggestions";
import { MemeLibrary } from "@/components/meme-forge/meme-library"; // Added import
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, Sparkles, Menu } from "lucide-react";
import { suggestMemeCaptions } from "@/ai/flows/suggest-meme-captions";
import type { Caption } from "@/lib/types";
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_OUTLINE_COLOR, DEFAULT_OUTLINE_WIDTH_FACTOR, DEFAULT_TEXT_COLOR } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function MemeForgePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [selectedCaptionId, setSelectedCaptionId] = useState<string | null>(null);
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setCaptions([]); 
    setSelectedCaptionId(null);
    setSuggestedCaptions([]); 
    // Automatically close sidebar if an image is uploaded/selected from it
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    await generateSuggestions(imageDataUrl);
  }, [isSidebarOpen]); // Added isSidebarOpen to dependencies

  const generateSuggestions = async (imageDataUrl: string | null = uploadedImage) => {
    if (!imageDataUrl) {
      toast({ title: "Error", description: "Please upload an image or select a template first.", variant: "destructive" });
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const result = await suggestMemeCaptions({ photoDataUri: imageDataUrl });
      setSuggestedCaptions(result.captions);
      if (result.captions.length === 0) {
        toast({ title: "AI Suggestions", description: "No captions suggested. Try a different image or be the AI yourself!" });
      }
    } catch (error) {
      console.error("Error generating captions:", error);
      toast({ title: "AI Error", description: "Could not generate suggestions. Please try again.", variant: "destructive" });
      setSuggestedCaptions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };


  const handleAddCaption = () => {
    const newCaption: Caption = {
      id: Date.now().toString(),
      text: "New Caption",
      x: 0.5, 
      y: captions.length % 2 === 0 ? 0.15 : 0.85, 
      fontSize: DEFAULT_FONT_SIZE,
      fontFamily: DEFAULT_FONT_FAMILY,
      color: DEFAULT_TEXT_COLOR,
      outlineColor: DEFAULT_OUTLINE_COLOR,
      outlineWidth: DEFAULT_OUTLINE_WIDTH_FACTOR,
      rotation: 0,
      isMirrored: false,
    };
    setCaptions(prev => [...prev, newCaption]);
    setSelectedCaptionId(newCaption.id);
  };

  const handleCaptionChange = (id: string, updates: Partial<Caption>) => {
    setCaptions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleSelectCaption = (id: string | null) => {
    setSelectedCaptionId(id);
  };

  const handleDeleteCaption = (id: string) => {
    setCaptions(prev => prev.filter(c => c.id !== id));
    if (selectedCaptionId === id) {
      setSelectedCaptionId(null);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (selectedCaptionId) {
      handleCaptionChange(selectedCaptionId, { text: suggestion });
    } else {
      const newCaption: Caption = {
        id: Date.now().toString(),
        text: suggestion,
        x: 0.5,
        y: 0.5,
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        color: DEFAULT_TEXT_COLOR,
        outlineColor: DEFAULT_OUTLINE_COLOR,
        outlineWidth: DEFAULT_OUTLINE_WIDTH_FACTOR,
        rotation: 0,
        isMirrored: false,
      };
      setCaptions(prev => [...prev, newCaption]);
      setSelectedCaptionId(newCaption.id);
    }
    toast({ title: "Suggestion Applied!", description: `"${suggestion.substring(0,30)}..." applied.`});
     // Close sidebar if a suggestion is applied from it
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleDownloadMeme = () => {
    const canvas = canvasRef.current;
    if (canvas && uploadedImage) { 
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "memeforge_meme.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Meme Downloaded!", description: "Your masterpiece is saved." });
    } else {
      toast({ title: "Download Error", description: "No image to download or canvas not ready.", variant: "destructive" });
    }
  };

  const ControlPanel = () => (
    <div className="space-y-6 p-1">
      <ImageUploader onImageUpload={handleImageUpload} disabled={isLoadingSuggestions} />
      <MemeLibrary onSelectImage={handleImageUpload} disabled={isLoadingSuggestions} />
      <AiSuggestions
        suggestions={suggestedCaptions}
        isLoading={isLoadingSuggestions}
        onApplySuggestion={handleApplySuggestion}
        onGenerateSuggestions={() => generateSuggestions()}
        disabled={!uploadedImage || isLoadingSuggestions}
      />
      {uploadedImage && (
        <CaptionControls
          captions={captions}
          selectedCaptionId={selectedCaptionId}
          onAddCaption={handleAddCaption}
          onCaptionChange={handleCaptionChange}
          onSelectCaption={handleSelectCaption}
          onDeleteCaption={handleDeleteCaption}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">MemeForge</h1>
          </div>
          <div className="md:hidden">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Controls</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                    <ControlPanel />
                  </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {uploadedImage && (
              <Button onClick={handleDownloadMeme} variant="default" disabled={isLoadingSuggestions}>
                <Download className="mr-2 h-4 w-4" /> Download Meme
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-[3fr_2fr] gap-8 h-full">
          <div className="flex flex-col items-center justify-center bg-muted/30 p-4 rounded-lg shadow-inner min-h-[300px] md:min-h-[calc(100vh-12rem)]">
             <MemeCanvas
                ref={canvasRef}
                imageSrc={uploadedImage}
                captions={captions}
                selectedCaptionId={selectedCaptionId}
                onCaptionChange={handleCaptionChange}
                onSelectCaption={handleSelectCaption}
              />
              {uploadedImage && (
                <Button onClick={handleDownloadMeme} variant="default" className="mt-4 md:hidden" disabled={isLoadingSuggestions}>
                  <Download className="mr-2 h-4 w-4" /> Download Meme
                </Button>
              )}
              {!uploadedImage && (
                 <div className="text-center text-muted-foreground">
                   <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                   <p>Your meme will appear here.</p>
                   <p className="text-sm">Upload an image or pick a template to get started!</p>
                 </div>
              )}
          </div>

          <aside className="hidden md:block md:sticky md:top-20 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto space-y-6 custom-scrollbar pr-2">
            <ControlPanel />
          </aside>
        </div>
      </main>
       <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MemeForge. Create, Laugh, Share.
        </div>
      </footer>
    </div>
  );
}
