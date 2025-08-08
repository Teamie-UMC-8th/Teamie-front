'use client';

import { useState, useRef } from 'react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageChange?: (file: File) => void;
  className?: string;
}

export default function ProfileImageUpload({
  currentImageUrl,
  onImageChange,
  className = 'w-[125px] h-[125px] rounded-full object-cover',
}: ProfileImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 타입 검증
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        alert('JPG 또는 PNG 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 이미지를 URL로 변환하여 미리보기
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // 부모 컴포넌트에 파일 전달
      onImageChange?.(file);
    }
  };

  const displayImage = selectedImage || currentImageUrl || '/icons/myprofile.svg';

  return (
    <div className="relative">
      <img src={displayImage} alt="Profile" className={className} />
      <button
        className="absolute bottom-[0.75rem] right-[0.625rem] cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleImageClick}
        type="button"
      >
        <img src="/icons/camera-icon.svg" alt="카메라 아이콘" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
