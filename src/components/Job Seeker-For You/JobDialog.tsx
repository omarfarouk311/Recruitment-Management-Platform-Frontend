import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import Button from "../common/Button";
import { CheckCircle, XCircle } from "lucide-react";
import { CV } from "../../types/CV";

type DialogType = "apply" | "report";

interface JobDialogProps {
  type: DialogType | null;
  cvs: CV[];
  onClose: () => void;
  onApplySubmit: (cvId: number) => Promise<void>;
  onReportSubmit: (title: string, message: string) => Promise<void>;
}

const JobDialog = ({ type, cvs, onClose, onApplySubmit, onReportSubmit }: JobDialogProps) => {
  const [selectedCVId, setSelectedCVId] = useState<number | null>(null);
  const [reportTitle, setReportTitle] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsValid(
      type === "apply"
        ? !!selectedCVId
        : reportTitle.trim().length >= 3 && reportMessage.trim().length >= 10
    );
  }, [selectedCVId, reportTitle, reportMessage, type]);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onClose]);

  useEffect(() => {
    setIsSubmitted(false);
    // Reset form fields when dialog type changes
    if (type === "report") {
      setReportTitle("");
      setReportMessage("");
    } else if (type === "apply") {
      setSelectedCVId(null);
    }
  }, [type]);

  const handleSubmit = async () => {
    if (!type || !isValid) return;
    setIsLoading(true);

    try {
      if (type === "apply") await onApplySubmit(selectedCVId!);
      else await onReportSubmit(reportTitle, reportMessage);

      setIsSubmitted(true);
      setReportTitle("");
      setReportMessage("");
      setSelectedCVId(null);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  if (!type) return null;

  return (
    <Dialog open={!!type} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl min-h-[300px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-heading"
        >
          <div className="p-8 max-h-[80vh]">
            {isSubmitted ? (
              <div className="text-center py-8 min-h-[200px] flex flex-col justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {type === "apply" ? "Application Submitted!" : "Report Submitted!"}
                </h3>
                <p className="text-gray-600">
                  {type === "apply"
                    ? "Your application has been successfully submitted."
                    : "Thank you for your report. We will review it shortly."}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold" id="dialog-heading">
                    {type === "apply" ? "Apply with CV" : "Report Job"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                    aria-label="Close dialog"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {type === "apply" ? (
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Select a CV to apply:</p>
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm">
                      ℹ️ CVs are ordered from most to least suitable for this position
                    </div>
                    <div className="grid gap-3">
                      {cvs.slice(0, 5).map((cv) => (
                        <label
                          key={cv.id}
                          className="flex items-center p-3 rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                        >
                          <input
                            type="radio"
                            name="cv"
                            value={cv.name}
                            checked={selectedCVId === cv.id}
                            onChange={() => setSelectedCVId(cv.id)}
                            className="mr-3 w-4 h-4 text-blue-600"
                          />
                          <span className="font-medium">{cv.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Please describe the issue:</p>
                    <div className="space-y-2">
                      <label>
                        <span className="block text-sm font-medium text-gray-700 mb-1">Title</span>
                        <input
                          type="text"
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Enter a title for your report"
                        />
                      </label>
                      <label>
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </span>
                        <textarea
                          value={reportMessage}
                          onChange={(e) => setReportMessage(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Please provide detailed information about the issue..."
                          rows={4}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Minimum 3 characters for title and 10 for description
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    variant={isValid ? (type === "apply" ? "primary" : "report") : "outline"}
                    className="!w-[30%]"
                    loading={isLoading}
                  >
                    {type === "apply" ? "Submit Application" : "Submit Report"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default JobDialog;
