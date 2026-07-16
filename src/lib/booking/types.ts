export type BookingRecord = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  offer_id: string;
  offer_title: string;
  visit_date: string;
  visit_time: string;
  guest_count: number;
  total_price: number;
  status: string;
  created_at: string;
};

export type TicketRecord = {
  id: string;
  booking_id: string;
  ticket_code: string;
  created_at: string;
};

export type BookingWithTickets = BookingRecord & {
  tickets: TicketRecord[];
};

export type CreateBookingInput = {
  offerId: string;
  visitDate: string;
  visitTime: string;
  guestCount: number;
  customerName: string;
  email: string;
  phone: string;
};

export type CreateBookingResult =
  | {
      ok: true;
      orderNumber: string;
      ticketCodes: string[];
    }
  | {
      ok: false;
      error: string;
    };
