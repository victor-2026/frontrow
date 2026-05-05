import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';

import type { RootTabParamList } from './types';

export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: [Linking.createURL('/'), 'frontrow://', 'https://frontrow.app'],
  config: {
    screens: {
      Events: 'events',
      MyTickets: 'tickets',
      Profile: 'profile',
      Debug: 'debug',
    },
  },
};
