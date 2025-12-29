import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include", // optional if also using cookies
  prepareHeaders: (headers) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const getErrorStatus = (error: any): number | null => {
  if (!error) return null;
  return typeof error.status === "number"
    ? error.status
    : error.status === "PARSING_ERROR" && "originalStatus" in error
    ? error.originalStatus
    : null;
};
const getTokensFromLocalStorage = () => {
  if (typeof window === "undefined") return {};
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: "users/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // retry original request with new token
      return rawBaseQuery(args, api, extraOptions);
    }

    return { error: { status: 401, data: "Session expired" } };
  }

  return result;
};


export default baseQueryWithReauth;
