import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
export declare class BookingController {
    /**
     * POST /api/bookings
     */
    createBooking(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/bookings/:bookingId
     */
    getBooking(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/bookings
     */
    getMyBookings(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const bookingController: BookingController;
//# sourceMappingURL=booking.controller.d.ts.map