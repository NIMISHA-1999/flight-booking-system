import api from "@/lib/axios";

/*
 * =====================================================
 * DASHBOARD
 * =====================================================
 */

export interface DashboardStats {
  bookingsToday: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  revenue: number;
  cancellationRate: number;
}

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const response = await api.get("/admin/dashboard");

    return response.data.stats;
  };

/*
 * =====================================================
 * FLIGHTS
 * =====================================================
 */

export interface Flight {
  id: string;

  flightNumber: string;
  airline: string;

  origin: string;
  destination: string;

  departureAt: string;
  arrivalAt: string;

  fare: number;

  totalSeats: number;
  availableSeats: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface FlightListResponse {
  success?: boolean;

  flights: Flight[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FlightPayload {
  flightNumber: string;
  airline: string;

  origin: string;
  destination: string;

  departureAt: string;
  arrivalAt: string;

  fare: number;

  totalSeats: number;

  availableSeats?: number;
}

/*
 * =====================================================
 * GET ALL FLIGHTS
 * =====================================================
 */

export const getAdminFlights = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  },
): Promise<FlightListResponse> => {
  const response = await api.get(
    "/admin/flights",
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search:
          params?.search?.trim() ||
          undefined,
      },
    },
  );

  return response.data;
};

/*
 * =====================================================
 * GET SINGLE FLIGHT
 * =====================================================
 */

export const getAdminFlight = async (
  id: string,
): Promise<Flight> => {
  const response = await api.get(
    `/admin/flights/${id}`,
  );

  return response.data.flight;
};

/*
 * =====================================================
 * CREATE FLIGHT
 * =====================================================
 */

export const createFlight = async (
  data: FlightPayload,
) => {
  const response = await api.post(
    "/admin/flights",
    data,
  );

  return response.data;
};

/*
 * =====================================================
 * UPDATE FLIGHT
 * =====================================================
 */

export const updateFlight = async (
  id: string,
  data: Partial<FlightPayload>,
) => {
  const response = await api.patch(
    `/admin/flights/${id}`,
    data,
  );

  return response.data;
};

/*
 * =====================================================
 * DELETE FLIGHT
 * =====================================================
 */

export const deleteFlight = async (
  id: string,
) => {
  const response = await api.delete(
    `/admin/flights/${id}`,
  );

  return response.data;
};

/*
 * =====================================================
 * UPDATE INVENTORY
 * =====================================================
 */

export const updateFlightInventory = async (
  id: string,
  data: {
    totalSeats: number;
    availableSeats: number;
  },
) => {
  const response = await api.patch(
    `/admin/flights/${id}/inventory`,
    data,
  );

  return response.data;
};

/*
 * =====================================================
 * BOOKINGS
 * =====================================================
 */

/*
 * =====================================================
 * BOOKINGS
 * =====================================================
 */

export type AdminBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "PAYMENT_FAILED"
  | "REFUNDED"
  | "FAILED";

export interface AdminBooking {
  id: string;

  bookingReference: string;

  status: AdminBookingStatus;

  totalAmount: number;

  createdAt: string;

  /*
   * =====================================================
   * USER
   * =====================================================
   */

  user?: {
    id: string;

    firstName?: string | null;
    lastName?: string | null;

    email?: string | null;

    role?: string | null;
  } | null;

  /*
   * =====================================================
   * FLIGHT
   * =====================================================
   */

  flight: {
    id: string;

    flightNumber: string;

    airline: string;

    origin: string;

    destination: string;

    departureAt: string;

    arrivalAt: string;

    fare?: number;

    totalSeats?: number;

    availableSeats?: number;
  };

  /*
   * =====================================================
   * PASSENGERS
   * =====================================================
   */

  passengers?: Array<{
    id: string;

    fullName: string;

    dateOfBirth: string;

    nationality: string;

    passportNumber: string;

    email: string;

    contactNumber: string;
  }>;

  /*
   * =====================================================
   * PAYMENT
   * =====================================================
   *
   * IMPORTANT:
   *
   * Backend returns:
   *
   * payment
   *
   * NOT:
   *
   * payments
   *
   * =====================================================
   */

  payment?: {
    id: string;

    amount: number;

    currency?: string | null;

    status: string;

    stripePaymentIntentId?: string | null;

    paidAt?: string | null;

    refundedAt?: string | null;
  } | null;
}

/*
 * =====================================================
 * BOOKINGS RESPONSE
 * =====================================================
 */

