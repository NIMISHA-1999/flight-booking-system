import api from "@/lib/axios";

export interface PassengerData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  contactNumber: string;
}

export interface CreateBookingRequest {
  flightId: string;
  passengers: PassengerData[];
}

export interface BookingData {
  id: string;
  bookingReference: string;
  flightId: string;
  passengerCount: number;
  totalAmount: string | number;
  status: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  booking: BookingData;
  bookingId?: string;
  checkoutUrl?: string | null;
  passengers: PassengerData[];
}

export async function createBooking(
  data: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  console.log("CREATE BOOKING USING AXIOS");

  const response = await api.post("/bookings", data);

  return response.data;
}