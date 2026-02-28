import axiosInstance from "@/apis/axiosInstance";
import type {
  TicketDetailResponse,
  UpdateTicketStatusRequest,
} from "@/types/types";
import type { ApiResponse } from '@/types/ApiType';

export const TicketAPI = {
  updateTicketStatus: async (
    ticketCode: string,
    request: UpdateTicketStatusRequest,
  ): Promise<ApiResponse<TicketDetailResponse>> => {
    const response = await axiosInstance.patch(
      `/tickets/${ticketCode}/status`,
      request,
    );
    return response.data;
  },
};
