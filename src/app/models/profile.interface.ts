import { Roles } from './roles';

export interface Profile {
  id: string;
  name: string;
  suite: number;
  phone: string;
  mobile: string;
  email: string;
  avatarUrl: string;
  position: string;
  bookingCount: number;
  twitter: string;
  facebook: string;
  instagram: string;
  lastBooking: string; // data da ultima reserva realizada
  parkingSpace: Array<number>;
  aboutme: string;
  roles: Roles;
}
