import { authHandlers } from './auth';
import { eventHandlers } from './events';
import { ticketHandlers } from './tickets';

export const handlers = [...authHandlers, ...eventHandlers, ...ticketHandlers];
