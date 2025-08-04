'use client';

import { useState } from 'react';

interface TeamMemberCardProps {
  name: string;
  university?: string;
  email: string;
  role: string;
  isLeader?: boolean;
  onJoinClick?: () => void;
  onClick?: () => void;
  onUpdate?: (field: 'role', value: string) => void;
}

export default function TeamMemberCard({
  name,
  university,
  email,
  role,
  isLeader = false,
  onJoinClick,
  onClick,
  onUpdate,
}: TeamMemberCardProps) {
  const [editingField, setEditingField] = useState<'role' | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleFieldClick = (field: 'role', currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = () => {
    if (editingField && onUpdate) {
      onUpdate(editingField, editValue);
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className="w-[316px] h-[368px] rounded-[12px] bg-white mt-[24px] flex-col py-[36px] px-[40px] cursor-pointer
      max-lg:ml-[142px] max-lg:w-[580px] max-lg:h-[241px]"
      style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
      onClick={onClick}
    >
      <div className="max-lg:flex">
        <div className="flex flex-col items-center">
          <img
            src="/icons/myprofile.svg"
            alt="Profile"
            className="w-[125px] h-[125px]
      max-lg:ml-[20px]"
          />

          <div
            className="flex items-center mt-[8px]
      max-lg:ml-[38px]"
          >
            {isLeader && (
              <img src="/icons/Leader-Icon.svg" alt="리더 아이콘" className="mr-[8px]" />
            )}
            <div className="font-semibold text-[22px]">{name}</div>
          </div>
        </div>
        <div
          className="w-[235px] h-[248px] flex-col mt-[18px]
        max-lg:mt-0 max-lg:ml-[80px]"
        >
          <div className="flex items-center py-[6px]">
            <img src="/icons/UnivName.svg" alt="University" className="mr-[0.75rem]" />
            <div className="text-black text-[18px]">{university || '학교'}</div>
          </div>
          <div className="flex items-center py-[6px]">
            <img src="/icons/email.svg" alt="email" className="mr-[0.75rem]" />
            <div className="text-black text-[18px]">{email}</div>
          </div>
          <div className="flex items-center py-[6px]">
            <img src="/icons/PlanIcon.svg" alt="기획" className="mr-[0.75rem]" />
            {editingField === 'role' ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className="text-black text-[18px] rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                autoFocus
              />
            ) : (
              <div
                className="text-black text-[18px] cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFieldClick('role', role);
                }}
              >
                {role === '' ? <span className="text-gray-400">역할을 입력해주세요</span> : role}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
