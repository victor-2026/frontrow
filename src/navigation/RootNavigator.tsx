import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { EventsScreen } from '../screens/EventsScreen';
import { MyTicketsScreen } from '../screens/MyTicketsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DebugScreen } from '../screens/DebugScreen';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="MyTickets" component={MyTicketsScreen} options={{ title: 'My Tickets' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Debug" component={DebugScreen} />
    </Tab.Navigator>
  );
}
