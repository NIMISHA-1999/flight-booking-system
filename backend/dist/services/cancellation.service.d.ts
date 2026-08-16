export declare class CancellationService {
    cancelBooking(bookingId: string, userId: string, isAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
        booking: {
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
        };
    }>;
}
export declare const cancellationService: CancellationService;
//# sourceMappingURL=cancellation.service.d.ts.map