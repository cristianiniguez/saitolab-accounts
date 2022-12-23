import { FC } from 'react';
import { Badge, BadgeProps } from '@chakra-ui/react';
import useAccountSummary from '@/hooks/useAccountSummary';
import useFormatCurrency from '@/hooks/useFormatCurrency';

type AccountBalanceBadgeProps = BadgeProps & { account: Account };

const AccountBalanceBadge: FC<AccountBalanceBadgeProps> = ({ account, ...badgeProps }) => {
  const {
    data: { balance },
    status,
  } = useAccountSummary(account);
  const formatCurrency = useFormatCurrency();

  if (status === 'loading') return null;

  return (
    <Badge colorScheme={balance > 0 ? 'green' : 'red'} fontSize='1em' {...badgeProps}>
      {formatCurrency(balance)}
    </Badge>
  );
};

export default AccountBalanceBadge;
