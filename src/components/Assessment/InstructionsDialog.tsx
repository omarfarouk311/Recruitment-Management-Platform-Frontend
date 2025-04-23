import Button from "../common/Button";
import Input from "../common/Input";
import useStore from "../../stores/globalStore";
import { UserRole } from "../../stores/User Slices/userSlice";
import { useNavigate } from "react-router-dom";

type InstructionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole | null;
};

export const InstructionsDialog = ({
  isOpen,
  onClose,
  userRole,
}: InstructionsModalProps) => {
  if (!isOpen) return null;
  const assessmentData = useStore.useSelectedAssessment();
  const saveAssessment = useStore.useAssessmentSaveData();
  const updateAssessmentData = useStore.useAssessmentUpdateData();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-2xl w-[600px]">
        <h2 className="text-3xl font-bold mb-4">
          {userRole === UserRole.SEEKER
            ? "Test Instructions"
            : "Assessment Details"}
        </h2>
        {userRole === UserRole.SEEKER ? (
          <ul className="list-disc pl-6 space-y-2">
            <li>{`You have ${assessmentData?.time || 0} ${
              assessmentData?.time || 0 > 1 ? "minutes" : "minute"
            } to complete the assessment`}</li>
            <li>No external resources allowed</li>
            <li>Answer all questions before submitting</li>
          </ul>
        ) : (
          <div className="space-y-4">
            <div>
              <Input
                label="Assessment Name:"
                className="border rounded p-2 w-full"
                value={assessmentData?.name}
                onChange={(e) => updateAssessmentData("name", e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Job Title:"
                className="border rounded p-2 w-full"
                value={assessmentData?.jobTitle}
                onChange={(e) =>
                  updateAssessmentData("jobTitle", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                label="Duration (in minutes):"
                type="number"
                placeholder="Enter duration"
                value={assessmentData?.time}
                onChange={(e) => updateAssessmentData("time", e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="max-w-[60%] mt-6 flex justify-end space-x-4 ml-auto">
          <Button variant="report" onClick={onClose}>
            Close
          </Button>
          {UserRole.COMPANY === userRole && <Button onClick={() => {
            try {
              saveAssessment();
              onClose();
              navigate("/company/dashboard");
            } catch (err) {
              console.error("An error occurred:", err);
            }
          }}>Submit</Button>}
        </div>
      </div>
    </div>
  );
};
