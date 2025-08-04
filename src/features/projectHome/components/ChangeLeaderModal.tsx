import Portal from '@/components/Portal';

interface ChangeLeaderModalProps {
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}

export default function ChangeLeaderModal({
  onClose,
  onConfirm,
  memberName,
}: ChangeLeaderModalProps) {
  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">팀장 변경</h2>
          <p className="text-gray-600 mb-6">{memberName}님을 팀장으로 변경할까요?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              변경
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
