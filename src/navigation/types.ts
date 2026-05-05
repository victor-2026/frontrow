import type { NavigatorScreenParams } from '@react-navigation/native';

export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: { id: string };
  BuyTicket: { eventId: string };
};

export type TicketsStackParamList = {
  MyTicketsList: undefined;
  TicketDetail: { id: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Login: undefined;
};

export type DebugStackParamList = {
  DebugHome: undefined;
};

export type RootTabParamList = {
  Events: NavigatorScreenParams<EventsStackParamList> | undefined;
  MyTickets: NavigatorScreenParams<TicketsStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
  Debug: NavigatorScreenParams<DebugStackParamList> | undefined;
};
