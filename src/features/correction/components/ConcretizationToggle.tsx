import { useState } from 'react';

interface ConcretizationToggleProps {
  onCToggle: (value: boolean) => void;
}

const ConcretizationToggle = ({ onCToggle }: ConcretizationToggleProps) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    const next = !isOn;
    setIsOn(next);
    onCToggle(next);
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
