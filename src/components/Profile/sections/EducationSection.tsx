import { useState } from 'react';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import  useStore from '../../../stores/globalStore';
import Button from '../ui/Button';
import EducationForm from '../forms/EducationForm';
import { Education } from '../../../types/profile';

export default function EducationSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | undefined>(undefined);

  const education = useStore.useSeekerProfileEducation();
  const removeEducation = useStore.useSeekerProfileRemoveEducation();

  const handleAddEducation = () => {
    setEditingEducation(undefined);
    setIsFormOpen(true);
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
  };

  // Helper to format dates as "Aug 2020"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <Button variant="outline" size="sm" className="flex items-center" onClick={handleAddEducation}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="relative bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xl text-gray-400">
                      {edu.institution.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution} - {edu.location}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    <p className="mt-2 text-gray-700">GPA: {edu.gpa}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600" onClick={() => handleEditEducation(edu)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900">
          Show All Education
        </button>
      </div>

      {/* Modal for Education Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <EducationForm
              education={editingEducation}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}