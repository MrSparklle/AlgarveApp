export interface Booking {
  id: string;
  dateBooking: string;
  dateCreated: string;
  profile: {
    id: string;
    suite: number;
  };
  period: string[];
  bookingPrice: number;
  title: string;
  readedRules: boolean;
  highlight: boolean;
  billed: boolean;
}
