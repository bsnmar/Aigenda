import { Check } from "lucide-react";
import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`w-5 h-5 border-2 rounded-sm flex justify-center items-center 
        ${checked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"}
        transition-colors duration-200 ease-in-out`}
    >
      {checked && <Check className="w-4 h-4 text-white" />}
    </button>
  );
};

export default Checkbox;
