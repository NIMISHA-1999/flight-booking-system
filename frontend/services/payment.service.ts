import api from "@/lib/axios";

export interface CreateCheckoutResponse {
  success: boolean;
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  bookingId: string,
): Promise<CreateCheckoutResponse> {

  const response =
    await api.post<CreateCheckoutResponse>(
      "/payments/create-checkout-session",
      {
        bookingId,
      },
    );

  return response.data;
}