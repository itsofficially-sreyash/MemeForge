
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Wand2 } from "lucide-react";

interface AiSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  onApplySuggestion: (suggestion: string) => void;
  onGenerateSuggestions?: () => void; // Optional: if we want a manual trigger
  disabled?: boolean;
}

export function AiSuggestions({
  suggestions,
  isLoading,
  onApplySuggestion,
  onGenerateSuggestions,
  disabled
}: AiSuggestionsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI Caption Suggestions</CardTitle>
            <CardDescription className="mt-1">Let AI help you find the perfect caption.</CardDescription>
          </div>
          {onGenerateSuggestions && (
             <Button onClick={onGenerateSuggestions} disabled={isLoading || disabled} variant="outline" size="sm">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && !suggestions.length ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Generating witty captions...</span>
          </div>
        ) : suggestions.length > 0 ? (
          <ScrollArea className="h-40 pr-3">
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => onApplySuggestion(suggestion)}
                    disabled={disabled}
                  >
                    {suggestion}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {disabled ? "Upload an image to get suggestions." : "No suggestions available. Try generating new ones!"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
