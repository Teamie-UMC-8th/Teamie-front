'use client';

import React, { useRef, useState } from 'react';

export default function FileUploader() {
  // 업로드된 파일 목록을 상태로 관리
  const [files, setFiles] = useState<File[]>([]);
  // 드래그 상태를 나타내는 플래그
  const [isDragging, setIsDragging] = useState(false);
  // 파일 입력 요소에 대한 참조
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 파일 입력 변경 시 업로드된 파일을 상태에 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...uploadedFiles]);
    }
  };

  // 드래그 앤 드롭으로 파일을 놓았을 때 파일을 상태에 추가
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  // 드래그 중일 때 드래그 상태를 true로 설정
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // 드래그가 영역을 벗어났을 때 드래그 상태를 false로 설정
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex ml-[28px] gap-[20px]">
      {/* 파일 목록 렌더링 */}
      {files.map((file, index) => {
        const ext = file.name.split('.').pop()?.toLowerCase();

        // 파일 종류 / 파일 아이콘 구분
        let filePreview = '/icons/file-preview.svg';
        let fileIcon = '/icons/file-icon.svg';

        if (ext === 'pdf') {
          filePreview = '/icons/pdf-file.svg';
          fileIcon = '/icons/pdf-icon.svg';
        } else if (ext === 'txt') {
          filePreview = '/icons/txt-file.svg';
          fileIcon = '/icons/txt-icon.svg';
        } else if (ext === 'jpg') {
          filePreview = '/icons/jpg-file.svg';
          fileIcon = '/icons/jpg-icon.svg';
        } else if (ext === 'png') {
          filePreview = '/icons/png-file.svg';
          fileIcon = '/icons/png-icon.svg';
        }

        return (
          <div
            key={index}
            className="w-[207px] h-[160px] border-[2px] rounded-[6px] border-[#BBBBBB] flex flex-col justify-between"
          >
            <div className="flex-1 flex items-center justify-center">
              <img src={filePreview} alt={`${ext?.toUpperCase() || 'File'} 파일`} />
            </div>
            <div className="border-t-[2px] border-[#BBBBBB] px-[12px] py-[5px] flex items-center gap-[8px]">
              <img src={fileIcon} alt={`${ext?.toUpperCase() || 'File'} 아이콘`} />
              <p className="text-[16px] truncate">{file.name}</p>
            </div>
          </div>
        );
      })}

      {/* 파일 업로드 버튼 (클릭 & 드래그 대응) */}
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-[207px] h-[160px] border-[2px] rounded-[6px] ${
          isDragging ? 'border-[#81D7D4] bg-[#F0FBFB]' : 'border-[#BBBBBB]'
        } grid place-items-center cursor-pointer`}
      >
        <img src="/icons/file-upload.svg" alt="파일 업로드" />
      </label>
      <input
        id="file-upload"
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
