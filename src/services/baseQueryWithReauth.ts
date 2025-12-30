import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include", // required if backend uses cookies
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

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Attempt to refresh the token
    const refreshResult: any = await rawBaseQuery(
      {
        url: "users/refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );

    if (refreshResult.data?.accessToken) {
      // Save new access token to localStorage
      localStorage.setItem("accessToken", refreshResult.data.accessToken);

      // Retry original request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Logout user if refresh fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      api.dispatch({ type: "user/logout" });
      return { error: { status: 401, data: "Session expired" } };
    }
  }

  return result;
};

export default baseQueryWithReauth;
