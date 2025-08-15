import React from 'react';

interface ReductionToggleProps {
  isOn: boolean;
  onRToggle: (value: boolean) => void;
}

const ReductionToggle = ({ isOn, onRToggle }: ReductionToggleProps) => {
  const handleClick = () => {
    onRToggle(!isOn);
  };

  return (
    <div className="flex items-center">
      <button onClick={handleClick}>
        <img
          src={isOn ? '/icons/ReductionToggle.svg' : '/icons/UnEditedToggle.svg'}
          alt="축소 제거 토글"
          className="cursor-pointer"
        />
      </button>
    </div>
  );
};

export default ReductionToggle;
