'use client';

import React, { useRef, useState } from 'react';
import { useUploadTaskFile, useDeleteTaskFile } from '@/hooks/mutations/useFileUploadMutations';
import { useParams } from 'next/navigation';

type UploadedFile = File & { serverId?: number; fileUrl?: string };

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
      const uploadedFiles: UploadedFile[] = Array.from(e.target.files).filter(
        (file) => file && file.name
      );

      // 중복 파일 체크 및 필터링
      const newFiles = uploadedFiles.filter((newFile) => {
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        );

        if (isDuplicate) {
          console.log('⚠️ 중복 파일 감지:', newFile.name);
          alert(`파일 "${newFile.name}"이(가) 이미 업로드되어 있습니다.`);
          return false;
        }

        return true;
      });

      if (newFiles.length === 0) {
        // 파일 입력 초기화
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        if (typeof taskId === 'string' && file && file.name) {
          uploadMutation.mutate(
            { taskId: Number(taskId), file },
            {
              onSuccess: (data) => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f === file
                      ? {
                          ...f,
                          serverId: data.result.id,
                          fileUrl: data.result.fileUrl,
                          name: file.name,
                        }
                      : f
                  )
                );
                console.log('✅ 파일 업로드 성공:', data.result);
              },
              onError: (error: Error) => {
                console.error('❌ 파일 업로드 실패:', error);
                alert(error.message || '파일 업로드에 실패했습니다.');
                // 실패한 파일 제거
                setFiles((prev) => prev.filter((f) => f !== file));
              },
            }
          );
        }
      });
    }

    // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // 드래그 앤 드롭으로 파일을 놓았을 때 파일을 상태에 추가 및 업로드 트리거
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles: UploadedFile[] = Array.from(e.dataTransfer.files).filter(
        (file) => file && file.name
      );

      // 중복 파일 체크 및 필터링
      const newFiles = droppedFiles.filter((newFile) => {
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        );

        if (isDuplicate) {
          console.log('⚠️ 중복 파일 감지:', newFile.name);
          alert(`파일 "${newFile.name}"이(가) 이미 업로드되어 있습니다.`);
          return false;
        }

        return true;
      });

      if (newFiles.length === 0) {
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        if (typeof taskId === 'string' && file && file.name) {
          uploadMutation.mutate(
            { taskId: Number(taskId), file },
            {
              onSuccess: (data) => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f === file
                      ? {
                          ...f,
                          serverId: data.result.id,
                          fileUrl: data.result.fileUrl,
                          name: file.name,
                        }
                      : f
                  )
                );
                console.log('✅ 파일 업로드 성공:', data.result);
              },
              onError: (error: Error) => {
                console.error('❌ 파일 업로드 실패:', error);
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

  // 파일 삭제 핸들러
  const handleFileDelete = (file: UploadedFile, index: number) => {
    if (file.serverId) {
      deleteMutation.mutate(file.serverId, {
        onSuccess: (data) => {
          console.log('✅ 파일 삭제 성공:', data.message || '파일이 삭제되었습니다.');
          setFiles((prev) => prev.filter((_, i) => i !== index));
          // 파일 삭제 후 입력 초기화
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        },
        onError: (error: Error) => {
          console.error('❌ 파일 삭제 실패:', error);
          alert(error.message || '파일 삭제에 실패했습니다.');
        },
      });
    } else {
      // 서버에 업로드되지 않은 파일은 바로 제거
      setFiles((prev) => prev.filter((_, i) => i !== index));
      // 파일 삭제 후 입력 초기화
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex ml-[28px] gap-[20px]">
      {/* 파일 목록 렌더링 */}
      {files.map((file, index) => {
        // file.name이 undefined일 수 있으므로 안전하게 처리
        const fileName = file?.name || 'Unknown File';
        const ext = fileName.split('.').pop()?.toLowerCase();

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
        } else if (ext === 'jpg' || ext === 'jpeg') {
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
                  onClick={() => handleFileDelete(file, index)}
                />
              ) : (
                <img
                  src={fileIcon}
                  alt={`${ext?.toUpperCase() || 'File'} 아이콘`}
                  className="w-[20px] h-[20px] cursor-pointer"
                />
              )}
              <p className="text-[16px] truncate">{fileName}</p>
            </div>
            {hoveredIndex === index && (
              <button
                type="button"
                className="absolute top-[8px] right-[8px] cursor-pointer"
                onClick={() => {
                  // 서버 URL이 있으면 그것을 사용, 없으면 로컬 URL 생성
                  if (file.fileUrl) {
                    const a = document.createElement('a');
                    a.href = file.fileUrl;
                    a.download = fileName;
                    a.click();
                  } else {
                    const url = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
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
