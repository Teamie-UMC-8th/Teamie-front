'use client';

import { useState, useEffect } from 'react';
import MeetingLogModal from '../MeetingLogModal';
import { useMasterPortfolioDetailRecords } from '@/hooks/queries/useGetMasterPortfolio';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/mutations/useUser';

interface Step2Props {
  selectedIds?: number[];
  onChangeSelectedIds?: (ids: number[]) => void;
}

export default function Step2({ selectedIds = [], onChangeSelectedIds }: Step2Props) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedLogContent, setSelectedLogContent] = useState('');
  const [selectedLogTitle, setSelectedLogTitle] = useState('');
  const [selectedLogDate, setSelectedLogDate] = useState('');
  const [localSelectedIndexes, setLocalSelectedIndexes] = useState<number[]>([]);
  const [modalRecordIndex, setModalRecordIndex] = useState<number | null>(null);

  const portfolioId = useParams().portfolioId;
  const { data: masterPortfolioDetailRecords } = useMasterPortfolioDetailRecords(
    Number(portfolioId)
  );
  const { data: user } = useUser();

  // selectedIds → localSelectedIndexes 동기화
  useEffect(() => {
    if (!masterPortfolioDetailRecords) return;

    const currentIds = localSelectedIndexes
      .map((i) => masterPortfolioDetailRecords[i]?.id)
      .filter(Boolean);

    if (JSON.stringify(currentIds.sort()) !== JSON.stringify(selectedIds.sort())) {
      const nextIndexes: number[] = [];
      masterPortfolioDetailRecords.forEach((record, idx) => {
        if (selectedIds.includes(record.id)) nextIndexes.push(idx);
      });
      setLocalSelectedIndexes(nextIndexes);
    }
  }, [masterPortfolioDetailRecords, selectedIds]);

  const toggleCardSelection = (index: number) => {
    if (typeof index !== 'number' || index < 0) return;

    setLocalSelectedIndexes((prev) => {
      const alreadySelected = prev.includes(index);
      if (alreadySelected) return prev.filter((i) => i !== index);
      if (prev.length >= 8) return prev;
      return [...prev, index];
    });
  };

  // 부모에게 선택된 ID 전달
  useEffect(() => {
    if (!onChangeSelectedIds || !masterPortfolioDetailRecords) return;
    const ids = localSelectedIndexes
      .map((i) => masterPortfolioDetailRecords[i]?.id)
      .filter(Boolean);
    onChangeSelectedIds(ids);
  }, [localSelectedIndexes, masterPortfolioDetailRecords]);

  // 날짜 포맷
  const formatToYYYYMMDD = (dateString: string) => {
    if (!dateString) return '';
    try {
      if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateString)) return dateString;
      if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        const [y, m, d] = dateString.slice(0, 10).split('-');
        return `${y}.${m}.${d}`;
      }
      const parsed = new Date(dateString);
      if (Number.isNaN(parsed.getTime())) return dateString;
      return `${parsed.getFullYear()}.${String(parsed.getMonth() + 1).padStart(2, '0')}.${String(parsed.getDate()).padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {masterPortfolioDetailRecords?.map((record, idx) => {
        const isSelected = localSelectedIndexes.includes(idx);
        return (
          <div
            key={record.id}
            className={`relative group border p-3 rounded ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
            onClick={() => toggleCardSelection(idx)}
          >
            <div className="flex justify-between items-center">
              <div className="text-black font-medium">{record.name}</div>
              <div className="text-gray-500 text-sm">{formatToYYYYMMDD(record.date)}</div>
            </div>

            <div className="mt-2 text-gray-700 text-sm whitespace-pre-wrap">
              {record.meetingRecords}
            </div>

            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 text-sm font-semibold rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLogContent(record.meetingRecords);
                setSelectedLogTitle(record.name);
                setSelectedLogDate(formatToYYYYMMDD(record.date));
                setModalRecordIndex(idx);
                setOpenModal(true);
              }}
            >
              회의록 보기
            </button>
          </div>
        );
      })}

      {openModal && (
        <MeetingLogModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={selectedLogTitle || '회의록'}
          date={selectedLogDate}
          content={selectedLogContent}
        />
      )}
    </div>
  );
}
