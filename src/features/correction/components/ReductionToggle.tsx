import { useState } from 'react';

interface ReductionToggleProps {
  onRToggle: (value: boolean) => void;
}

const ReductionToggle = ({ onRToggle }: ReductionToggleProps) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    const next = !isOn;
    setIsOn(next);
    onRToggle(next);
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
