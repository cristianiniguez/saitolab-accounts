import { FirebaseError } from 'firebase/app';
import { FormattedMessage } from 'react-intl';
// components
import { Box, HStack, Stack, Button, Text, useColorModeValue } from '@chakra-ui/react';
import { Form, Formik, FormikConfig } from 'formik';
import { EmailInput, PasswordInput, TextInput } from '@/components/inputs';
import Link from '@/components/link/Link';
import GoogleButton from '../buttons/GoogleButton';
// utils
import { UserCredential } from 'firebase/auth';
import * as Yup from 'yup';
// hooks
import { useNavigate } from 'react-router-dom';
import useFormatMessage from '@/hooks/useFormatMessage';
import useAppToast from '@/hooks/useAppToast';
// constants
import * as C from '@/constants';
import useSignUp from '@/hooks/useSignUp';

const getErrorMessageId = (error: unknown): string | null => {
  const defaultErrorMessageId = 'signUp.form.toast.error.description';
  if (!(error instanceof FirebaseError)) return defaultErrorMessageId;

  switch (error.code) {
    case C.FIREBASE_AUTH_ERROR_CODES.AUTH_POPUP_CLOSED_BY_USER:
      return null;
    case C.FIREBASE_AUTH_ERROR_CODES.AUTH_WEAK_PASSWORD:
      return 'signUp.form.toast.error.description.weak.password';
    case C.FIREBASE_AUTH_ERROR_CODES.AUTH_EMAIL_ALREADY_IN_USE:
      return 'signUp.form.toast.error.description.email.used';
    default:
      return defaultErrorMessageId;
  }
};

type SignUpFormConfig = FormikConfig<{
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}>;

const SignUpFormComponent: SignUpFormConfig['component'] = ({ isSubmitting }) => {
  const t = useFormatMessage();
  const toast = useAppToast();

  const handleGoogleButtonSuccess = ({ user: { displayName } }: UserCredential) => {
    toast({
      description: t('signIn.form.toast.success.description', { displayName }),
      status: 'success',
    });
  };

  const handleGoogleButtonError = (error: unknown) => {
    const errorMessageId = getErrorMessageId(error);
    errorMessageId && toast({ description: t(errorMessageId), status: 'error' });
  };

  return (
    <Form id='sign-up-form'>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow='lg'
        p={8}
        rounded='lg'
        w={{ md: 'md' }}
      >
        <Stack spacing={4}>
          <HStack alignItems='start'>
            <Box>
              <TextInput id='firstName' label={t('signUp.form.firstName.label')} name='firstName' />
            </Box>
            <Box>
              <TextInput id='lastName' label={t('signUp.form.lastName.label')} name='lastName' />
            </Box>
          </HStack>
          <EmailInput label={t('signUp.form.email.label')} />
          <PasswordInput label={t('signUp.form.password.label')} />
          <Button
            color='white'
            colorScheme='green'
            isLoading={isSubmitting}
            loadingText={t('signUp.form.submitButton.loading')}
            type='submit'
          >
            {t('signUp.form.submitButton.label')}
          </Button>
          <GoogleButton
            label={t('signUp.form.googleButton.label')}
            onError={handleGoogleButtonError}
            onSuccess={handleGoogleButtonSuccess}
          />
          <Text align='center' id='sign-up-form-footer'>
            <FormattedMessage
              id='signUp.form.footer'
              values={{
                login: (
                  <Link color='green' href={C.ROUTES.SIGN_IN}>
                    {t('signUp.form.footer.login')}
                  </Link>
                ),
              }}
            />
          </Text>
        </Stack>
      </Box>
    </Form>
  );
};

const SignUpForm = () => {
  const navigate = useNavigate();
  const t = useFormatMessage();
  const toast = useAppToast();
  const signUp = useSignUp();

  const handleSubmit: SignUpFormConfig['onSubmit'] = async (values, { setSubmitting }) => {
    try {
      const user = await signUp(values.email, values.password, values.firstName, values.lastName);
      toast({
        description: t('signUp.form.toast.success.description', { displayName: user.displayName }),
        status: 'success',
      });
      navigate(C.ROUTES.DASHBOARD);
    } catch (e) {
      console.error(e);
      const errorMessageId = getErrorMessageId(e);
      errorMessageId && toast({ description: t(errorMessageId), status: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitialValues = (): SignUpFormConfig['initialValues'] => {
    return { email: '', firstName: '', lastName: '', password: '' };
  };

  const getValidationSchema = (): SignUpFormConfig['validationSchema'] =>
    Yup.object().shape({
      email: Yup.string()
        .email(t('signUp.form.email.error.invalid'))
        .required(t('signUp.form.email.error.required')),
      firstName: Yup.string().required(t('signUp.form.firstName.error.required')),
      lastName: Yup.string().required(t('signUp.form.lastName.error.required')),
      password: Yup.string().required(t('signUp.form.password.error.required')),
    });

  return (
    <Formik
      component={SignUpFormComponent}
      initialStatus={{ error: null }}
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema()}
    />
  );
};

export default SignUpForm;
