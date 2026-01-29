import axiosInstance from "./axiosInstance";

export const callApi = async <T>(
  api: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
  data?: any
): Promise<T> => {
  try {
    const res = await axiosInstance({
      url: api,
      method,
      data,
    });

    return res.data as T;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
