import axios from "axios";

// Backend base URL
const BASE_URL = "http://localhost:3002";

// Common API function (for all APIs)
export const callApi = async <T>(
  api: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
  data?: any
): Promise<T> => {
  try {
    const res = await axios({
      url: BASE_URL + api,
      method,
      data,
    });

    return res.data as T;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
