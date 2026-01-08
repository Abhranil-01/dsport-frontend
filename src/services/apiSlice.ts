import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQueryWithReauth";


interface GetSubCategoriesArg {
  categoryId: string;
}

interface GetProductsArg {
  subcategoryId: string;
}

interface GetSingleProduct {
  id: string;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Cart",
    "Address",
    "Order",
    "Review",
    "Category",
    "Product",
    "Subcategory",
  ],

  endpoints: (builder) => ({
    registerUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: "users/register",
        method: "POST",
        body: userData,
      }),
    }),

    resendOtp: builder.mutation<any, any>({
      query: ({ email, purpose }) => ({
        url: "users/resend-otp",
        method: "POST",
        body: { email, purpose },
      }),
    }),

    userLogin: builder.mutation<any, any>({
      query: (loginData) => ({
        url: "users/login",
        method: "POST",
        body: loginData,
      }),
    }),

    userOtpVerification: builder.mutation<any, any>({
      query: (otpLoginData) => ({
        url: "users/userotpverification",
        method: "POST",
        body: otpLoginData,
      }),
    }),

    getUser: builder.query<any, void>({
      query: () => ({
        url: "users/getuser",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Cart", "Order", "Address", "Review"],
    }),

    getCategories: builder.query<any, void>({
      query: () => ({
        url: "/get-categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<any, string>({
      query: (id) => ({
        url: `/get-category/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    getSubCategories: builder.query<
      any,
      { categoryId?: string; subCategoryName?: string }
    >({
      query: ({ categoryId, subCategoryName }) => {
        const params = new URLSearchParams();

        if (subCategoryName) params.append("subCategoryName", subCategoryName);

        const url = categoryId
          ? `/get-subcategories/${categoryId}?${params.toString()}`
          : `/get-subcategories?${params.toString()}`;

        return { url, method: "GET" };
      },

      providesTags: (result, error, arg) => [
        { type: "Subcategory", id: arg.categoryId ?? "LIST" },
      ],
    }),

    getAllProducts: builder.query<any, GetProductsArg>({
      query: ({ subcategoryId }) => ({
        url: `/get-products/${subcategoryId}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getAllProductsColorWise: builder.query<
      any,
      {
        subcategoryId: string;
        minPrice?: number;
        maxPrice?: number;
        size?: string;
        color?: string;
        gender?: string;
        rating?: string; // "4,3,2"
        noRating?: boolean; // true | false
        sortBy?: string;
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: ({ subcategoryId, ...params }) => {
        const cleanedParams: Record<string, any> = {};

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            cleanedParams[key] = key === "noRating" ? String(value) : value;
          }
        });

        return {
          url: `/get-colorwiseitems/${subcategoryId}`,
          method: "GET",
          params: cleanedParams,
        };
      },

      providesTags:["Product"],
    }),

    getSingleProduct: builder.query<any, GetSingleProduct>({
      query: ({ id }) => ({
        url: `/single-product/${id}`,
        method: "GET",
      }),
    }),

    getSingleColorWiseProduct: builder.query<any, GetSingleProduct>({
      query: ({ id }) => ({
        url: `/get-singlecolorwiseitem/${id}`,
        method: "GET",
      }),
    }),
    addItemToCart: builder.mutation<any, any>({
      query: (itemData) => ({
        url: "cart/add-to-cart",
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeItemFromCart: builder.mutation<any, string>({
      query: (id) => ({
        url: `cart/delete-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation<any, any>({
      query: ({ cartUpdateData, id }) => ({
        url: `cart/update-cart/${id}`,
        method: "PUT",
        body: cartUpdateData,
      }),
      invalidatesTags: ["Cart"],
    }),
    getCartItems: builder.query<any, void>({
      query: () => ({
        url: "cart/get-cart-items",
        method: "GET",
      }),
      providesTags: ["Cart", "Order", "User"],
    }),
    getCharges: builder.query<any, void>({
      query: () => ({
        url: "charges/charges",
        method: "GET",
      }),
      providesTags: ["Cart", "Order"],
    }),
    addAddress: builder.mutation<any, any>({
      query: (addressData) => ({
        url: "address/add-address",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation<any, string>({
      query: (addressId) => ({
        url: `address/delete-address/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    getAllAddress: builder.query<any, void>({
      query: () => ({
        url: "address/get-all-address",
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
    updateAddress: builder.mutation<any, any>({
      query: ({ addressData, id }) => ({
        url: `address/update-address/${id}`,
        method: "PUT",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),
    getAddressById: builder.query<any, string>({
      query: (id) => ({
        url: `address/get-addressbyid/${id}`,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
    createOrderCOD: builder.mutation<any, any>({
      query: (orderData: any) => ({
        url: "order/create-order-cod",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    createOrderOnline: builder.mutation<any, any>({
      query: (orderData: any) => ({
        url: "order/create-order-online",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    createRazorpayPayment: builder.mutation<any, any>({
      query: (totalAmount: any) => ({
        url: "order/create-razorpay-payment",
        method: "POST",
        body: totalAmount,
      }),
      invalidatesTags: ["Order"],
    }),
    verifyPayment: builder.mutation<any, any>({
      query: (paymentVerificationData: any) => ({
        url: "order/verify-payment",
        method: "POST",
        body: paymentVerificationData,
      }),
      invalidatesTags: ["Order"],
    }),
    getAllOrders: builder.query<any, void>({
      query: () => ({
        url: "order/get-all-orders",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Order", id: "LIST" },
              ...result.data.map((order: any) => ({
                type: "Order",
                id: order._id,
              })),
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

 getOrderById: builder.query<any, string>({
  query: (id) => ({
    url: `order/get-order-details/${id}`,
    method: "GET",
  }),
  providesTags: (result, error, id) => [
    { type: "Order", id },   // 🔥 THIS enables live refetch
    { type: "Review", id },  // optional
  ],
}),

    cancleOrder: builder.mutation<any, { orderId: string }>({
      query: (data) => ({
        url: "order/cancel-order",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    createReview: builder.mutation<any, any>({
      query: (reviewData) => ({
        url: "/create-review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Order"],
    }),
    updateReview: builder.mutation<any, any>({
      query: ({ id, reviewData }) => ({
        url: `/update-review/${id}`,
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: ["Order"],
    }),
    getReviewByOrderId: builder.query<any, void>({
      query: (orderItemId) => ({
        url: "/single-review",
        method: "GET",
        body: orderItemId,
      }),
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetAllProductsQuery,
  useGetAllProductsColorWiseQuery,
  useGetSingleProductQuery,
  useGetSingleColorWiseProductQuery,
  useRegisterUserMutation,
  useGetUserQuery,
  useResendOtpMutation,
  useUserLoginMutation,
  useUserOtpVerificationMutation,
  useLogoutMutation,
  useAddItemToCartMutation,
  useGetCartItemsQuery,
  useUpdateCartMutation,
  useRemoveItemFromCartMutation,
  useAddAddressMutation,
  useGetAllAddressQuery,
  useUpdateAddressMutation,
  useGetAddressByIdQuery,
  useDeleteAddressMutation,
  useCreateOrderCODMutation,
  useCreateOrderOnlineMutation,
  useCreateRazorpayPaymentMutation,
  useVerifyPaymentMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetChargesQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useGetReviewByOrderIdQuery,
  useCancleOrderMutation,
  useGetCategoryByIdQuery,
} = apiSlice;
