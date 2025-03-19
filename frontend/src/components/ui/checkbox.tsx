import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Checkbox({ checked = false, onCheckedChange }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <div
      className={cn(
        "w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer",
        isChecked ? "bg-red-500 border-red-500" : "border-gray-400"
      )}
      onClick={handleToggle}
    >
      {isChecked && <Check className="w-4 h-4 text-white" />}
    </div>
  );
}
