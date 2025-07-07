'use client';

import { useState } from 'react';

export default function ToggleIcon() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <button onClick={handleToggle}>
      <img
        src={isOn ? '/icons/toggle-on.svg' : '/icons/toggle-off.svg'}
        alt="토글 아이콘"
        className="w-[48px] h-[24px] ml-[8px]"
      />
    </button>
  );
}
