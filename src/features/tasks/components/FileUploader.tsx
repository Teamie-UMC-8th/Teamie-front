'use client';

import React, { useRef, useState } from 'react';
import { useUploadTaskFile, useDeleteTaskFile } from '@/hooks/mutations/useFileUploadMutations';
import { useParams } from 'next/navigation';

type UploadedFile = File & { serverId?: number };

export default function FileUploader() {
  // 업로드된 파일 목록을 상태로 관리
  const [files, setFiles] = useState<UploadedFile[]>([]);
  // 드래그 상태를 나타내는 플래그
  const [isDragging, setIsDragging] = useState(false);
  // 파일 입력 요소에 대한 참조
  const inputRef = useRef<HTMLInputElement | null>(null);
  // 파일 카드 hover 상태 인덱스
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { taskId } = useParams();
  const uploadMutation = useUploadTaskFile();
  const deleteMutation = useDeleteTaskFile();

  // 파일 입력 변경 시 업로드된 파일을 상태에 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles: UploadedFile[] = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...uploadedFiles]);

      uploadedFiles.forEach((file) => {
        if (typeof taskId === 'string') {
          uploadMutation.mutate(
            { taskId: Number(taskId), file },
            {
              onSuccess: (data) => {
                setFiles((prev) =>
                  prev.map((f) => (f === file ? { ...f, serverId: data.result.id } : f))
                );
                console.log('파일 업로드 성공:', data.result);
              },
              onError: (error: Error) => {
                console.error('파일 업로드 실패:', error);
                alert(error.message || '파일 업로드에 실패했습니다.');
                // 실패한 파일 제거
                setFiles((prev) => prev.filter((f) => f !== file));
              },
            }
          );
        }
      });
    }
  };

  // 드래그 앤 드롭으로 파일을 놓았을 때 파일을 상태에 추가 및 업로드 트리거
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles: UploadedFile[] = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);

      droppedFiles.forEach((file) => {
        if (typeof taskId === 'string') {
          uploadMutation.mutate(
            { taskId: Number(taskId), file },
            {
              onSuccess: (data) => {
                setFiles((prev) =>
                  prev.map((f) => (f === file ? { ...f, serverId: data.result.id } : f))
                );
                console.log('파일 업로드 성공:', data.result);
              },
              onError: (error: Error) => {
                console.error('파일 업로드 실패:', error);
                alert(error.message || '파일 업로드에 실패했습니다.');
                // 실패한 파일 제거
                setFiles((prev) => prev.filter((f) => f !== file));
              },
            }
          );
        }
      });
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
        let fileIcon =
          hoveredIndex === index ? '/icons/delete-file-icon.svg' : '/icons/file-icon.svg';

        if (ext === 'pdf') {
          filePreview = '/icons/pdf-file.svg';
          fileIcon = hoveredIndex === index ? '/icons/delete-file-icon.svg' : '/icons/pdf-icon.svg';
        } else if (ext === 'txt') {
          filePreview = '/icons/txt-file.svg';
          fileIcon = hoveredIndex === index ? '/icons/delete-file-icon.svg' : '/icons/txt-icon.svg';
        } else if (ext === 'jpg') {
          filePreview = '/icons/jpg-file.svg';
          fileIcon = hoveredIndex === index ? '/icons/delete-file-icon.svg' : '/icons/jpg-icon.svg';
        } else if (ext === 'png') {
          filePreview = '/icons/png-file.svg';
          fileIcon = hoveredIndex === index ? '/icons/delete-file-icon.svg' : '/icons/png-icon.svg';
        }

        return (
          <div
            key={index}
            className={`w-[207px] h-[160px] border-[2px] rounded-[6px] border-[#BBBBBB] flex flex-col justify-between relative ${
              hoveredIndex === index ? 'bg-[#00000014]' : ''
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex-1 flex items-center justify-center">
              <img
                src={filePreview}
                alt={`${ext?.toUpperCase() || 'File'} 파일`}
                className="w-[88px] h-[88px]"
              />
            </div>
            <div className="border-t-[2px] border-[#BBBBBB] px-[12px] py-[5px] flex items-center gap-[8px]">
              {hoveredIndex === index ? (
                <img
                  src="/icons/delete-file-icon.svg"
                  alt="삭제 아이콘"
                  className="w-[20px] h-[20px] cursor-pointer"
                  onClick={() => {
                    if (file.serverId) {
                      deleteMutation.mutate(file.serverId, {
                        onSuccess: (data) => {
                          console.log('파일 삭제 성공:', data.message);
                          setFiles((prev) => prev.filter((_, i) => i !== index));
                        },
                        onError: (error: Error) => {
                          console.error('파일 삭제 실패:', error);
                          alert(error.message || '파일 삭제에 실패했습니다.');
                        },
                      });
                    } else {
                      // 서버에 업로드되지 않은 파일은 바로 제거
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                    }
                  }}
                />
              ) : (
                <img
                  src={fileIcon}
                  alt={`${ext?.toUpperCase() || 'File'} 아이콘`}
                  className="w-[20px] h-[20px] cursor-pointer"
                />
              )}
              <p className="text-[16px] truncate">{file.name}</p>
            </div>
            {hoveredIndex === index && (
              <button
                type="button"
                className="absolute top-[8px] right-[8px] cursor-pointer"
                onClick={() => {
                  const url = URL.createObjectURL(file);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = file.name;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <img src="/icons/download-file-icon.svg" alt="다운로드" />
              </button>
            )}
          </div>
        );
      })}

      {/* 파일 업로드 버튼 (클릭 & 드래그 대응) */}
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-[207px] h-[160px] border-[2px] rounded-[6px] ${
          isDragging ? 'border-[#81D7D4] bg-[#F0FBFB]' : 'border-[#BBBBBB]'
        } grid place-items-center cursor-pointer`}
      >
        <div className="flex flex-col items-center">
          <img src="/icons/file-upload.svg" alt="파일 업로드" className="w-[88px] h-[88px]" />
          <div className="text-[#898989] text-[16px]">파일 업로드</div>
        </div>
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
