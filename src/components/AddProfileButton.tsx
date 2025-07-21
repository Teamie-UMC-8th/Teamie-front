'use client';

import { useState } from 'react';

const sampleProfiles = [
  { id: 1, name: '김수빈', image: '/icons/profile-image.svg' },
  { id: 2, name: '김태화', image: '/icons/profile-image.svg' },
  { id: 3, name: '두현우', image: '/icons/profile-image.svg' },
  { id: 4, name: '유호인', image: '/icons/profile-image.svg' },
  { id: 5, name: '이예린', image: '/icons/profile-image.svg' },
];

export default function AddProfileButton() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<typeof sampleProfiles>([]);
  const [profiles, setProfiles] = useState<typeof sampleProfiles>(sampleProfiles);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  {
    /* 프로필 선택 */
  }
  const handleSelect = (profile: (typeof sampleProfiles)[number]) => {
    const updated = [...selectedProfiles, profile].sort(
      (a, b) =>
        sampleProfiles.findIndex((p) => p.id === a.id) -
        sampleProfiles.findIndex((p) => p.id === b.id)
    );
    setSelectedProfiles(updated);
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  {
    /* 프로필 제거 */
  }
  const handleRemove = (profile: (typeof sampleProfiles)[number]) => {
    setSelectedProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    setProfiles((prev) =>
      [...prev, profile].sort(
        (a, b) =>
          sampleProfiles.findIndex((p) => p.id === a.id) -
          sampleProfiles.findIndex((p) => p.id === b.id)
      )
    );
  };

  return (
    <div className="flex items-center relative">
      {/* 프로필 선택 */}
      {selectedProfiles.map((profile, index) => (
        <div
          key={profile.id}
          className={`flex items-center w-[95px] h-[36px] bg-white rounded-[30px] shadow-[1px_1px_4px_rgba(0,0,0,0.25)] cursor-pointer ${
            index === selectedProfiles.length - 1 ? 'mr-[23px]' : 'mr-[11px]'
          }`}
          onClick={() => handleRemove(profile)}
        >
          <img
            src={profile.image}
            alt={profile.name}
            className="w-[28px] h-[28px] rounded-full ml-[5px] my-[4px]"
          />
          <span className="ml-[8px] text-[16px]">{profile.name}</span>
        </div>
      ))}

      {/* 프로필 추가 버튼 + 드롭다운 */}
      <div className="relative">
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
        {dropdownOpen && (
          <div
            className="absolute top-[44px] left-0 w-[111px] h-[252px] overflow-y-auto bg-white rounded-[6px] grid place-content-center z-20"
            style={{ boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)' }}
          >
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelect(profile)}
                className="flex items-center w-[95px] h-[36px] bg-white rounded-[30px] shadow-[1px_1px_4px_rgba(0,0,0,0.25)] my-[6px] mx-[8px]"
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-[28px] h-[28px] rounded-full ml-[5px] my-[4px]"
                />
                <span className="ml-[8px] text-[16px]">{profile.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
