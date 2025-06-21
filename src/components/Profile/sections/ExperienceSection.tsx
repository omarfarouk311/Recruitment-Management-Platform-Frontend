import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Info } from "lucide-react";
import useStore from "../../../stores/globalStore";
import ExperienceForm from "../forms/ExperienceForm";
import { Experience } from "../../../types/profile";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";
import { UserRole } from "../../../stores/User Slices/userSlice";
import { format } from "date-fns";

interface ExperienceSectionProps {
  fetchExperience?: () => Promise<void>;
  removeExperience: (experienceId: number) => Promise<void> | void;
  useExperiences: () => Experience[]; 
  updateExperience: (experience: Experience) => Promise<void> | void;
  addExperience: (experience: Experience) => Promise<void> | void;
}

export default function ExperienceSection({removeExperience, fetchExperience, useExperiences, updateExperience, addExperience}: ExperienceSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<
    Experience | undefined
  >(undefined);
  const experiences = useExperiences();
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);  
  const userRole = useStore.useUserRole();

  useEffect(() => {
    if(fetchExperience) {
      setIsLoading(true);
      fetchExperience().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString).toISOString(), "MMM yyyy");
    } catch {
      return dateString;
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(undefined);
    setIsFormOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
  };

  const checkMissingData = (experience: Experience) => {
    return !experience.companyName || !experience.position || !experience.startDate || !experience.endDate || !experience.country || !experience.city;
  }

  return (
    <div className="bg-white rounded-3xl shadow mb-6">
      <div className="p-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Experiences</h2>
          {userRole === UserRole.SEEKER && (
            <Button
              type="button"
              variant="outline"
              className="!w-auto !h-8 !p-3"
              onClick={handleAddExperience}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        <div
          className={`space-y-4 overflow-hidden `}
        >
          {isLoading ? (
            <SkeletonLoader />
          ) : experiences.length ? (
            experiences.map((experience: Experience, index) => (
              <div
                key={experience.id}
                className={`bg-gray-100 p-4 rounded-2xl ${
                  !showAll && index > 0 ? "hidden" : ""
                } ${checkMissingData(experience) ? "border border-red-400" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Company Avatar */}
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xl text-gray-400">
                      {experience.companyName.charAt(0)}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-medium">
                      {experience.position}
                    </h3>
                    <p className="text-gray-600 break-words">
                      {experience.companyName} - {experience.country},{" "}
                      {experience.city}
                    </p>
                    <p className="mt-2 text-gray-700 break-words whitespace-normal">
                      {experience.description}
                    </p>
                  </div>

                  {/* Dates and Buttons */}
                  <div className="flex items-center gap-4 ml-auto pl-4">
                    <p className="text-md text-gray-600 whitespace-nowrap mr-2">
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </p>

                    {userRole === UserRole.SEEKER && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            handleEditExperience({ ...experience })
                          }
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExperience(experience.id!)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        {(checkMissingData(experience)) && (
                            <span title="Some fields are missing" className="text-red-500 ">
                              <Info />
                            </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No experiences to show.</p>
          )}
        </div>

        {experiences.length > 1 && (
          <button
            className="mt-4 text-md font-semibold text-gray-500 hover:text-black"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        )}
      </div>

      {userRole === UserRole.SEEKER && (
        <ExperienceForm
          updateExperience={updateExperience}
          addExperience={addExperience}
          experience={editingExperience}
          onClose={() => {
            setIsFormOpen(false);
          }}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
}
