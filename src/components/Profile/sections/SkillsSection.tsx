import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import useStore from "../../../stores/globalStore";
import Button from "../../common/Button";
import SkillForm from "../forms/SkillForm"; // Add this import
import SkeletonLoader from "../../common/SkeletonLoader";
import { UserRole } from "../../../stores/User Slices/userSlice";
import { Skill } from "../../../types/profile";

interface SkillSectionProps {
  fetchSkills?: () => Promise<void>;
  removeSkill: (skillId: number) => Promise<void> | void;
  useSkills: () => Skill[];
  addSkill: (skillId: number) => Promise<void> | void;
}

export default function SkillsSection({fetchSkills, removeSkill, useSkills, addSkill}: SkillSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const skills = useSkills();
  const userRole = useStore.useUserRole();

  useEffect(() => {
    if(fetchSkills) {
      setIsLoading(true);
      fetchSkills().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {userRole === UserRole.SEEKER && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(true)}
              className="!w-auto !h-8 !p-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
        <div 
          className={`space-y-4`}
        >
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
                  {userRole === UserRole.SEEKER && (
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
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-600">No skills to show.</p>
            </div>
          )}
        </div>

        {userRole === UserRole.SEEKER && (
          <SkillForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} addSkill={addSkill} />
        )}
      </div>
    </div>
  );
}
