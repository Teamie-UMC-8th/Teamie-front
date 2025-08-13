'use client';

import { useState } from 'react';
import { TaskDetailResponse } from '@/types/api/taskDetail';

interface MemoFieldProps {
  taskId: number;
  taskData: TaskDetailResponse | undefined;
  initialMemo: string;
  onMemoBlur: (
    taskId: number,
    taskData: TaskDetailResponse | undefined,
    currentMemo: string
  ) => void;
}

export default function MemoField({ taskId, taskData, initialMemo, onMemoBlur }: MemoFieldProps) {
  const [localMemo, setLocalMemo] = useState<string | null>(null);

  return (
    <div
      className="flex flex-row mt-[40px] ml-[40px]
    max-lg:ml-[24px]"
    >
      <div className="min-w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
        비고
      </div>
      <textarea
        value={localMemo !== null ? localMemo : initialMemo || ''}
        onChange={(e) => setLocalMemo(e.target.value)}
        onBlur={(e) => {
          const currentMemo = e.target.value;
          if (currentMemo !== initialMemo) {
            onMemoBlur(taskId, taskData, currentMemo);
          }
        }}
        className="min-w-[1288px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
      max-lg:w-[735px] max-lg:min-w-[735px] resize-none"
      />
    </div>
  );
}
