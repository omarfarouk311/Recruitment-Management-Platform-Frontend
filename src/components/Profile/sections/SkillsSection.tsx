import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import useStore from '../../../stores/globalStore';
import Button from '../ui/Button';

export default function SkillsSection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const skills = useStore.useSeekerProfileSkills();
  const addSkill = useStore.useSeekerProfileAddSkill();
  const removeSkill = useStore.useSeekerProfileRemoveSkill();

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({
        id: Date.now().toString(), // will be removed
        name: newSkill, 
      });
      setNewSkill('');
      setIsPopupOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setIsPopupOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1"
            >
              <span className="text-sm text-gray-800">{skill.name}</span>
              <button
                onClick={() => removeSkill(skill.id || '')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Show All Skills Button */}
        <button className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900">
          Show All Skills
        </button>

        {/* Add Skill Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add a Skill</h3>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSkill}>Add Skill</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}