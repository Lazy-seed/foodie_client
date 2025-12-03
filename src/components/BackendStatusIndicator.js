import { useEffect, useState } from "react";
import { Loader2, Server } from "lucide-react";

export function BackendStatusIndicator({ isLoading }) {
    const [showSlowMessage, setShowSlowMessage] = useState(false);

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowSlowMessage(true);
            }, 3000); // Show message after 3 seconds

            return () => clearTimeout(timer);
        } else {
            setShowSlowMessage(false);
        }
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-600">
                        {showSlowMessage ? "Waking up the server..." : "Loading..."}
                    </h3>
                </div>

                {showSlowMessage && (
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-start gap-2">
                            <Server className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-600" />
                            <span>
                                The backend server is hosted on Render's free tier and goes to sleep after inactivity.
                                It's waking up now, which may take 30-60 seconds.
                            </span>
                        </p>
                        <p className="text-xs italic bg-gray-100 dark:bg-gray-800 p-2 rounded">
                            💡 This is a demo limitation - production apps would use always-on hosting.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