export interface AdminBookingsResponse {
  success?: boolean;

  count?: number;

  bookings: AdminBooking[];

  pagination?: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
}

/*
 * =====================================================
 * GET BOOKINGS
 * =====================================================
 */

export const getAdminBookings = async (
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
    origin?: string;
    destination?: string;
  },
): Promise<AdminBookingsResponse> => {
  const response = await api.get(
    "/admin/bookings",
    {
      params: {
        page: params?.page ?? 1,

        limit: params?.limit ?? 10,

        status:
          params?.status || undefined,

        date:
          params?.date || undefined,

        origin:
          params?.origin?.trim() ||
          undefined,

        destination:
          params?.destination?.trim() ||
          undefined,
      },
    },
  );

  return response.data;
};

/*
 * =====================================================
 * GET SINGLE BOOKING
 * =====================================================
 */

export const getAdminBooking = async (
  id: string,
): Promise<AdminBooking> => {
  const response = await api.get(
    `/admin/bookings/${id}`,
  );

  return response.data.booking;
};

/*
 * =====================================================
 * CANCEL BOOKING
 * =====================================================
 */

export interface CancelBookingResponse {
  success: boolean;

  message: string;

  booking?: AdminBooking;

  refundId?: string | null;

  code?: string;
}

export const cancelAdminBooking = async (
  id: string,
): Promise<CancelBookingResponse> => {
  const response = await api.patch(
    `/admin/bookings/${id}/cancel`,
  );

  return response.data;
};

export interface AdminBookingsResponse {
  success?: boolean;

  count?: number;

  bookings: AdminBooking[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/*
 * =====================================================
 * GET BOOKINGS
 * =====================================================
 */

// export const getAdminBookings =
//   async (
//     params?: {
//       page?: number;
//       limit?: number;
//       status?: string;
//       date?: string;
//       origin?: string;
//       destination?: string;
//     },
//   ): Promise<AdminBookingsResponse> => {
//     const response = await api.get(
//       "/admin/bookings",
//       {
//         params,
//       },
//     );

//     return response.data;
//   };

// /*
//  * =====================================================
//  * GET SINGLE BOOKING
//  * =====================================================
//  */

// export const getAdminBooking = async (
//   id: string,
// ): Promise<AdminBooking> => {
//   const response = await api.get(
//     `/admin/bookings/${id}`,
//   );

//   return response.data.booking;
// };

// /*
//  * =====================================================
//  * ADMIN CANCEL BOOKING
//  * =====================================================
//  *
//  * Backend:
//  *
//  * PATCH /admin/bookings/:bookingId/cancel
//  *
//  * This endpoint:
//  *
//  * 1. Finds booking
//  * 2. Checks payment
//  * 3. Refunds Stripe payment if required
//  * 4. Releases flight seats
//  * 5. Changes booking status to CANCELLED
//  * 6. Changes payment status to REFUNDED
//  *
//  * =====================================================
//  */

// export interface CancelBookingResponse {
//   success: boolean;

//   message: string;

//   booking?: AdminBooking;

//   refundId?: string | null;

//   code?: string;
// }

// export const cancelAdminBooking =
//   async (
//     id: string,
//   ): Promise<CancelBookingResponse> => {
//     const response = await api.patch(
//       `/admin/bookings/${id}/cancel`,
//     );

//     return response.data;
//   };

/*
 * =====================================================
 * ADMIN USERS
 * =====================================================
 */

export type AdminUserRole =
  | "USER"
  | "ADMIN";

export interface AdminUser {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  role: AdminUserRole | string;

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUsersResponse {
  success?: boolean;

  users: AdminUser[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/*
 * =====================================================
 * GET ALL ADMIN USERS
 * =====================================================
 *
 * GET /admin/users?page=1&limit=10
 *
 * Optional:
 *
 * GET /admin/users?page=1&limit=10&search=john
 *
 * =====================================================
 */

export const getAdminUsers = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  },
): Promise<AdminUsersResponse> => {
  const response = await api.get(
    "/admin/users",
    {
      params: {
        page: params?.page ?? 1,

        limit: params?.limit ?? 10,

        search:
          params?.search?.trim() ||
          undefined,
      },
    },
  );

  return response.data;
};

/*
 * =====================================================
 * GET SINGLE ADMIN USER
 * =====================================================
 */

export const getAdminUser = async (
  id: string,
): Promise<AdminUser> => {
  const response = await api.get(
    `/admin/users/${id}`,
  );

  return response.data.user;
};