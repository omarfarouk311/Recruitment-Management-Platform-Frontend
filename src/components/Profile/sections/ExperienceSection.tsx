import { useState } from 'react';
import { Plus, Trash2, Edit, X } from 'lucide-react'; // Import X icon
import  useStore from '../../../stores/globalStore';
import Button from '../ui/Button';
import ExperienceForm from '../forms/ExperienceForm';
import { Experience } from '../../../types/profile';

export default function ExperienceSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>(undefined);

  const experiences = useStore.useSeekerProfileExperience();
  const removeExperience = useStore.useSeekerProfileRemoveExperience();

  const handleAddExperience = () => {
    setEditingExperience(undefined); // Reset editing experience
    setIsFormOpen(true); // Open the form
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience); // Set the experience to edit
    setIsFormOpen(true); // Open the form
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false); // Close the form after submission
  };

  // Add this helper function at the bottom of the file
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Experiences</h2>
          <Button variant="outline" size="sm" className="flex items-center" onClick={handleAddExperience}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="relative bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    {experience.logo ? (
                      <img
                        src={experience.logo}
                        alt={experience.company}
                        className="h-8 w-8"
                      />
                    ) : (
                      <span className="text-xl text-gray-400">
                        {experience.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{experience.position}</h3>
                    <p className="text-gray-600">{experience.company} - {experience.location}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </p>

                    
                    <p className="mt-2 text-gray-700">{experience.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600" onClick={() => handleEditExperience(experience)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeExperience(experience.id)}
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
          Show All Experiences
        </button>
      </div>

      {/* Modal for Experience Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            {/* Close Button (X) */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" /> {/* X icon from Lucide React */}
            </button>

            {/* Experience Form */}
            <ExperienceForm
              experience={editingExperience}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );

  
}