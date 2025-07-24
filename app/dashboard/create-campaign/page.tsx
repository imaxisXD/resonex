"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface GeneratedContent {
  subjectLines: {
    A: string;
    B: string;
  };
  body: string;
  recommendedTimes: Array<{
    dayOfWeek: string;
    hour: number;
    score: number;
  }>;
}

export default function CreateCampaign() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("Newsletter");
  const [recipients, setRecipients] = useState<string[]>([
    "sunny735084@gmail.com",
  ]);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [selectedDateA, setSelectedDateA] = useState<Date>(new Date());
  const [selectedTimeA, setSelectedTimeA] = useState("10:00");
  const [selectedDateB, setSelectedDateB] = useState<Date>(new Date());
  const [selectedTimeB, setSelectedTimeB] = useState("11:00");

  // Convex mutations and actions
  const generateContent = useAction(
    api.externalActions.generateNewsletterContent,
  );
  const createCampaign = useMutation(api.campaigns.createCampaign);
  const scheduleCampaign = useMutation(api.campaigns.scheduleCampaign);
  const importCsv = useAction(api.emails.importRecipients);

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const content = await generateContent({ prompt, category });
      setGeneratedContent(content);
      setStep(2);
    } catch (error) {
      console.error("Failed to generate content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportRecipients = async (csvData: string) => {
    try {
      const result = await importCsv({ csvData });
      if (result.success) {
        setRecipients(result.recipients);
        if (result.errors.length > 0) {
          alert(
            `Imported ${result.recipients.length} recipients with ${result.errors.length} errors.`,
          );
        }
      } else {
        alert("Failed to import recipients");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import recipients");
    }
  };

  const handleCreateCampaign = async () => {
    if (!generatedContent) return;

    setLoading(true);
    try {
      const campaignId = await createCampaign({
        prompt,
        category,
        subjectLines: generatedContent.subjectLines,
        body: generatedContent.body,
        recipients,
      });

      // Calculate send times
      const sendTimeA = new Date(selectedDateA);
      const [hoursA, minutesA] = selectedTimeA.split(":");
      sendTimeA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0);

      const sendTimeB = new Date(selectedDateB);
      const [hoursB, minutesB] = selectedTimeB.split(":");
      sendTimeB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0);

      await scheduleCampaign({
        campaignId,
        sendTimeA: sendTimeA.getTime(),
        sendTimeB: sendTimeB.getTime(),
      });

      alert("Campaign scheduled successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to create campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Campaign
          </h1>
          <p className="text-gray-600 mt-2">
            Generate AI-powered newsletter content with A/B testing
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-red-500 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                <div className="ml-3 text-sm font-medium text-gray-600">
                  {stepNumber === 1 && "Generate Content"}
                  {stepNumber === 2 && "Review & Edit"}
                  {stepNumber === 3 && "Schedule & Send"}
                </div>
                {stepNumber < 3 && (
                  <div className="w-16 h-0.5 bg-gray-200 ml-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Generate Content */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              Step 1: Generate Content
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Newsletter Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want your newsletter to be about (e.g., 'Weekly fintech digest covering latest trends and innovations')"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Newsletter">Newsletter</option>
                  <option value="Product Updates">Product Updates</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Educational">Educational</option>
                  <option value="Announcements">Announcements</option>
                </select>
              </div>

              <button
                onClick={handleGenerateContent}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {loading ? "Generating..." : "Generate Content with AI"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Edit */}
        {step === 2 && generatedContent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              Step 2: Review & Edit
            </h2>

            <div className="space-y-6">
              {/* Subject Lines */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Subject Lines (A/B Test)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line A
                    </label>
                    <input
                      type="text"
                      value={generatedContent.subjectLines.A}
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          subjectLines: {
                            ...generatedContent.subjectLines,
                            A: e.target.value,
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line B
                    </label>
                    <input
                      type="text"
                      value={generatedContent.subjectLines.B}
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          subjectLines: {
                            ...generatedContent.subjectLines,
                            B: e.target.value,
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                <textarea
                  value={generatedContent.body}
                  onChange={(e) =>
                    setGeneratedContent({
                      ...generatedContent,
                      body: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={12}
                />
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients ({recipients.length} total)
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Email will be sent to:
                  </div>
                  <div className="bg-gray-50 p-3 rounded border">
                    <span className="font-mono text-sm">{recipients[0]}</span>
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {recipients.length} recipient configured
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={recipients.length === 0}
                  className="flex-1 bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  Continue to Scheduling
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule & Send */}
        {step === 3 && generatedContent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              Step 3: Schedule & Send
            </h2>

            <div className="space-y-6">
              {/* Recommended Times */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Recommended Send Times
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedContent.recommendedTimes
                    .slice(0, 3)
                    .map((time, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg text-center"
                      >
                        <div className="font-semibold">{time.dayOfWeek}</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {time.hour}:00
                        </div>
                        <div className="text-sm text-gray-600">
                          Score: {(time.score * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* A/B Test Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variant A */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Variant A Schedule
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <Calendar
                        value={selectedDateA}
                        onChange={(date) => setSelectedDateA(date as Date)}
                        className="w-full"
                        minDate={new Date()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={selectedTimeA}
                        onChange={(e) => setSelectedTimeA(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Variant B Schedule
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <Calendar
                        value={selectedDateB}
                        onChange={(date) => setSelectedDateB(date as Date)}
                        className="w-full"
                        minDate={new Date()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={selectedTimeB}
                        onChange={(e) => setSelectedTimeB(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  {loading ? "Scheduling..." : "Schedule Campaign"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
