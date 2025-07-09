'use client';

import { useState } from 'react';

export default function useToggle(initialValue = false) {
  const [isOn, setIsOn] = useState(initialValue);
  const toggle = () => setIsOn((prev) => !prev);

  return { isOn, toggle };
}
