import { FC } from 'react';
// components
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaPencilAlt } from 'react-icons/fa';
import PreferencesForm from '../forms/PreferencesForm';
// hooks
import useFormatMessage from '@/hooks/useFormatMessage';
import usePreferences from '@/hooks/usePreferences';
// HOCs
import withUser, { WithUserProps } from '@/hocs/withUser';

type PreferencesSectionProps = WithUserProps;

const PreferencesSection: FC<PreferencesSectionProps> = ({ user }) => {
  const t = useFormatMessage();
  const { data: preferences, status } = usePreferences(user);
  const { isOpen, onClose, onOpen } = useDisclosure();

  if (status === 'loading')
    return (
      <Box as='section'>
        <Container maxW='container.xl' py={4}>
          <Center>
            <Spinner color='green' />
          </Center>
        </Container>
      </Box>
    );

  return (
    <Box as='section'>
      <Container maxW='container.xl' py={4}>
        <VStack alignItems='stretch' divider={<Divider />} spacing={4}>
          <Flex alignItems='flex-end' justifyContent='space-between'>
            <Heading fontSize='lg'>{t('profile.subtitle.preferences')}</Heading>
            <Button colorScheme='blue' leftIcon={<FaPencilAlt />} onClick={onOpen}>
              {t('preferences.button.edit.label')}
            </Button>
          </Flex>
          <VStack
            alignItems='stretch'
            bgColor='white'
            borderRadius='md'
            boxShadow='md'
            divider={<Divider />}
            p={4}
          >
            <Flex alignItems='flex-end' justifyContent='space-between'>
              <Text fontWeight='bold'>{t('preferences.form.name.label')}</Text>
              <Text>{user.displayName}</Text>
            </Flex>
            <Flex alignItems='flex-end' justifyContent='space-between'>
              <Text fontWeight='bold'>{t('preferences.form.currency.label')}</Text>
              <Text>{preferences.currency}</Text>
            </Flex>
          </VStack>
        </VStack>
      </Container>

      <PreferencesForm isOpen={isOpen} onClose={onClose} preferences={preferences} user={user} />
    </Box>
  );
};

export default withUser(PreferencesSection);
