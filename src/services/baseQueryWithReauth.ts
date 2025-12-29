import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include", // send cookies
});
const getErrorStatus = (error: any): number | null => {
  if (!error) return null;

  // Normal JSON error → status exists
  if (typeof error.status === "number") {
    return error.status;
  }

  // Parsing error → originalStatus exists
  if (error.status === "PARSING_ERROR" && "originalStatus" in error) {
    return error.originalStatus;
  }

  return null;
};

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const errorStatus = getErrorStatus(result.error);

  if (errorStatus === 401) {
    console.log("401 detected → Refreshing token...");

    const refreshResult = await rawBaseQuery(
      {
        url: "/users/refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );

    const refreshStatus = getErrorStatus(refreshResult.error);

    // If refresh succeeded
    if (refreshResult?.data && !refreshStatus) {
      console.log("Refresh success → Retrying API call...");
      return await rawBaseQuery(args, api, extraOptions);
    }

    console.log("Refresh failed → logout");
    return result;
  }

  return result;
};

export default baseQueryWithReauth;
