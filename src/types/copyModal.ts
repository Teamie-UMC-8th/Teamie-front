export interface CopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  messageText: string;
  copySuccessText: string;
  innerPaddingX: string;
  onCopy?: () => void;
}
