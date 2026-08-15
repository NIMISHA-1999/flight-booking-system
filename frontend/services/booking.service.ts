import api from "@/lib/axios";

export interface PassengerData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  contactNumber: string;
}

export interface BookingFlight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  fare: number;
}

export interface BookingPassenger
  extends PassengerData {
  id: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  flightId: string;
  passengerCount: number;
  totalAmount: number;
  status: string;
  flight: BookingFlight;
  passengers: BookingPassenger[];
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  booking: Booking;
  passengers: BookingPassenger[];
}

export interface GetBookingResponse {
  success: boolean;
  booking: Booking;
}

/**
 * Create booking
 */
export async function createBooking(data: {
  flightId: string;
  passengers: PassengerData[];
}) {
  const response =
    await api.post<CreateBookingResponse>(
      "/bookings",
      data,
    );

  return response.data;
}

/**
 * Get booking
 */
export async function getBookingById(
  bookingId: string,
) {
  const response =
    await api.get<GetBookingResponse>(
      `/bookings/${bookingId}`,
    );

  return response.data.booking;
}