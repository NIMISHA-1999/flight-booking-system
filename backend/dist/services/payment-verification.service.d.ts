export declare class PaymentVerificationService {
    verifyCheckoutSession(sessionId: string, userId: string): Promise<{
        success: boolean;
        booking: {
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
        stripeSessionId: string;
        paymentIntentId: string | null;
    }>;
}
export declare const paymentVerificationService: PaymentVerificationService;
//# sourceMappingURL=payment-verification.service.d.ts.map