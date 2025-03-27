import Button from "../common/Button";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

export const DeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-2xl w-[500px]">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p>{description}</p>
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="report" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};