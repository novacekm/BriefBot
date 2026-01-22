import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActionItem } from "@/lib/ai/ocr/types";

export interface ActionsPanelProps {
  actions: ActionItem[];
  className?: string;
}

export function ActionsPanel({ actions, className }: ActionsPanelProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle as="h3" className="flex items-center gap-2 text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 15.25a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 10a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1V10z"
              clipRule="evenodd"
            />
          </svg>
          Required Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {actions.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="font-medium">{item.action}</p>
                {item.deadline && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Deadline: {item.deadline}
                  </p>
                )}
                {item.documents && item.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Required documents:
                    </p>
                    <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                      {item.documents.map((doc, docIndex) => (
                        <li key={docIndex}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
