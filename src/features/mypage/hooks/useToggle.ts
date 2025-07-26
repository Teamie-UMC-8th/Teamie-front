import { useState } from 'react';

type ToggleOption = 'project' | 'ai';

export default function useToggle(initial: ToggleOption = 'project') {
  const [selected, setSelected] = useState<ToggleOption>(initial);

  return {
    selected,
    setSelected,
  };
}
