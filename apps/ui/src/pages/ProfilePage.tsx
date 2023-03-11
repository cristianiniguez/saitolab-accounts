import { FC } from 'react';
// components
import { Box, Container, Heading } from '@chakra-ui/react';
import Page from '@/components/layout/Page';
import PreferencesSection from '@/components/sections/PreferencesSection';
// hooks
import useFormatMessage from '@/hooks/useFormatMessage';
// HOCs
import withUser, { WithUserProps } from '@/hocs/withUser';

const ProfilePage: FC<WithUserProps> = ({ user }) => {
  const t = useFormatMessage();

  return (
    <Page title={t('profile.pageTitle')}>
      <Box as='section'>
        <Container maxW='container.xl' py={4}>
          <Heading mb={4}>{t('dashboard.title', { displayName: user.displayName })}</Heading>
        </Container>
      </Box>

      <PreferencesSection />
    </Page>
  );
};

export default withUser(ProfilePage);
