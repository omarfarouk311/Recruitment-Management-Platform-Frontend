interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

const TextInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  className = "",
}: TextInputProps) => {
  return (
    <div
      className={
        "flex items-center bg-gray-100 rounded-full px-4 py-2 border-2 border-black w-full" +
        className
      }
    >
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

export default TextInput;
