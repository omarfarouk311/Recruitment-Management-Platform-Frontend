import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import useStore from "../../../stores/globalStore";
import EducationForm from "../forms/EducationForm";
import { Education } from "../../../types/profile";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";
import { UserRole } from "../../../stores/User Slices/userSlice";

export default function EducationSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<
    Education | undefined
  >(undefined);
  const education = useStore.useSeekerProfileEducation();
  const [isLoading, setIsLoading] = useState(true);
  const removeEducation = useStore.useSeekerProfileRemoveEducation();
  const fetchEducation = useStore.useSeekerProfileFetchEducation();
  const [showAll, setShowAll] = useState(false);
  const userRole = useStore.useUserRole();

  useEffect(() => {
    setIsLoading(true);
    fetchEducation().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleAddEducation = () => {
    setEditingEducation(undefined);
    setIsFormOpen(true);
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow mb-6">
      <div className="p-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          {userRole === UserRole.SEEKER && (
            <Button
              variant="outline"
              className="!w-auto !h-8 !p-3"
              onClick={handleAddEducation}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        <div
          className={`space-y-4 overflow-hidden ${
            showAll ? "max-h-none" : "max-h-[200px]"
          }`}
        >
          {isLoading ? (
            <SkeletonLoader />
          ) : education.length ? (
            education.map((edu: Education, index) => (
              <div
                key={edu.id}
                className={`bg-gray-100 p-4 rounded-2xl ${
                  !showAll && index > 0 ? "hidden" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xl text-gray-400">
                      {edu.institution.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-medium">{edu.institution}</h3>
                    <p className="text-gray-600 break-words">
                      {edu.degree}, {edu.fieldOfStudy}
                    </p>
                    <p className="mt-2 text-gray-700 break-words whitespace-normal">
                      Grade: {edu.grade}
                    </p>
                  </div>

                  {/* Dates and Buttons */}
                  <div className="flex items-center gap-4 ml-auto pl-4">
                    <p className="text-md text-gray-600 whitespace-nowrap mr-2">
                      {edu.startDate} - {edu.endDate}
                    </p>

                    {userRole === UserRole.SEEKER && (
                      <div className="flex gap-4">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditEducation({ ...edu })}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeEducation(edu.id!)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No education to show.</p>
          )}
        </div>

        {education.length > 1 && (
          <button
            className="mt-4 text-md font-semibold text-gray-500 hover:text-black"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        )}
      </div>

      {userRole === UserRole.SEEKER && (
        <EducationForm
          education={editingEducation}
          onClose={() => {
            setIsFormOpen(false);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
