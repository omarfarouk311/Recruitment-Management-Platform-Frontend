interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export const TextInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: TextInputProps) => {
  return (
    <div className="flex items-center w-48 bg-gray-100 rounded-full px-4 py-2 border-2 border-gray-200">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};
