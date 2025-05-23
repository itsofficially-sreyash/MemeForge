"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Caption } from "@/lib/types";
import { AVAILABLE_FONTS, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_OUTLINE_COLOR, DEFAULT_OUTLINE_WIDTH_FACTOR, DEFAULT_TEXT_COLOR } from "@/lib/types";
import { PlusCircle, Trash2, RotateCcw, RotateCw, ArrowLeftRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface CaptionControlsProps {
  captions: Caption[];
  selectedCaptionId: string | null;
  onAddCaption: () => void;
  onCaptionChange: (id: string, updates: Partial<Caption>) => void;
  onSelectCaption: (id: string | null) => void;
  onDeleteCaption: (id: string) => void;
}

export function CaptionControls({
  captions,
  selectedCaptionId,
  onAddCaption,
  onCaptionChange,
  onSelectCaption,
  onDeleteCaption,
}: CaptionControlsProps) {
  const selectedCaption = captions.find(c => c.id === selectedCaptionId);

  const handleGenericChange = (field: keyof Caption, value: any) => {
    if (selectedCaption) {
      onCaptionChange(selectedCaption.id, { [field]: value });
    }
  };
  
  const handleSliderChange = (field: keyof Caption, value: number[]) => {
    if (selectedCaption) {
      onCaptionChange(selectedCaption.id, { [field]: value[0] });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Captions</CardTitle>
          <CardDescription>Add, select, and delete captions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onAddCaption} className="w-full" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Caption
          </Button>
          {captions.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {captions.map((caption) => (
                <div
                  key={caption.id}
                  className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors ${
                    selectedCaptionId === caption.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectCaption(caption.id)}
                >
                  <span className="truncate flex-1">{caption.text || "New Caption"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selection when deleting
                      onDeleteCaption(caption.id);
                    }}
                    aria-label="Delete caption"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCaption && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Caption</CardTitle>
            <CardDescription>Customize the selected caption's appearance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="caption-text">Text (use \n for new line)</Label>
              <Textarea
                id="caption-text"
                value={selectedCaption.text}
                onChange={(e) => handleGenericChange("text", e.target.value)}
                placeholder="Enter your caption"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={selectedCaption.fontFamily}
                  onValueChange={(value) => handleGenericChange("fontFamily", value)}
                >
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FONTS.map(font => (
                      <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="font-size">Font Size ({selectedCaption.fontSize}%)</Label>
                 <Slider
                  id="font-size"
                  min={1} max={20} step={0.5}
                  defaultValue={[selectedCaption.fontSize]}
                  onValueChange={(value) => handleSliderChange("fontSize", value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={selectedCaption.color}
                  onChange={(e) => handleGenericChange("color", e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="outline-color">Outline Color</Label>
                <Input
                  id="outline-color"
                  type="color"
                  value={selectedCaption.outlineColor}
                  onChange={(e) => handleGenericChange("outlineColor", e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="outline-width">Outline Width ({ (selectedCaption.outlineWidth * 100).toFixed(0) }%)</Label>
              <Slider
                id="outline-width"
                min={0} max={0.3} step={0.01} // Max 30% of font size
                defaultValue={[selectedCaption.outlineWidth]}
                onValueChange={(value) => handleSliderChange("outlineWidth", value)}
              />
            </div>
             <div>
                <Label htmlFor="rotation">Rotation ({selectedCaption.rotation}&deg;)</Label>
                 <Slider
                  id="rotation"
                  min={-180} max={180} step={1}
                  defaultValue={[selectedCaption.rotation]}
                  onValueChange={(value) => handleSliderChange("rotation", value)}
                />
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => handleGenericChange("isMirrored", !selectedCaption.isMirrored)}
                  className="w-full"
                  aria-pressed={selectedCaption.isMirrored}
                >
                  <ArrowLeftRight className="mr-2 h-4 w-4" /> Mirror Text {selectedCaption.isMirrored ? "(On)" : "(Off)"}
                </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
