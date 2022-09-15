import { FormattedMessage } from 'react-intl';
// components
import { Box, Stack, Button, useColorModeValue, Text } from '@chakra-ui/react';
import { Form, Formik, FormikConfig } from 'formik';
import { EmailInput, PasswordInput } from '@/components/inputs';
import Link from '@/components/link/Link';
import { FaGoogle } from 'react-icons/fa';
// utils
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import * as Yup from 'yup';
// constants
import * as C from '@/constants';
// hooks
import { useAuth } from 'reactfire';
import { useNavigate } from 'react-router-dom';
import useFormatMessage from '@/hooks/useFormatMessage';
import useAppToast from '@/hooks/useAppToast';

const provider = new GoogleAuthProvider();

type SignInFormConfig = FormikConfig<{ email: string; password: string }>;

const SignInFormComponent: SignInFormConfig['component'] = ({ isSubmitting }) => {
  const t = useFormatMessage();
  const auth = useAuth();
  const toast = useAppToast();
  const navigate = useNavigate();

  const handleGoogleSubmit = async () => {
    try {
      const {
        user: { displayName },
      } = await signInWithPopup(auth, provider);
      toast({
        description: t('signIn.form.toast.success.description', { displayName }),
        status: 'success',
        title: t('signIn.form.toast.success.title'),
      });
      navigate(C.ROUTES.DASHBOARD);
    } catch (e) {
      console.error(e);
      toast({
        description: t('signIn.form.toast.error.description'),
        status: 'error',
        title: t('signIn.form.toast.error.title'),
      }); // TODO: catch all error codes
    }
  };

  return (
    <Form id='sign-in-form'>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow='lg'
        p={8}
        rounded='lg'
        w={{ md: 'md' }}
      >
        <Stack spacing={4}>
          <EmailInput label={t('signIn.form.email.label')} />
          <PasswordInput label='Password' />
          <Button color='white' colorScheme='green' isLoading={isSubmitting} type='submit'>
            {t('signIn.form.submitButton.label')}
          </Button>
          <Button
            color='white'
            colorScheme='red'
            leftIcon={<FaGoogle />}
            onClick={handleGoogleSubmit}
            type='button'
          >
            {t('signIn.form.googleButton.label')}
          </Button>
          <Text align='center' id='sign-in-form-footer'>
            <FormattedMessage
              id='signIn.form.footer'
              values={{
                enroll: (
                  <Link color='green' href={C.ROUTES.SIGN_UP}>
                    {t('signIn.form.footer.enroll')}
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

const SignInForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const t = useFormatMessage();
  const toast = useAppToast();

  const getInitialValues = (): SignInFormConfig['initialValues'] => ({
    email: '',
    password: '',
  });

  const getValidationSchema = (): SignInFormConfig['validationSchema'] =>
    Yup.object().shape({
      email: Yup.string()
        .email(t('signIn.form.email.error.invalid'))
        .required(t('signIn.form.email.error.required')),
      password: Yup.string().required(t('signIn.form.password.error.required')),
    });

  const handleSubmit: SignInFormConfig['onSubmit'] = async (values, { setSubmitting }) => {
    try {
      const {
        user: { displayName },
      } = await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        description: t('signIn.form.toast.success.description', { displayName }),
        status: 'success',
        title: t('signIn.form.toast.success.title'),
      });
      navigate(C.ROUTES.DASHBOARD);
    } catch (e) {
      console.error(e);
      toast({
        description: t('signIn.form.toast.error.description'),
        status: 'error',
        title: t('signIn.form.toast.error.title'),
      }); // TODO: catch all error codes
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      component={SignInFormComponent}
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema()}
    />
  );
};

export default SignInForm;
