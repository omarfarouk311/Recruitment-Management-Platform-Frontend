import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import useStore from "../../../stores/globalStore";
import Button from "../../common/Button";
import SkillForm from "../forms/SkillForm"; // Add this import
import SkeletonLoader from "../../common/SkeletonLoader";

export default function SkillsSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const skills = useStore.useSeekerProfileSkills();
  const removeSkill = useStore.useSeekerProfileRemoveSkill();
  const fetchSkills = useStore.useSeekerProfileFetchSkills();
  const userRole = useStore.useUserRole();

  useEffect(() => {
    setIsLoading(true);
    fetchSkills().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {userRole === "seeker" && (
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(true)}
              className="!w-auto !h-8 !p-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="h-[120px] overflow-hidden">
            <SkeletonLoader />
          </div>
        ) : skills.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="inline-flex items-center bg-gray-100 rounded-2xl px-4 py-1"
              >
                <span className="text-sm text-black">{skill.name}</span>
                {userRole === "seeker" && (
                  <button
                    onClick={() => removeSkill(skill.id!)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p> className="text-gray-600" No skills to show.</p>
        )}

        {userRole === "seeker" && (
          <SkillForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        )}
      </div>
    </div>
  );
}
