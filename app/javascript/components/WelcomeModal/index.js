import React, {useContext} from 'react';

import * as R from 'ramda';
import {UserContext} from '../../context';
import {useMutation} from '@apollo/react-hooks';
import {
  Modal,
  Header,
  Body,
  Footer,
  FooterItem,
} from '@zendeskgarden/react-modals';
import {Button} from '@zendeskgarden/react-buttons';
import {Tag} from '@zendeskgarden/react-tags';

import ConfirmProfileSettingsMutation
  from './mutations/confirmProfileSettings.gql';

const isFirstSignIn = R.propSatisfies (R.isNil, 'lastSignInAt');
const confirmedProfileSetting = R.complement (
  R.path (['preference', 'confirmedProfileSettings'])
);
const requireConfirmProfileSettings = R.allPass ([
  isFirstSignIn,
  confirmedProfileSetting,
]);

const Notifications = () => {
  const {currentUser, setPreference} = useContext (UserContext);
  const [confirmProfileSettings, _] = useMutation (
    ConfirmProfileSettingsMutation
  );

  const officeName = R.path (['office', 'name']);
  const dismiss = () => {
    confirmProfileSettings ().then (r => {
      const pref = R.path (['data', 'confirmProfileSettings'], r);
      if (pref) {
        setPreference (pref);
      }
    });
  };

  if (currentUser && requireConfirmProfileSettings (currentUser)) {
    return (
      <Modal>
        <Header> 🎉 Welcome to Student Forum {currentUser.name}!</Header>
        <Body>
          <p>
            Your house is
            {' '}
            <strong>{officeName (currentUser)}</strong>
            {' '}
            by deafult. You may change it to your assigned house using the houses tab.
          </p>
          <p>
            To choose a different house, simply use the
            {' '}
            <Tag pill>Default House</Tag>
            {' '}
            setting located in your profile
            menu (top right corner of your screen.)
          </p>
          <p>Please let us know if you have any questions!</p>
        </Body>
        <Footer>
          <FooterItem>
            <Button primary onClick={dismiss}>
              Got it!
            </Button>
          </FooterItem>
        </Footer>
      </Modal>
    );
  }

  return null;
};

export default Notifications;
