import { FC, useState } from 'react';
// components
import {
  ButtonGroup,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Dialog from '../dialog/Dialog';
// hooks
import { useFirestore } from 'reactfire';
import useFormatMessage from '@/hooks/useFormatMessage';
import useAppToast from '@/hooks/useAppToast';
import useAccountSummary from '@/hooks/useAccountSummary';
// utils
import { deleteDoc, doc } from 'firebase/firestore';
import useFormatCurrency from '@/hooks/useFormatCurrency';

type MovesTableProps = {
  account: Account;
  moves: Move[];
  onEdit: (move: Move) => void;
};

const MovesTable: FC<MovesTableProps> = ({ account, moves, onEdit }) => {
  const [move, setMove] = useState<Move | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);
  const {
    data: { income, outcome },
    status,
  } = useAccountSummary(account);
  const firestore = useFirestore();
  const toast = useAppToast();
  const t = useFormatMessage();
  const formatCurrency = useFormatCurrency();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleDelete = async (move: Move) => {
    const moveRef = doc(firestore, 'accounts', account.id, 'moves', move.id);

    try {
      setDeleting(true);
      await deleteDoc(moveRef);
      toast({
        description: t('move.toast.delete.success.description'),
        status: 'success',
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const onDelete = (move: Move) => {
    setMove(move);
    onOpen();
  };

  const renderMoveButtons = (move: Move) => {
    return (
      <ButtonGroup isAttached>
        <IconButton
          aria-label={t('move.button.edit.aria.label')}
          colorScheme='blue'
          icon={<FaPencilAlt />}
          onClick={() => onEdit(move)}
          size='xs'
        />
        <IconButton
          aria-label={t('move.button.delete.aria.label')}
          colorScheme='red'
          icon={<FaTrash />}
          onClick={() => onDelete(move)}
          size='xs'
        />
      </ButtonGroup>
    );
  };

  const renderMoveRow = (move: Move) => {
    const amountFormatted = formatCurrency(move.amount);

    return (
      <Tr key={move.id}>
        <Td>{move.detail}</Td>
        <Td>{move.date}</Td>
        <Td isNumeric>{move.type === 'income' && amountFormatted}</Td>
        <Td isNumeric>{move.type === 'outcome' && amountFormatted}</Td>
        <Td>{renderMoveButtons(move)}</Td>
      </Tr>
    );
  };

  return (
    <>
      <TableContainer bgColor='white' borderRadius='md' boxShadow='md' p={4}>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>{t('moves.table.column.detail')}</Th>
              <Th>{t('moves.table.column.date')}</Th>
              <Th isNumeric>{t('moves.table.column.income')}</Th>
              <Th isNumeric>{t('moves.table.column.outcome')}</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>{moves.map(renderMoveRow)}</Tbody>
          {status !== 'loading' && (
            <Tfoot fontWeight='bold'>
              <Tr>
                <Td />
                <Td />
                <Td isNumeric>{formatCurrency(income)}</Td>
                <Td isNumeric>{formatCurrency(outcome)}</Td>
                <Td />
              </Tr>
            </Tfoot>
          )}
        </Table>
      </TableContainer>

      <Dialog
        body={t('move.delete.dialog.body')}
        closeOnOverlayClick={!deleting}
        confirmButton={{
          isLoading: deleting,
          label: t('move.delete.dialog.confirm.button.label'),
          onClick: () => move && handleDelete(move),
        }}
        header={t('move.delete.dialog.title')}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setMove(undefined);
        }}
      />
    </>
  );
};

export default MovesTable;
