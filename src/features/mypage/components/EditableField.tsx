'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  placeholder: string;
  onSave: (newValue: string) => void;
  icon: string;
  label: string;
  className?: string;
  disabled?: boolean;
}

export default function EditableField({
  value,
  placeholder,
  onSave,
  icon,
  label,
  className = '',
  disabled = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <div className={`flex items-center ${className}`}>
      <img src={icon} alt={label} className="mr-[0.75rem]" />
      <div className="text-[#505050] mr-[0.75rem]">{label}:</div>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="text-black bg-transparent  focus:outline-none flex-1 h-6"
          placeholder={placeholder}
        />
      ) : (
        <div
          className={`text-black px-1 py-1 rounded transition-colors h-6 flex items-center ${
            isPlaceholder ? 'text-gray-400 italic' : ''
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}`}
          onClick={handleClick}
        >
          {displayValue}
        </div>
      )}
    </div>
  );
}
