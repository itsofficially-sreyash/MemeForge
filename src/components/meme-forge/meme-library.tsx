
"use client";

import NextImage from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface MemeTemplate {
  id: string;
  src: string;
  alt: string;
  hint: string;
}

// Updated meme templates with Unsplash URLs
const memeTemplates: MemeTemplate[] = [
  { id: "drake", src: "https://images.unsplash.com/photo-1533923156502-be31530547c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxkcmFrZSUyMGhvdGxpbmV8ZW58MHx8fHwxNzQ4MDIwNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Drake Hotline Bling Meme Template", hint: "drake hotline" },
  { id: "distracted-bf", src: "https://images.unsplash.com/photo-1475204257634-df83964505c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXN0cmFjdGVkJTIwYm95ZnJpZW5kfGVufDB8fHx8MTc0ODAyMDQ3MXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Distracted Boyfriend Meme Template", hint: "distracted boyfriend" },
  { id: "one-does-not-simply", src: "https://images.unsplash.com/photo-1511253819057-5408d4d70465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxib3JvbWlyJTIwbG9yZCUyMHJpbmdzfGVufDB8fHx8MTc0ODAyMDQ3MXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "One Does Not Simply Meme Template", hint: "boromir lord rings" },
  { id: "expanding-brain", src: "https://images.unsplash.com/photo-1566669437687-7040a6926753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxleHBhbmRpbmclMjBicmFpbnxlbnwwfHx8fDE3NDgwMjA0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Expanding Brain Meme Template", hint: "expanding brain" },
  { id: "woman-yelling-cat", src: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3b21hbiUyMHllbGxpbmclMjBjYXR8ZW58MHx8fHwxNzQ4MDIwNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Woman Yelling at Cat Meme Template", hint: "woman yelling cat" },
  { id: "change-my-mind", src: "https://images.unsplash.com/photo-1608493830924-ec843d9c98c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjaGFuZ2UlMjBteSUyMG1pbmR8ZW58MHx8fHwxNzQ4MDIwNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Change My Mind Meme Template", hint: "change my mind" },
  { id: "success-kid", src: "https://images.unsplash.com/photo-1608093829255-31b11b093a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c3VjY2VzcyUyMGtpZHxlbnwwfHx8fDE3NDgwMjA0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Success Kid Meme Template", hint: "success kid" },
  { id: "futurama-fry", src: "https://images.unsplash.com/photo-1525518392674-39ba1fca2ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmdXR1cmFtYSUyMGZyeXxlbnwwfHx8fDE3NDgwMjA0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Futurama Fry Not Sure If Meme Template", hint: "futurama fry" },
  { id: "this-is-fine", src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHx0aGlzJTIwaXMlMjBmaW5lJTIwZG9nfGVufDB8fHx8MTc0ODAyMDQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080", alt: "This is Fine Dog Meme Template", hint: "this is fine dog" },
  { id: "roll-safe", src: "https://images.unsplash.com/photo-1695654396488-612369cef115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxyb2xsJTIwc2FmZXxlbnwwfHx8fDE3NDgwMjA0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Roll Safe Think About It Meme Template", hint: "roll safe" },
];

interface MemeLibraryProps {
  onSelectImage: (imageDataUrl: string) => void;
  disabled?: boolean;
}

export function MemeLibrary({ onSelectImage, disabled }: MemeLibraryProps) {
  const { toast } = useToast();

  const handleImageClick = async (templateSrc: string, altText: string) => {
    if (disabled) return;
    try {
      // For Unsplash URLs, we can pass them directly if they are CORS enabled,
      // or fetch and convert to Data URI if needed.
      // For simplicity and to ensure it works across environments (like local dev without CORS issues for canvas),
      // we'll fetch and convert.
      const response = await fetch(templateSrc);
      if (!response.ok) {
        // Attempt to use a proxy if direct fetch fails due to CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(templateSrc)}`;
        const proxyResponse = await fetch(proxyUrl);
        if (!proxyResponse.ok) {
          throw new Error(`Failed to fetch image via proxy: ${proxyResponse.statusText}`);
        }
        const blob = await proxyResponse.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          onSelectImage(reader.result as string);
          toast({ title: "Template Loaded!", description: `"${altText.replace(" Meme Template","")}" selected.` });
        };
        reader.onerror = () => {
          throw new Error("Failed to read image data via proxy.");
        };
        reader.readAsDataURL(blob);
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelectImage(reader.result as string);
        toast({ title: "Template Loaded!", description: `"${altText.replace(" Meme Template","")}" selected.` });
      };
      reader.onerror = () => {
        throw new Error("Failed to read image data.");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error loading image from library:", error);
      toast({
        title: "Error Loading Template",
        description: (error instanceof Error ? error.message : "Could not load the selected meme template. Check console for details."),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meme Template Library</CardTitle>
        <CardDescription className="mt-1">Choose a popular meme template to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {memeTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => handleImageClick(template.src, template.alt)}
                disabled={disabled}
                className="relative aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group bg-muted"
                aria-label={`Use ${template.alt}`}
              >
                <NextImage
                  src={template.src}
                  alt={template.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                  className="object-contain p-1 group-hover:opacity-80 transition-opacity"
                  data-ai-hint={template.hint}
                  priority={index < 6} 
                />
              </button>
            ))}
          </div>
        </ScrollArea>
        {memeTemplates.length === 0 && !disabled && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No meme templates available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
