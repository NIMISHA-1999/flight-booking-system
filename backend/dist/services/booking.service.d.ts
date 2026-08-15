interface CreatePassengerInput {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    email: string;
    contactNumber: string;
}
interface CreateBookingInput {
    flightId: string;
    passengers: CreatePassengerInput[];
}
export declare class BookingService {
    /**
     * Generate booking reference
     *
     * Example:
     * SKY-8F3A21
     */
    private generateBookingReference;
    /**
     * Create booking
     */
    createBooking(userId: string, data: CreateBookingInput): Promise<{
        passengers: {
            email: string;
            id: string;
            createdAt: Date;
            fullName: string;
            dateOfBirth: Date;
            nationality: string;
            passportNumber: string;
            contactNumber: string;
            bookingId: string;
        }[];
        flight: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            origin: string;
            destination: string;
            flightNumber: string;
            airline: string;
            departureAt: Date;
            arrivalAt: Date;
            fare: import("@prisma/client-runtime-utils").Decimal;
            totalSeats: number;
            availableSeats: number;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        flightId: string;
        bookingReference: string;
        passengerCount: number;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("../generated/prisma/enums").BookingStatus;
        stripePaymentIntentId: string | null;
    }>;
    /**
     * Get booking by ID
     */
    getBookingById(bookingId: string, userId: string): Promise<{
        passengers: {
            email: string;
            id: string;
            createdAt: Date;
            fullName: string;
            dateOfBirth: Date;
            nationality: string;
            passportNumber: string;
            contactNumber: string;
            bookingId: string;
        }[];
        flight: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            origin: string;
            destination: string;
            flightNumber: string;
            airline: string;
            departureAt: Date;
            arrivalAt: Date;
            fare: import("@prisma/client-runtime-utils").Decimal;
            totalSeats: number;
            availableSeats: number;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma/enums").PaymentStatus;
            stripePaymentIntentId: string;
            bookingId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            paidAt: Date | null;
            refundedAt: Date | null;
        } | null;
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        flightId: string;
        bookingReference: string;
        passengerCount: number;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("../generated/prisma/enums").BookingStatus;
        stripePaymentIntentId: string | null;
    }>;
    /**
     * Get user's bookings
     */
    getUserBookings(userId: string): Promise<({
        passengers: {
            email: string;
            id: string;
            createdAt: Date;
            fullName: string;
            dateOfBirth: Date;
            nationality: string;
            passportNumber: string;
            contactNumber: string;
            bookingId: string;
        }[];
        flight: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            origin: string;
            destination: string;
            flightNumber: string;
            airline: string;
            departureAt: Date;
            arrivalAt: Date;
            fare: import("@prisma/client-runtime-utils").Decimal;
            totalSeats: number;
            availableSeats: number;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma/enums").PaymentStatus;
            stripePaymentIntentId: string;
            bookingId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            paidAt: Date | null;
            refundedAt: Date | null;
        } | null;
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        flightId: string;
        bookingReference: string;
        passengerCount: number;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("../generated/prisma/enums").BookingStatus;
        stripePaymentIntentId: string | null;
    })[]>;
}
export declare const bookingService: BookingService;
export {};
//# sourceMappingURL=booking.service.d.ts.map