import { Plus, X } from 'lucide-react';
import  useStore from '../../../stores/globalStore';
import Button from '../ui/Button';

export default function SkillsSection() {
  const skills = useStore.useSeekerProfileSkills();
  const removeSkill = useStore.useSeekerProfileRemoveSkill();

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <Button variant="outline" size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1"
            >
              <span className="text-sm text-gray-800">{skill.name}</span>
              <button
                onClick={() => removeSkill(skill.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900">
          Show All Skills
        </button>
      </div>
    </div>
  );
}