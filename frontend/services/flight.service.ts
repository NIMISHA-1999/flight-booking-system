import api from "@/lib/axios";

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
}

export interface FlightSearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  passengers?: string;
}

/**
 * Get all flights
 */
export async function getAllFlights(): Promise<Flight[]> {
  const response = await api.get("/flights");

  const result = response.data;

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch flights"
    );
  }

  return result.data;
}

/**
 * Search flights
 */
export async function searchFlights(
  params: FlightSearchParams
): Promise<Flight[]> {
  const response = await api.get("/flights/search", {
    params,
  });

  const result = response.data;

  if (!result.success) {
    throw new Error(
      result.message || "Failed to search flights"
    );
  }

  return result.data;
}


export async function getFlightById(
  id: string
): Promise<Flight> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/flights/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch flight");
  }

  const result = await response.json();

  return result.data;
}