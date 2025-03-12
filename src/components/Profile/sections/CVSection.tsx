import { useEffect,useState } from 'react';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import  useStore from '../../../stores/globalStore';
import Button from '../ui/Button';
import CVForm from '../forms/CVForm';
import { CV } from '../../../types/profile';
import SkeletonLoader from '../../common/SkeletonLoader';

export default function CVSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCV, setEditingCV] = useState<CV | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const cvs = useStore.useSeekerProfileCvs();
  const removeCV = useStore.useSeekerProfileRemoveCV();
  const fetchCV = useStore.useSeekerProfileCvFetchData();


  const handleAddCV = () => {
    setEditingCV(undefined);
    setIsFormOpen(true);
  };

  const handleEditCV = (cv: CV) => {
    setEditingCV(cv);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCV().then(() => {
      setIsLoading(false);
    });
  }, []);
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">CVs</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={handleAddCV}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        {/* Scrollable Container (Shows 2 CVs by default) */}
        {isLoading ? (
            <div className="relative h-[105px] overflow-hidden"> {/* Set your desired max height */}
              <SkeletonLoader />
            </div>
          ) : (
        <div className="space-y-2 max-h-[105px] overflow-y-auto"> {/* Adjust height as needed */}
          
          {cvs.map((cv) => (
            <div
              key={cv.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center">
                <span className="text-gray-900">{cv.name}</span>
                <span className="ml-4 text-sm text-gray-500">{cv.date}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCV(cv)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeCV(cv.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      {/* Modal for CV Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <CVForm cv={editingCV} onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}