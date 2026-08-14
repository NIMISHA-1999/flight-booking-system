export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const BookingStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly SUCCEEDED: "SUCCEEDED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map