import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly RefreshToken: "RefreshToken";
    readonly Flight: "Flight";
    readonly Booking: "Booking";
    readonly Passenger: "Passenger";
    readonly Payment: "Payment";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly tokenHash: "tokenHash";
    readonly userId: "userId";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly createdAt: "createdAt";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const FlightScalarFieldEnum: {
    readonly id: "id";
    readonly flightNumber: "flightNumber";
    readonly airline: "airline";
    readonly origin: "origin";
    readonly destination: "destination";
    readonly departureAt: "departureAt";
    readonly arrivalAt: "arrivalAt";
    readonly fare: "fare";
    readonly totalSeats: "totalSeats";
    readonly availableSeats: "availableSeats";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FlightScalarFieldEnum = (typeof FlightScalarFieldEnum)[keyof typeof FlightScalarFieldEnum];
export declare const BookingScalarFieldEnum: {
    readonly id: "id";
    readonly bookingReference: "bookingReference";
    readonly userId: "userId";
    readonly flightId: "flightId";
    readonly passengerCount: "passengerCount";
    readonly totalAmount: "totalAmount";
    readonly status: "status";
    readonly stripePaymentIntentId: "stripePaymentIntentId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum];
export declare const PassengerScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly fullName: "fullName";
    readonly dateOfBirth: "dateOfBirth";
    readonly nationality: "nationality";
    readonly passportNumber: "passportNumber";
    readonly email: "email";
    readonly contactNumber: "contactNumber";
    readonly createdAt: "createdAt";
};
export type PassengerScalarFieldEnum = (typeof PassengerScalarFieldEnum)[keyof typeof PassengerScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly stripePaymentIntentId: "stripePaymentIntentId";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly status: "status";
    readonly paidAt: "paidAt";
    readonly refundedAt: "refundedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map