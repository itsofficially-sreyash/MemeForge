"use client";

import type React from "react";
import { useEffect, useRef, useState, forwardRef } from "react";
import type { Caption } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface MemeCanvasProps {
  imageSrc: string | null;
  captions: Caption[];
  selectedCaptionId: string | null;
  onCaptionChange: (id: string, updates: Partial<Caption>) => void;
  onSelectCaption: (id: string | null) => void;
  baseCanvasWidth?: number;
}

const CANVAS_MAX_WIDTH = 800;
const CANVAS_MAX_HEIGHT = 600;

export const MemeCanvas = forwardRef<HTMLCanvasElement, MemeCanvasProps>(({
  imageSrc,
  captions,
  selectedCaptionId,
  onCaptionChange,
  onSelectCaption,
  baseCanvasWidth = 600,
}, ref) => {
  // If ref is passed, use it. Otherwise, use an internal ref.
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = ref || internalCanvasRef;

  const [canvasSize, setCanvasSize] = useState({ width: baseCanvasWidth, height: baseCanvasWidth * 0.75 });
  const [draggingCaption, setDraggingCaption] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
        let newWidth = img.width;
        let newHeight = img.height;

        if (newWidth > CANVAS_MAX_WIDTH) {
          newHeight = (newHeight * CANVAS_MAX_WIDTH) / newWidth;
          newWidth = CANVAS_MAX_WIDTH;
        }
        if (newHeight > CANVAS_MAX_HEIGHT) {
          newWidth = (newWidth * CANVAS_MAX_HEIGHT) / newHeight;
          newHeight = CANVAS_MAX_HEIGHT;
        }
        setCanvasSize({ width: newWidth, height: newHeight });
      };
      img.src = imageSrc;
    } else {
      setImageElement(null);
      setCanvasSize({ width: baseCanvasWidth, height: baseCanvasWidth * 0.75 });
    }
  }, [imageSrc, baseCanvasWidth]);

  useEffect(() => {
    const canvas = canvasRef && typeof canvasRef === 'object' && canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const currentBgColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    const currentMutedFgColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();
    const currentFont = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-sans') || 'sans-serif';


    ctx.fillStyle = currentBgColor || "#F2F0F7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (imageElement) {
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = currentMutedFgColor || "#64748b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `20px ${currentFont}`;
      ctx.fillText("Upload an image to start", canvas.width / 2, canvas.height / 2);
    }

    captions.forEach((caption) => {
      const actualFontSize = (caption.fontSize / 100) * canvas.height;
      ctx.font = `${actualFontSize}px ${caption.fontFamily}`;
      ctx.fillStyle = caption.color;
      ctx.strokeStyle = caption.outlineColor;
      ctx.lineWidth = actualFontSize * caption.outlineWidth; // outlineWidth is a factor
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = caption.x * canvas.width;
      const y = caption.y * canvas.height;
      
      ctx.save();
      ctx.translate(x, y);
      if (caption.rotation) {
        ctx.rotate(caption.rotation * Math.PI / 180);
      }
      if (caption.isMirrored) {
        ctx.scale(-1, 1);
      }

      const lines = caption.text.split('\\n');
      lines.forEach((line, index) => {
        const lineYOffset = (index - (lines.length -1) / 2) * actualFontSize * 1.2;
        if (ctx.lineWidth > 0 && caption.outlineWidth > 0) { // Only stroke if outlineWidth > 0
          ctx.strokeText(line, 0, lineYOffset);
        }
        ctx.fillText(line, 0, lineYOffset);
      });
      
      ctx.restore();

      const metrics = ctx.measureText(lines[0] || " "); // Use first line or space for approx width
      const textWidth = metrics.width;
      const textHeight = actualFontSize * lines.length * 1.2; 

      caption.width = textWidth;
      caption.height = textHeight;

      if (caption.id === selectedCaptionId) {
        ctx.save();
        ctx.translate(x,y);
         if (caption.rotation) {
            ctx.rotate(caption.rotation * Math.PI / 180);
         }
         // Selection box should not be mirrored with text
         // if (caption.isMirrored) {
         //    ctx.scale(-1, 1); 
         // }

        ctx.strokeStyle = "rgba(0, 123, 255, 0.7)"; // Use a fixed color for selection box
        ctx.lineWidth = 2;
        ctx.strokeRect(
          -textWidth / 2 - 5,
          -textHeight / 2 - 5,
          textWidth + 10,
          textHeight + 10
        );
        ctx.restore();
      }
    });
  }, [imageElement, captions, selectedCaptionId, canvasSize, canvasRef]);

  const getMousePos = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef && typeof canvasRef === 'object' && canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: mouseX, y: mouseY } = getMousePos(event);
    let clickedOnCaption: Caption | null = null;

    for (let i = captions.length - 1; i >= 0; i--) {
      const caption = captions[i];
      const capX = caption.x * canvasSize.width;
      const capY = caption.y * canvasSize.height;
      
      // More accurate hit detection considering rotation
      const dx = mouseX - capX;
      const dy = mouseY - capY;
      const angleRad = -(caption.rotation || 0) * Math.PI / 180; // Counter-rotate click point
      const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
      const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

      const capWidth = caption.width || ((caption.fontSize / 100) * canvasSize.height * caption.text.length * 0.5);
      const capHeight = caption.height || ((caption.fontSize / 100) * canvasSize.height);
      
      let finalRotatedX = rotatedX;
      if (caption.isMirrored) {
        finalRotatedX = -rotatedX; // Mirror the click point for hit detection
      }

      if (
        Math.abs(finalRotatedX) <= capWidth / 2 &&
        Math.abs(rotatedY) <= capHeight / 2
      ) {
        clickedOnCaption = caption;
        break;
      }
    }
    
    if (clickedOnCaption) {
      onSelectCaption(clickedOnCaption.id);
      // Calculate offset relative to caption's unrotated, unmirrored center
      const capX = clickedOnCaption.x * canvasSize.width;
      const capY = clickedOnCaption.y * canvasSize.height;
      setDraggingCaption({
        id: clickedOnCaption.id,
        offsetX: mouseX - capX, // Offset from caption center
        offsetY: mouseY - capY, // Offset from caption center
      });
    } else {
      onSelectCaption(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingCaption) {
      const { x: mouseX, y: mouseY } = getMousePos(event);
      onCaptionChange(draggingCaption.id, {
        x: (mouseX - draggingCaption.offsetX) / canvasSize.width,
        y: (mouseY - draggingCaption.offsetY) / canvasSize.height,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingCaption(null);
  };
  
  const handleMouseLeave = () => {
    setDraggingCaption(null);
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <CardContent className="p-0 flex justify-center items-center bg-muted aspect-[4/3] md:aspect-auto">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="max-w-full max-h-[calc(100vh-200px)] object-contain cursor-grab active:cursor-grabbing"
          data-ai-hint="meme canvas drawing"
        />
      </CardContent>
    </Card>
  );
});

MemeCanvas.displayName = "MemeCanvas";
