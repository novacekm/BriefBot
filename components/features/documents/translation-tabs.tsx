"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClipboard } from "@/lib/hooks/use-clipboard";
import { cn } from "@/lib/utils";

interface Translation {
  id: string;
  targetLanguage: string;
  translatedText: string;
}

const languageLabels: Record<string, string> = {
  de: "German",
  fr: "French",
  it: "Italian",
  en: "English",
};

export interface TranslationTabsProps {
  /** Available translations */
  translations: Translation[];
  /** Callback for adding a new translation */
  onAddTranslation?: () => void;
  className?: string;
}

export function TranslationTabs({
  translations,
  onAddTranslation,
  className,
}: TranslationTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    translations[0]?.targetLanguage || ""
  );
  const { copied, copyToClipboard } = useClipboard();

  const activeTranslation = translations.find(
    (t) => t.targetLanguage === activeTab
  );

  const handleCopy = async () => {
    if (activeTranslation) {
      await copyToClipboard(activeTranslation.translatedText);
    }
  };

  if (translations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
                clipRule="evenodd"
              />
            </svg>
            Translations
          </CardTitle>
          <CardDescription>
            Translations of the document text into other languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            No translations available yet.
          </p>
          <Button
            variant="outline"
            onClick={onAddTranslation}
            disabled={!onAddTranslation}
            className="min-h-[44px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Translation
          </Button>
          {!onAddTranslation && (
            <p className="mt-3 text-sm text-muted-foreground">
              Translation feature will be available in a future update.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle as="h2" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
                  clipRule="evenodd"
                />
              </svg>
              Translations
            </CardTitle>
            <CardDescription>
              {translations.length} translation{translations.length !== 1 ? "s" : ""} available
            </CardDescription>
          </div>
          {activeTranslation && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="min-h-[36px] min-w-[90px]"
              aria-label={copied ? "Copied to clipboard" : "Copy translation to clipboard"}
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mr-1.5 h-4 w-4 text-green-600"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Language Tabs */}
        <div
          className="mb-4 flex flex-wrap gap-2 border-b pb-2"
          role="tablist"
          aria-label="Translation languages"
        >
          {translations.map((translation) => (
            <button
              key={translation.id}
              onClick={() => setActiveTab(translation.targetLanguage)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "min-h-[36px] min-w-[60px]",
                activeTab === translation.targetLanguage
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
              role="tab"
              aria-selected={activeTab === translation.targetLanguage}
              aria-controls={`translation-panel-${translation.targetLanguage}`}
            >
              {languageLabels[translation.targetLanguage] || translation.targetLanguage}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTranslation}
            disabled={!onAddTranslation}
            className="min-h-[36px]"
            aria-label="Add another translation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </Button>
        </div>

        {/* Translation Content */}
        {activeTranslation && (
          <div
            id={`translation-panel-${activeTranslation.targetLanguage}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTranslation.targetLanguage}`}
            className={cn(
              "max-h-80 overflow-auto rounded-lg bg-muted/50 p-4",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20"
            )}
          >
            <pre className="whitespace-pre-wrap break-words font-mono text-sm">
              {activeTranslation.translatedText}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
