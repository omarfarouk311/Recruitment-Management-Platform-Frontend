import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import useStore from "../../../stores/globalStore";
import ExperienceForm from "../forms/ExperienceForm";
import { Experience } from "../../../types/profile";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";

export default function ExperienceSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<
    Experience | undefined
  >(undefined);
  const experiences = useStore.useSeekerProfileExperience();
  const [isLoading, setIsLoading] = useState(true);
  const removeExperience = useStore.useSeekerProfileRemoveExperience();
  const fetchExperience = useStore.useSeekerProfileFetchExperience();
  const [showAll, setShowAll] = useState(false);
  const userRole = useStore.useUserRole();

  useEffect(() => {
    setIsLoading(true);
    fetchExperience().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleAddExperience = () => {
    setEditingExperience(undefined);
    setIsFormOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow mb-6">
      <div className="p-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Experiences</h2>
          {userRole === "seeker" && (
            <Button
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
          className={`space-y-4 overflow-hidden ${
            showAll ? "max-h-none" : "max-h-[200px]"
          }`}
        >
          {isLoading ? (
            <SkeletonLoader />
          ) : experiences.length ? (
            experiences.map((experience: Experience, index) => (
              <div
                key={experience.id}
                className={`bg-gray-100 p-4 rounded-2xl ${
                  !showAll && index > 0 ? "hidden" : ""
                }`}
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
                      {experience.startDate} - {experience.endDate}
                    </p>

                    {userRole === "seeker" && (
                      <div className="flex gap-4">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            handleEditExperience({ ...experience })
                          }
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeExperience(experience.id!)}
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

      {userRole === "seeker" && (
        <ExperienceForm
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
