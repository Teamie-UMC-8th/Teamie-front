'use client';

import React, { useRef, useState } from 'react';

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...uploadedFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex ml-[28px] gap-[20px]">
      {files.map((file, index) => (
        <div
          key={index}
          className="w-[207px] h-[160px] border-[2px] rounded-[6px] border-[#BBBBBB] flex flex-col justify-between"
        >
          <div className="flex-1 flex items-center justify-center">
            <img src="/icons/pdf-file.svg" alt="PDF 파일" />
          </div>
          <div className="border-t-[2px] border-[#BBBBBB] px-[12px] py-[5px] flex items-center gap-[8px]">
            <img src="/icons/pdf-icon.svg" alt="PDF 아이콘" />
            <p className="text-[16px] truncate">{file.name}</p>
          </div>
        </div>
      ))}

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
