export interface CopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  messageContent: React.ReactNode;
  textToCopy: string;
  copySuccessText: string;
  innerPaddingX: string;
  onCopy?: () => void;
}
