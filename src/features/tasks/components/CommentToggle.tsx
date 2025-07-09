'use client';

import { useState } from 'react';

export default function useCommentToggle() {
  const [isOn, setIsOn] = useState(false);

  // 토글 버튼 클릭 시 상태 변경
  const handleToggle = () => setIsOn((prev) => !prev);
  return { isOn, handleToggle };
  /*
  {
     토글 버튼 
    <button onClick={handleToggle}>
      <img
        src={isOn ? '/icons/toggle-on.svg' : '/icons/toggle-off.svg'}
        alt="토글 아이콘"
        className="w-[48px] h-[24px] ml-[8px]"
      />
    </button>
    
  } */
}
