'use client';

import { useState, useEffect, useRef } from 'react';

interface Manager {
  userId: number;
  userName: string;
}

interface AddProfileButtonProps {
  profiles: Manager[];
  onChange?: (selectedUserIds: number[]) => void;
  onPermissionCheck?: () => boolean;
  initialSelectedIds?: number[];
}

export default function AddProfileButton({
  profiles,
  onChange,
  onPermissionCheck,
  initialSelectedIds = [],
}: AddProfileButtonProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<Manager[]>([]);

  // 초기 선택된 프로필 설정
  useEffect(() => {
    if (initialSelectedIds.length > 0 && profiles.length > 0) {
      const initialProfiles = profiles.filter((profile) =>
        initialSelectedIds.includes(profile.userId)
      );
      if (initialProfiles.length > 0 && selectedProfiles.length === 0) {
        setSelectedProfiles(initialProfiles);
      }
    }
  }, [initialSelectedIds, profiles, selectedProfiles.length]);

  const remainingProfiles = profiles
    .filter((p) => !selectedProfiles.find((s) => s.userId === p.userId))
    .sort((a, b) => a.userName.localeCompare(b.userName, 'ko'));

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* 프로필 선택 */
  const handleSelect = (profile: Manager) => {
    console.log('AddProfileButton - 프로필 선택 시도:', profile);

    // 권한 점검
    if (onPermissionCheck) {
      const hasPermission = onPermissionCheck();
      console.log('AddProfileButton - 권한 점검 결과:', hasPermission);

      if (!hasPermission) {
        alert('프로젝트 멤버만 참석자를 수정할 수 있습니다.');
        return;
      }
    }

    const updated = [...selectedProfiles, profile];
    setSelectedProfiles(updated);
    console.log(
      'AddProfileButton - onChange 호출:',
      updated.map((p) => p.userId)
    );
    onChange?.(updated.map((p) => p.userId));
    // 드롭다운을 닫지 않도록 setDropdownOpen(false) 제거
  };

  // 빈 곳 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  /* 프로필 제거 */
  const handleRemove = (profile: Manager) => {
    console.log('AddProfileButton - 프로필 제거 시도:', profile);

    // 권한 점검
    if (onPermissionCheck) {
      const hasPermission = onPermissionCheck();
      console.log('AddProfileButton - 권한 점검 결과:', hasPermission);

      if (!hasPermission) {
        alert('프로젝트 멤버만 참석자를 수정할 수 있습니다.');
        return;
      }
    }

    setSelectedProfiles((prev) => {
      const filtered = prev.filter((p) => p.userId !== profile.userId);
      console.log(
        'AddProfileButton - onChange 호출 (제거):',
        filtered.map((p) => p.userId)
      );
      onChange?.(filtered.map((p) => p.userId));
      return filtered;
    });
    setDropdownOpen(false); // 드롭다운을 닫음
  };

  return (
    <div className="flex items-center relative">
      {/* 프로필 선택 */}
      {selectedProfiles.map((profile, index) => (
        <div
          key={profile.userId}
          className={`flex items-center w-[95px] h-[36px] bg-white rounded-[30px] shadow-[1px_1px_4px_rgba(0,0,0,0.25)] cursor-pointer ${
            index === selectedProfiles.length - 1 ? 'mr-[23px]' : 'mr-[11px]'
          }`}
          onClick={() => handleRemove(profile)}
        >
          <img
            src="/icons/profile-image.svg"
            alt={profile.userName}
            className="w-[28px] h-[28px] rounded-full ml-[5px] my-[4px]"
          />
          <span className="ml-[8px] text-[16px]">{profile.userName}</span>
        </div>
      ))}

      {/* 프로필 추가 버튼 + 드롭다운 */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center w-[36px] h-[36px]"
        >
          <img
            src="/icons/plus-circle.svg"
            alt="사용자 추가"
            className="w-[32px] h-[32px] cursor-pointer"
          />
        </button>

        {/* 드롭다운 메뉴 */}
        {remainingProfiles.length > 0 && (
          <div
            className="absolute top-[44px] left-0 w-[111px] overflow-y-auto bg-white rounded-[6px] grid place-content-center z-20"
            style={{
              display: dropdownOpen ? 'grid' : 'none',
              height: `${Math.max(remainingProfiles.length * 50, 50)}px`,
              boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
            }}
          >
            {remainingProfiles.map((profile) => (
              <button
                key={profile.userId}
                onClick={() => handleSelect(profile)}
                className="flex items-center w-[95px] h-[36px] bg-white rounded-[30px] shadow-[1px_1px_4px_rgba(0,0,0,0.25)] my-[6px] mx-[8px] cursor-pointer"
              >
                <img
                  src="/icons/profile-image.svg"
                  alt={profile.userName}
                  className="w-[28px] h-[28px] rounded-full ml-[5px] my-[4px]"
                />
                <span className="ml-[8px] text-[16px]">{profile.userName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
