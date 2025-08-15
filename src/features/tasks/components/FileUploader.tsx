'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useUploadTaskFile, useDeleteTaskFile } from '@/hooks/mutations/useFileUploadMutations';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { checkTaskDetail } from '@/services/taskDetail/checkTaskDetail';

type UploadedFile = File & { serverId?: number | string; fileUrl?: string; name?: string };

export default function FileUploader() {
  // 업로드된 파일 목록을 상태로 관리
  const [files, setFiles] = useState<UploadedFile[]>([]);
  // 드래그 상태를 나타내는 플래그
  const [isDragging, setIsDragging] = useState(false);
  // 파일 입력 요소에 대한 참조
  const inputRef = useRef<HTMLInputElement | null>(null);
  // 파일 카드 hover 상태 인덱스
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // 토스트 메시지 상태
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [showFormatToast, setShowFormatToast] = useState(false);
  const [isFormatToastVisible, setIsFormatToastVisible] = useState(false);

  // 삭제 확인 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ file: UploadedFile; index: number } | null>(
    null
  );

  const { taskId } = useParams();
  const uploadMutation = useUploadTaskFile();
  const deleteMutation = useDeleteTaskFile();

  // 서버에서 파일 목록 가져오기
  const { data: taskData } = useQuery({
    queryKey: ['taskDetail', taskId],
    queryFn: () => checkTaskDetail(Number(taskId)),
    enabled: !!taskId,
  });

  // 서버 파일 목록을 로컬 상태와 동기화 (서버 응답 그대로 반영)
  useEffect(() => {
    if (!taskData?.result?.files) return;

    console.log('📥 서버 파일 목록 동기화:', taskData.result.files);

    const serverFiles: UploadedFile[] = taskData.result.files.map((file, index) => {
      // API가 파일 이름을 제공한다면 우선 사용, 없으면 URL로 fallback
      let fileName = (file as any).name as string | undefined;
      if (!fileName && file.fileUrl) {
        try {
          const urlParts = file.fileUrl.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          if (lastPart) fileName = decodeURIComponent(lastPart);
        } catch {
          fileName = `파일 ${index + 1}`;
        }
      }
      if (!fileName) fileName = `파일 ${index + 1}`;

      return {
        name: fileName,
        size: 0,
        type: '',
        lastModified: Date.now(),
        fileUrl: file.fileUrl,
        serverId: file.id,
      } as UploadedFile;
    });

    console.log('🔄 파일 목록 동기화 (서버 기준):', {
      count: serverFiles.length,
      serverFileIds: serverFiles.map((f) => f.serverId),
    });

    // 서버 파일과 로컬(업로드 중) 파일을 병합
    setFiles((prevFiles) => {
      const localOnlyFiles = prevFiles.filter(
        (f) => typeof f.serverId === 'string' || f.serverId === undefined
      );

      console.log('🔄 파일 병합:', {
        serverFilesCount: serverFiles.length,
        localOnlyFilesCount: localOnlyFiles.length,
        mergedCount: serverFiles.length + localOnlyFiles.length,
      });

      return [...serverFiles, ...localOnlyFiles];
    });
  }, [taskData?.result?.files]);

  // 파일 목록 변경 추적
  useEffect(() => {
    console.log('🎨 파일 목록 변경됨:', { filesCount: files.length, files });
  }, [files]);

  // 파일 입력 변경 시 업로드된 파일을 상태에 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles: UploadedFile[] = Array.from(e.target.files).filter(
        (file) => file && file.name
      );

      // 허용된 파일 형식 필터링
      const allowedExtensions = ['pdf', 'txt', 'jpg', 'jpeg', 'png'];
      const validFiles = uploadedFiles.filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ext && allowedExtensions.includes(ext);
      });

      const invalidFiles = uploadedFiles.filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return !ext || !allowedExtensions.includes(ext);
      });

      // 지원되지 않는 형식 토스트 메시지
      const hasInvalid = invalidFiles.length > 0;
      if (hasInvalid) {
        setShowFormatToast(true);
        setIsFormatToastVisible(true);
        setTimeout(() => {
          setIsFormatToastVisible(false);
          setTimeout(() => setShowFormatToast(false), 300);
        }, 1700);
      }

      // 현재 서버 파일 개수 계산 (서버에서 가져온 파일들 + 업로드 중인 파일들)
      const serverFiles = taskData?.result?.files || [];
      const uploadingFiles = files.filter(
        (f) => typeof f.serverId === 'string' && f.serverId.includes('temp')
      );

      // 3개 제한에 맞춰 처리
      const maxAllowedFiles = Math.max(0, 3 - serverFiles.length - uploadingFiles.length);

      if (maxAllowedFiles === 0) {
        // 이미 3개 파일이 있는 경우
        if (!hasInvalid) {
          setToastMessage('파일은 최대 3개까지 업로드할 수 있습니다.');
          setShowToast(true);
          setIsToastVisible(true);
          setTimeout(() => {
            setIsToastVisible(false);
            setTimeout(() => setShowToast(false), 300);
          }, 1700);
        }

        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }

      // 중복 파일 체크 및 필터링
      const nonDuplicateFiles = validFiles.filter((newFile) => {
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        );

        if (isDuplicate) {
          console.log('⚠️ 중복 파일 감지:', newFile.name);
          return false;
        }

        return true;
      });

      // 허용된 개수만큼만 선택
      const filesToUpload = nonDuplicateFiles.slice(0, maxAllowedFiles);
      const rejectedFiles = nonDuplicateFiles.slice(maxAllowedFiles);

      // 개수 제한 토스트 메시지
      if (rejectedFiles.length > 0 && invalidFiles.length === 0) {
        setToastMessage(`파일은 최대 3개까지 업로드할 수 있습니다.`);
        setShowToast(true);
        setIsToastVisible(true);
        setTimeout(() => {
          setIsToastVisible(false);
          setTimeout(() => setShowToast(false), 300);
        }, 1700);
      }

      const newFiles = filesToUpload;

      if (newFiles.length === 0) {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }

      // 파일 업로드 (즉시 UI 업데이트)
      newFiles.forEach((file) => {
        if (typeof taskId === 'string' && file && file.name) {
          console.log('📤 파일 업로드 API 호출:', {
            taskId: Number(taskId),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          });

          uploadMutation.mutate(
            { taskId: Number(taskId), file },
            {
              onSuccess: (data) => {
                console.log('✅ 파일 업로드 성공 - 응답 데이터:', data);
                console.log('✅ 파일 업로드 성공 - 응답 구조:', {
                  hasResult: !!data.result,
                  resultKeys: data.result ? Object.keys(data.result) : null,
                  id: data.result?.id,
                  fileUrl: data.result?.fileUrl,
                });

                setFiles((prev) => {
                  console.log('🔄 setFiles 호출 - 이전 파일 목록:', prev);
                  const newFileList = [
                    ...prev,
                    {
                      name: data.result.name || file.name,
                      size: file.size,
                      type: file.type,
                      lastModified: file.lastModified,
                      serverId: data.result.id,
                      fileUrl: data.result.fileUrl,
                    } as UploadedFile,
                  ];
                  console.log('🔄 setFiles 호출 - 새로운 파일 목록:', newFileList);
                  return newFileList;
                });
              },
              onError: (error: Error) => {
                console.error('❌ 파일 업로드 실패:', error);
                console.error('❌ 파일 업로드 실패 상세:', {
                  taskId: Number(taskId),
                  fileName: file.name,
                  errorMessage: error.message,
                  errorStack: error.stack,
                });
                alert(error.message || '파일 업로드에 실패했습니다.');
              },
            }
          );
        }
      });
    }

    // 파일 입력 초기화
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

      // 허용된 파일 형식 필터링
      const allowedExtensions = ['pdf', 'txt', 'jpg', 'jpeg', 'png'];
      const validFiles = droppedFiles.filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ext && allowedExtensions.includes(ext);
      });

      const invalidFiles = droppedFiles.filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return !ext || !allowedExtensions.includes(ext);
      });

      // 지원되지 않는 형식 토스트 메시지 (드롭 케이스에서도 동일 로직 사용을 위해 hasInvalid 플래그 유지)
      const hasInvalid = invalidFiles.length > 0;
      if (hasInvalid) {
        setShowFormatToast(true);
        setIsFormatToastVisible(true);
        setTimeout(() => {
          setIsFormatToastVisible(false);
          setTimeout(() => setShowFormatToast(false), 300);
        }, 1700);
      }

      // 현재 서버 파일 개수 계산 (서버에서 가져온 파일들 + 업로드 중인 파일들)
      const serverFiles = taskData?.result?.files || [];
      const uploadingFiles = files.filter(
        (f) => typeof f.serverId === 'string' && f.serverId.includes('temp')
      );

      // 3개 제한에 맞춰 처리
      const maxAllowedFiles = Math.max(0, 3 - serverFiles.length - uploadingFiles.length);

      if (maxAllowedFiles === 0) {
        // 이미 3개 파일이 있는 경우
        if (!hasInvalid) {
          setToastMessage('파일은 최대 3개까지 업로드할 수 있습니다.');
          setShowToast(true);
          setIsToastVisible(true);
          setTimeout(() => {
            setIsToastVisible(false);
            setTimeout(() => setShowToast(false), 300);
          }, 1700);
        }
        return;
      }

      // 중복 파일 체크 및 필터링
      const nonDuplicateFiles = validFiles.filter((newFile) => {
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        );

        if (isDuplicate) {
          console.log('⚠️ 중복 파일 감지:', newFile.name);
          return false;
        }

        return true;
      });

      // 허용된 개수만큼만 선택
      const filesToUpload = nonDuplicateFiles.slice(0, maxAllowedFiles);
      const rejectedFiles = nonDuplicateFiles.slice(maxAllowedFiles);

      // 개수 제한 토스트 메시지
      if (rejectedFiles.length > 0 && invalidFiles.length === 0) {
        setToastMessage(`파일은 최대 3개까지 업로드할 수 있습니다.`);
        setShowToast(true);
        setIsToastVisible(true);
        setTimeout(() => {
          setIsToastVisible(false);
          setTimeout(() => setShowToast(false), 300);
        }, 1700);
      }

      const newFiles = filesToUpload;

      if (newFiles.length === 0) {
        return;
      }

      // 파일 업로드 (즉시 UI 업데이트)
      newFiles.forEach((file) => {
        if (typeof taskId === 'string' && file && file.name) {
          uploadMutation.mutate(
            { taskId: Number(taskId), file },
            {
              onSuccess: (data) => {
                console.log('✅ 파일 업로드 성공:', data.result);
                console.log('✅ 파일 업로드 성공 - 응답 구조:', {
                  hasResult: !!data.result,
                  resultKeys: data.result ? Object.keys(data.result) : null,
                  id: data.result?.id,
                  fileUrl: data.result?.fileUrl,
                });

                setFiles((prev) => {
                  console.log('🔄 setFiles 호출 (드래그) - 이전 파일 목록:', prev);
                  const newFileList = [
                    ...prev,
                    {
                      name: data.result.name || file.name,
                      size: file.size,
                      type: file.type,
                      lastModified: file.lastModified,
                      serverId: data.result.id,
                      fileUrl: data.result.fileUrl,
                    } as UploadedFile,
                  ];
                  console.log('🔄 setFiles 호출 (드래그) - 새로운 파일 목록:', newFileList);
                  return newFileList;
                });
              },
              onError: (error: Error) => {
                console.error('❌ 파일 업로드 실패:', error);
                console.error('❌ 파일 업로드 실패 상세:', {
                  taskId: Number(taskId),
                  fileName: file.name,
                  errorMessage: error.message,
                  errorStack: error.stack,
                });
                alert(error.message || '파일 업로드에 실패했습니다.');
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

  // 파일 삭제 확인 모달 표시
  const handleDeleteClick = (file: UploadedFile, index: number) => {
    setFileToDelete({ file, index });
    setShowDeleteModal(true);
  };

  // 파일 삭제 실행
  const handleConfirmDelete = () => {
    if (!fileToDelete) return;

    const { file, index } = fileToDelete;
    console.log('🔍 파일 삭제 시도:', { file, index, serverId: file.serverId });

    // 모달 닫기
    setShowDeleteModal(false);
    setFileToDelete(null);

    if (file.serverId && typeof file.serverId === 'number') {
      console.log('📡 서버 파일 삭제 API 호출:', { taskFileId: file.serverId });

      // 즉시 UI에서 파일 제거
      setFiles((prev) => prev.filter((f) => f.serverId !== file.serverId));

      // 백그라운드에서 서버 삭제 처리
      deleteMutation.mutate(file.serverId, {
        onSuccess: (data) => {
          console.log('✅ 파일 삭제 성공:', data.message || '파일이 삭제되었습니다.');
        },
        onError: (error: Error) => {
          console.error('❌ 파일 삭제 실패:', error);
          alert(error.message || '파일 삭제에 실패했습니다.');
          // 실패 시 파일을 다시 추가
          setFiles((prev) => [...prev, file]);
        },
      });
    } else {
      console.log('🗑️ 로컬 파일 삭제');
      // 로컬 파일은 즉시 제거
      setFiles((prev) => prev.filter((_, i) => i !== index));
      // 파일 삭제 후 입력 초기화
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  // 삭제 모달 닫기
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  return (
    <div className="flex ml-[28px] gap-[20px] relative">
      {/* 파일 목록 렌더링 */}
      {files.map((file, index) => {
        // file.name이 undefined일 수 있으므로 안전하게 처리
        const fileName = file?.name || `파일 ${index + 1}`;
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
              <Image
                src={filePreview}
                alt={`${ext?.toUpperCase() || 'File'} 파일`}
                width={88}
                height={88}
                className="w-[88px] h-[88px]"
              />
            </div>
            <div className="border-t-[2px] border-[#BBBBBB] px-[12px] py-[5px] flex items-center gap-[8px]">
              {hoveredIndex === index ? (
                <Image
                  src="/icons/delete-file-icon.svg"
                  alt="삭제 아이콘"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] cursor-pointer"
                  onClick={() => handleDeleteClick(file, index)}
                />
              ) : (
                <Image
                  src={fileIcon}
                  alt={`${ext?.toUpperCase() || 'File'} 아이콘`}
                  width={20}
                  height={20}
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
                <Image src="/icons/download-file-icon.svg" alt="다운로드" width={20} height={20} />
              </button>
            )}
          </div>
        );
      })}

      {/* 파일 업로드 버튼 (클릭 & 드래그 대응) - 최대 3개까지, 3개 이상이면 버튼 숨김 */}
      {files.length < 3 && (
        <>
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
              <Image
                src="/icons/file-upload.svg"
                alt="파일 업로드"
                width={88}
                height={88}
                className="w-[88px] h-[88px]"
              />
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
        </>
      )}

      {/* 토스트 메시지들 */}
      <div className="absolute bottom-0 left-[calc(100%+20px)] flex flex-col gap-4 z-10">
        {/* 파일 개수 제한 토스트 */}
        {showToast && (
          <div
            className={`bg-[#F8F8F8] text-[#505050] border border-[#BBBBBB] px-[20px] py-[8px] rounded-md text-[18px] whitespace-nowrap transition-opacity duration-300 ${
              isToastVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {toastMessage}
          </div>
        )}

        {/* 지원되지 않는 형식 토스트 */}
        {showFormatToast && (
          <div
            className={`bg-[#F8F8F8] text-[#505050] border border-[#BBBBBB] px-[20px] py-[8px] rounded-md text-[18px] whitespace-nowrap transition-opacity duration-300 ${
              isFormatToastVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            pdf, txt, jpg, png 파일만 업로드 가능합니다.
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-[#F8F8F8] rounded-[12px] px-[60px] py-[66px] w-[460px] h-[214px] relative"
            style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <Image src="/icons/CloseModal.svg" alt="닫기" width={20} height={20} />
            </button>

            {/* 모달 내용 */}
            <div className="text-center">
              <h3 className="text-[20px] font-semibold text-black mb-6">
                이 파일을 정말 삭제하시겠습니까?
              </h3>

              {/* 버튼 */}
              <div className="flex gap-[28px] justify-center">
                <button
                  onClick={handleCancelDelete}
                  className="px-[28px] py-[4px] border border-black bg-[#FFFFFF] text-[18px] rounded-[4px] "
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-[28px] py-[4px] border border-black bg-[#FFFFFF] text-[18px] rounded-[4px] "
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
