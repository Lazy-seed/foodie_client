import { Info, X } from "lucide-react";
import { useState } from "react";

export function DemoBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-blue-900 dark:text-blue-100">
                        <strong>Demo Notice:</strong> Backend hosted on free tier - first load may take 30-60s as server wakes up.
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
                    aria-label="Close banner"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
