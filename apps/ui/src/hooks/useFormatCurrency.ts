import { useIntl } from 'react-intl';
import { useUser } from 'reactfire';
import usePreferences from './usePreferences';

const useFormatCurrency = () => {
  const { data: user, status: userStatus } = useUser();
  const { data: preferences, status: preferencesStatus } = usePreferences(user);
  const { formatNumber } = useIntl();

  const ready = userStatus !== 'loading' && preferencesStatus !== 'loading' && preferences;

  return (value: number) => {
    if (!ready) return value;
    return formatNumber(value, {
      currency: preferences.currency,
      currencyDisplay: 'narrowSymbol',
      style: 'currency',
    });
  };
};

export default useFormatCurrency;
