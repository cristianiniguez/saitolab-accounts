import { FC } from 'react';
import { useIntl } from 'react-intl';
// components
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { Form, Formik, FormikConfig } from 'formik';
import { SelectInput, TextInput } from '../inputs';
// hooks
import { useFirestore } from 'reactfire';
import useFormatMessage from '@/hooks/useFormatMessage';
import useAppToast from '@/hooks/useAppToast';
// utils
import { updateProfile, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as Yup from 'yup';
// constants
import { CURRENCIES } from '@/constants';

type PreferencesFormConfig = FormikConfig<{
  name: string;
  currency: string;
}>;

type PreferencesFormProps = {
  isOpen: boolean;
  onClose: () => void;
  preferences: Preferences;
  user: User;
};

const PreferencesForm: FC<PreferencesFormProps> = ({ isOpen, onClose, preferences, user }) => {
  const t = useFormatMessage();
  const toast = useAppToast();
  const firestore = useFirestore();

  const preferencesRef = doc(firestore, 'preferences', preferences.id);
  const { formatNumber } = useIntl();
  const getInitialValues = (): PreferencesFormConfig['initialValues'] => ({
    currency: preferences.currency || CURRENCIES.USD,
    name: user.displayName || '',
  });

  const getValidationSchema = (): PreferencesFormConfig['validationSchema'] =>
    Yup.object().shape({
      currency: Yup.string().required(t('preferences.form.currency.error.required')),
      name: Yup.string().required(t('preferences.form.name.error.required')),
    });

  const handleSubmit: PreferencesFormConfig['onSubmit'] = async (
    values,
    { resetForm, setSubmitting },
  ) => {
    const { currency, name } = values;

    try {
      await setDoc(preferencesRef, { currency }, { merge: true });
      await updateProfile(user, { displayName: name });
      toast({
        description: t('preferences.form.toast.success.description'),
        status: 'success',
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        description: t('preferences.form.toast.error.description'),
        status: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrencyOptions = () => {
    const exampleValue = 123456;
    const getCurrencyOption = (currency: string) => {
      const example = formatNumber(exampleValue, {
        currency,
        currencyDisplay: 'narrowSymbol',
        style: 'currency',
      });
      const label = t('preferences.form.currency.option.label', { currency, example });
      return { label, value: currency };
    };
    return Object.values(CURRENCIES).map(getCurrencyOption);
  };

  const renderForm: PreferencesFormConfig['component'] = ({ isSubmitting }) => {
    return (
      <Modal closeOnOverlayClick={!isSubmitting} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as={Form}>
          <ModalHeader>{t('preferences.form.title')}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              <TextInput id='name' label={t('preferences.form.name.label')} name='name' />
              <SelectInput
                id='currency'
                label={t('preferences.form.currency.label')}
                name='currency'
                options={getCurrencyOptions()}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button color='white' colorScheme='green' isLoading={isSubmitting} type='submit'>
              {t('preferences.form.submitButton.label')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Formik
      component={renderForm}
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema()}
    />
  );
};

export default PreferencesForm;
