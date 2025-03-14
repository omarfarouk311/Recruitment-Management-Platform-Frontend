import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface InfoDialogProps {
  header: string;
  isOpen: boolean;
  data: string[];
  onClose: () => void;
}

const InfoDialog = ({ header, data, onClose, isOpen }: InfoDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data.length) setIsLoading(false);
  }, [data]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl min-h-[300px]"
          role="dialog"
        >
          <div className="p-8 max-h-[80vh]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold" id="dialog-heading">
                {header}
              </h2>
              <button
                onClick={onClose}
                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto hide-scrollbar max-h-[60vh]">
              {isLoading ? (
                <div className="bg-white p-6 rounded-3xl animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                  <div className="h-32 bg-gray-200 rounded mt-4"></div>
                </div>
              ) : (
                data.map((item) => (
                  <div
                    key={item}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InfoDialog;
