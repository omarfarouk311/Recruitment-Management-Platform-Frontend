import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, PlusCircle } from 'lucide-react';
import { Process, Phase } from "../../types/companyDashboard";

interface ProcessData {
  id?: number;
  name: string;
  phases: Phase[];
}

interface Assessment {
  id: number;
  name: string;
}

interface RecruitmentProcessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (processData: { name: string; phases: Phase[] }) => void;
  initialData?: ProcessData | null;
  isEditMode?: boolean;
  assessments: Assessment[];
  isFetchingAssessments: boolean;
}

const RecruitmentProcessDialog: React.FC<RecruitmentProcessDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditMode = false,
  assessments,
}) => {
  const [processName, setProcessName] = useState('');
  const [phases, setPhases] = useState<Phase[]>([]);
  const [errors, setErrors] = useState({
    processName: '',
    phases: [] as string[],
  });

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setErrors({ processName: '', phases: [] });
      if (isEditMode && initialData) {
        setProcessName(initialData.name);
        setPhases(initialData.phases || []);
      } else {
        setProcessName('');
        setPhases([]);
      }
    }
  }, [isOpen, isEditMode, initialData]);

  const validateProcessName = (name: string) => {
    if (!name.trim()) return 'Process name is required';
    if (name.trim().length < 4) return 'Process name must be at least 4 characters';
    return '';
  };

  const validatePhaseNames = (phases: Phase[]) => {
    return phases.map(phase => {
      if (!phase.phasename.trim()) return 'Phase name is required';
      if (phase.phasename.trim().length < 4) return 'Phase name must be at least 4 characters';
      return '';
    });
  };

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now(),
      phase_num: phases.length + 1,
      phasename: '',
      type: 3,
      deadline: '',
      assessmentname: '',
      assessment_time: '',
      assessmentId: null,
    };
    setPhases([...phases, newPhase]);
    setErrors(prev => ({
      ...prev,
      phases: [...prev.phases, '']
    }));
  };

  const removePhase = (id: number) => {
    const index = phases.findIndex(phase => phase.id === id);
    const updatedPhases = phases.filter(phase => phase.id !== id);
    const reorderedPhases = updatedPhases.map((phase, idx) => ({
      ...phase,
      phase_num: idx + 1
    }));
    
    setPhases(reorderedPhases);
    
    // Remove the corresponding error
    setErrors(prev => {
      const newPhaseErrors = [...prev.phases];
      newPhaseErrors.splice(index, 1);
      return {
        ...prev,
        phases: newPhaseErrors
      };
    });
  };

  const updatePhase = (id: number, field: keyof Phase, value: any) => {
    setPhases(prev => {
      const updatedPhases = prev.map(phase => 
        phase.id === id ? { ...phase, [field]: value } : phase
      );
      
      // Update phase name errors if needed
      if (field === 'phasename') {
        const phaseErrors = validatePhaseNames(updatedPhases);
        setErrors(prevErrors => ({
          ...prevErrors,
          phases: phaseErrors
        }));
      }
      
      return updatedPhases;
    });
  };

  const handleSave = () => {
    const processNameError = validateProcessName(processName);
    const phaseErrors = validatePhaseNames(phases);
    
    setErrors({
      processName: processNameError,
      phases: phaseErrors
    });

    const hasErrors = processNameError || phaseErrors.some(error => error !== '');
    if (hasErrors) return;

    const validPhases = phases.filter(phase => phase.phasename.trim() !== '');
    if (validPhases.length === 0) {
      alert('Please add at least one phase');
      return;
    }

    onSave({
      name: processName.trim(),
      phases: validPhases
    });
  };

  const handleClose = () => {
    setProcessName('');
    setPhases([]);
    setErrors({ processName: '', phases: [] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Process' : 'New Process'}
            </h2>
            <Edit3 className="h-5 w-5 text-gray-500" />
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Process Name Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Name *
            </label>
            <input
              type="text"
              value={processName}
              onChange={(e) => {
                setProcessName(e.target.value);
                setErrors(prev => ({
                  ...prev,
                  processName: validateProcessName(e.target.value)
                }));
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.processName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.processName && (
              <p className="mt-1 text-sm text-red-600">{errors.processName}</p>
            )}
          </div>

          {/* Phases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Phases *</h3>
              <button
                onClick={addPhase}
                className="flex items-center text-sm font-semibold text-gray-500 hover:text-black"
              >
                <PlusCircle size={30} />
              </button>
            </div>

            {/* Phase Headers */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-semibold text-gray-700 text-sm">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-4">Details</div>
              <div className="col-span-1">Actions</div>
            </div>

            {phases.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="mb-4">No phases added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="grid grid-cols-12 gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="col-span-1 flex items-center">
                      <span className="text-gray-600 font-medium">{index + 1}</span>
                    </div>
                    
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={phase.phasename || ''}
                        onChange={(e) => updatePhase(phase.id, 'phasename', e.target.value)}
                        placeholder="Phase name"
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors.phases[index] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phases[index] && (
                        <p className="mt-1 text-xs text-red-600">{errors.phases[index]}</p>
                      )}
                    </div>

                    <div className="col-span-3">
                      <select
                        value={phase.type}
                        onChange={(e) => updatePhase(phase.id, 'type', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value={1}>Assessment</option>
                        <option value={2}>Interview</option>
                        <option value={3}>CV Screening</option>
                      </select>
                    </div>

                    <div className="col-span-4">
                      {phase.type === 1 && (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <select
                              value={phase.assessmentname || ''}
                              onChange={(e) => {
                                const selectedName = e.target.value;
                                const selectedAssessment = assessments.find(a => a.name === selectedName);
                                updatePhase(phase.id, 'assessmentname', selectedName);
                                if (selectedAssessment) {
                                  updatePhase(phase.id, 'assessmentId', selectedAssessment.id);
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="" disabled>Select Assessment</option>
                              {assessments.map(assessment => (
                                <option key={assessment.id} value={assessment.name}>
                                  {assessment.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={phase.deadline || ''}
                              onChange={(e) => updatePhase(phase.id, 'deadline', e.target.value)}
                              placeholder="Deadline (days)"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              min="1"
                            />
                          </div>
                        </>
                      )}
                      {phase.type === 2 && (
                        <div className="text-gray-500 text-sm py-2">
                          No additional details needed
                        </div>
                      )}
                      {phase.type === 3 && (
                        <div className="text-gray-500 text-sm py-2">
                          No additional details needed
                        </div>
                      )}
                    </div>

                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => removePhase(phase.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {isEditMode ? 'Update Process' : 'Save Process'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentProcessDialog;