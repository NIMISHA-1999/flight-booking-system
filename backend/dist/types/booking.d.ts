export interface CreatePassengerInput {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    email: string;
    contactNumber: string;
}
export interface CreateBookingInput {
    flightId: string;
    passengers: CreatePassengerInput[];
}
//# sourceMappingURL=booking.d.ts.map