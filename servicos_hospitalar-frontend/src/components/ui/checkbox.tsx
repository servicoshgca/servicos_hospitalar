import * as React from "react"

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, checked = false, onCheckedChange, className = "", disabled = false, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`
          h-4 w-4 shrink-0 rounded-sm border border-gray-300 
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 
          ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox }; 