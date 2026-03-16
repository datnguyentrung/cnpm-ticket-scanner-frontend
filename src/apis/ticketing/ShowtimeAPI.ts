import axiosInstance from "@/apis/axiosInstance";

export const ShowtimeAPI = {
  getShowtimesByDate: async (date: string) => {
    const response = await axiosInstance.get(`/showtimes/filter`, {
      params: { date },
    });
    return response.data;
  },
};
