interface SearchFlightsParams {
    origin?: string;
    destination?: string;
    date?: string;
    passengers?: number;
}
export declare class FlightService {
    searchFlights(params: SearchFlightsParams): Promise<{
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
    }[]>;
    getFlightById(id: string): Promise<{
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
    }>;
    getAllFlights(): Promise<{
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
    }[]>;
}
declare const _default: FlightService;
export default _default;
//# sourceMappingURL=flight.service.d.ts.map