
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

// Placeholder images for meme templates
const memeTemplates: MemeTemplate[] = [
  { id: "drake", src: "https://placehold.co/200x200.png", alt: "Drake Hotline Bling Meme Template", hint: "drake hotline" },
  { id: "distracted-bf", src: "https://placehold.co/200x133.png", alt: "Distracted Boyfriend Meme Template", hint: "distracted boyfriend" },
  { id: "one-does-not-simply", src: "https://placehold.co/200x142.png", alt: "One Does Not Simply Meme Template", hint: "boromir lord rings" },
  { id: "expanding-brain", src: "https://placehold.co/150x175.png", alt: "Expanding Brain Meme Template", hint: "expanding brain" },
  { id: "woman-yelling-cat", src: "https://placehold.co/200x112.png", alt: "Woman Yelling at Cat Meme Template", hint: "woman yelling cat" },
  { id: "change-my-mind", src: "https://placehold.co/200x132.png", alt: "Change My Mind Meme Template", hint: "change my mind" },
  { id: "success-kid", src: "https://placehold.co/150x150.png", alt: "Success Kid Meme Template", hint: "success kid" },
  { id: "futurama-fry", src: "https://placehold.co/150x150.png", alt: "Futurama Fry Not Sure If Meme Template", hint: "futurama fry" },
  { id: "this-is-fine", src: "https://placehold.co/200x150.png", alt: "This is Fine Dog Meme Template", hint: "this is fine dog" },
  { id: "roll-safe", src: "https://placehold.co/180x180.png", alt: "Roll Safe Think About It Meme Template", hint: "roll safe" },
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
      const response = await fetch(templateSrc);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
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
        description: (error instanceof Error ? error.message : "Could not load the selected meme template."),
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
