import { Request, Response } from "express";
export declare const getAllBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFlights: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createFlight: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateFlight: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteFlight: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=admin.controller.d.ts.map