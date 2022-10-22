import { FC, ReactNode, useRef } from 'react';
// components
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
// hooks
import useFormatMessage from '@/hooks/useFormatMessage';

type DialogProps = {
  body: ReactNode;
  cancelButton?: {
    label: string;
  };
  closeOnOverlayClick?: boolean;
  confirmButton: {
    isLoading: boolean;
    label: string;
    onClick: () => void;
  };
  header: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Dialog: FC<DialogProps> = ({
  body,
  cancelButton,
  closeOnOverlayClick = false,
  confirmButton,
  header,
  isOpen,
  onClose,
}) => {
  const t = useFormatMessage();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      closeOnOverlayClick={closeOnOverlayClick}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose} ref={cancelRef}>
              {cancelButton?.label || t('common.cancel')}
            </Button>

            <Button
              colorScheme='red'
              isLoading={confirmButton.isLoading}
              ml={3}
              onClick={confirmButton.onClick}
            >
              {confirmButton.label}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Dialog;
