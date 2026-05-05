import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EventsListScreen } from '../screens/EventsListScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { BuyTicketScreen } from '../screens/BuyTicketScreen';
import { MyTicketsListScreen } from '../screens/MyTicketsListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DebugScreen } from '../screens/DebugScreen';
import type {
  DebugStackParamList,
  EventsStackParamList,
  ProfileStackParamList,
  RootTabParamList,
  TicketsStackParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const EventsStack = createNativeStackNavigator<EventsStackParamList>();
const TicketsStack = createNativeStackNavigator<TicketsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const DebugStack = createNativeStackNavigator<DebugStackParamList>();

function EventsNavigator() {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{ title: 'Events' }}
      />
      <EventsStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: '' }}
      />
      <EventsStack.Screen
        name="BuyTicket"
        component={BuyTicketScreen}
        options={{ title: 'Buy Ticket', presentation: 'modal' }}
      />
    </EventsStack.Navigator>
  );
}

function TicketsNavigator() {
  return (
    <TicketsStack.Navigator>
      <TicketsStack.Screen
        name="MyTicketsList"
        component={MyTicketsListScreen}
        options={{ title: 'My Tickets' }}
      />
    </TicketsStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign in', presentation: 'modal' }}
      />
    </ProfileStack.Navigator>
  );
}

function DebugNavigator() {
  return (
    <DebugStack.Navigator>
      <DebugStack.Screen
        name="DebugHome"
        component={DebugScreen}
        options={{ title: 'QA Debug Menu' }}
      />
    </DebugStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Events" component={EventsNavigator} />
      <Tab.Screen name="MyTickets" component={TicketsNavigator} options={{ title: 'My Tickets' }} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
      <Tab.Screen name="Debug" component={DebugNavigator} />
    </Tab.Navigator>
  );
}
