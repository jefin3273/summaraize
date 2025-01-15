"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Youtube } from "lucide-react";
import { ShareButton } from "./share-button";
import { useNhostClient, useAuthenticationStatus } from "@nhost/nextjs";
import { Summary } from "@/types/summary";
import { motion, AnimatePresence } from "framer-motion";

const getSummaries = `
  query GetSummaries {
    video_summaries(order_by: {created_at: desc}) {
      id
      video_url
      summary
      created_at
    }
  }
`;

export default function VideoSummarizer() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const nhost = useNhostClient();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSummaries();
    }
  }, [isAuthenticated]);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const { data, error } = await nhost.graphql.request(getSummaries);

      if (error) throw error;
      setSummaries(data.video_summaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      toast({
        title: "Error",
        description: "Failed to load summaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUrlInputClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      await fetchSummaries(); // Refresh the list after new summary
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3 text-purple-700 dark:text-purple-300">
              <Youtube className="w-8 h-8" />
              Video Summarizer
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Enter a YouTube URL to get an AI-powered summary of the video
              content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onClick={handleUrlInputClick}
                  className="flex-1 text-lg py-6 px-4 rounded-lg border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 ease-in-out"
                />
                <Button
                  type="submit"
                  disabled={loading || !isAuthenticated}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Summarize"
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 shadow-md">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-2xl font-semibold text-purple-600 dark:text-purple-300">
                            Summary
                          </CardTitle>
                          <ShareButton
                            data={{
                              title: "Video Summary",
                              text: summary,
                              url: url,
                            }}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed">
                          {summary}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-purple-600 dark:text-purple-300">
              Past Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {summaries.map((summary) => (
                  <Card
                    key={summary.id}
                    className="bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium text-purple-600 dark:text-purple-300">
                          {new URL(summary.video_url).hostname}
                        </CardTitle>
                        <ShareButton
                          data={{
                            title: "Video Summary",
                            text: summary.summary,
                            url: summary.video_url,
                          }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {summary.summary}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-purple-600 dark:text-purple-300">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Please sign in or create an account to use the Video Summarizer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => router.push("/auth")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
            >
              Sign In / Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
