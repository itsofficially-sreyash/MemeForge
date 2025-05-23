"use client";

import type React from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageUpload, disabled }: ImageUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Image</CardTitle>
        <CardDescription>Choose an image to start creating your meme.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="meme-image-upload" className="sr-only">
            Upload Image
          </Label>
          <Input
            id="meme-image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="h-12 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            disabled={disabled}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Supported formats: JPG, PNG, GIF, WEBP.
        </p>
      </CardContent>
    </Card>
  );
}
