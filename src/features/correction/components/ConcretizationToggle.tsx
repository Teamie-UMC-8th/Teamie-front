import React from 'react';

interface ConcretizationToggleProps {
  isOn: boolean;
  onCToggle: (value: boolean) => void;
}

const ConcretizationToggle = ({ isOn, onCToggle }: ConcretizationToggleProps) => {
  const handleClick = () => {
    onCToggle(!isOn);
  };

  return (
    <div className="flex items-center">
      <button onClick={handleClick}>
        <img
          src={isOn ? '/icons/ConcretizationToggle.svg' : '/icons/UnEditedToggle.svg'}
          alt="구체화 토글"
          className="cursor-pointer"
        />
      </button>
    </div>
  );
};

export default ConcretizationToggle;
