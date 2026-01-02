"use client";

import { Activity, useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  ShoppingCart,
  MapPin,
  Edit,
  ArrowLeft,
  ShoppingBag,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Address from "./Address/Address";
import {
  useGetAddressByIdQuery,
  useGetUserQuery,
  useLogoutMutation,
  useGetSubCategoriesQuery,
  useGetCartItemsQuery,
  apiSlice,
} from "@/services/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

/* -------------------- DEBOUNCE HOOK -------------------- */
function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function Navbar() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddressContainerOpen, setIsAddressContainerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { addressId } = useSelector((state: any) => state.stateManage);

  /* -------------------- ADDRESS -------------------- */
  useEffect(() => {
    const id = localStorage.getItem("selectedAddressId");
    setSelectedAddressId(id);
  }, []);

  const {
    data: addressById,
    isLoading: isAddressByIdLoading,
    isError: isAddressByIdError,
    refetch: refetchAddressById,
  } = useGetAddressByIdQuery(addressId || selectedAddressId, {
    skip: !addressId && !selectedAddressId,
  });
  const { data: cartData } = useGetCartItemsQuery(undefined, {
    skip: !isLoggedIn, // ✅ DO NOT FETCH CART WHEN LOGGED OUT
  });
  const totalCartItems = Array.isArray(cartData?.data)
    ? cartData.data.reduce(
        (total: any, item: any) => total + (item.quantity || 0),
        0
      )
    : 0;

  console.log(cartData?.data?.length);
  /* -------------------- AUTH -------------------- */
  const { data: user } = useGetUserQuery();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (user?.loggedIn) {
      localStorage.setItem("loggedIn", "true");

      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("loggedIn");
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleUserLogout = async () => {
    try {
      await logout().unwrap();

      localStorage.removeItem("user");
      localStorage.removeItem("loggedIn");

      // 🔥 CLEAR RTK QUERY CACHE (THIS FIXES CART ISSUE)
      dispatch(apiSlice.util.resetApiState());

      setIsLoggedIn(false);

      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  /* -------------------- SEARCH LOGIC -------------------- */
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: searchData, isLoading: isSearching } = useGetSubCategoriesQuery(
    { subCategoryName: debouncedSearch },
    { skip: !debouncedSearch }
  );
  console.log(searchData?.data?.subCategories?.[0]?.image?.[0]?.url);

  const filteredSuggestions = searchData?.data.subCategories || [];

  /* -------------------- CLOSE ON OUTSIDE CLICK -------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- NAVIGATION -------------------- */
  const goToSubCategory = (item: any) => {
    const slug = item.subCategoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
    const category = item.category.categoryName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
    router.push(`/store/${category}/${slug}/${item._id}`);
    setSearchQuery("");
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      {/* Address Overlay */}
      <Activity mode={isAddressContainerOpen ? "visible" : "hidden"}>
        <Address setIsAddressContainerOpen={setIsAddressContainerOpen} />
      </Activity>

      {/* NAVBAR DESKTOP */}
      <nav className="md:sticky relative top-0 z-50 w-full md:border-b-2 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-1 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                 <Image src="/image/logo.png" alt="Logo" width={50} height={52} className="bg-white" />
                </div> */}
                <span className="text-2xl font-bold">Dsport</span>
              </Link>
            </div>

            {/* Search */}
            <div ref={searchRef} className="flex items-center gap-2 relative">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(e.target.value.length > 0);
                }}
                className="lg:w-130 md:w-80 border-2 border-gray-400 hidden md:block"
              />

              {isSearchOpen && (
                <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 hidden md:block">
                  {isSearching ? (
                    <div className="p-3 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-4 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ) : filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item: any) => (
                      <div
                        key={item._id}
                        onClick={() => goToSubCategory(item)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                      >
                        {item.image && item.image.length > 0 ? (
                          <div className="w-8 h-8 relative">
                            <Image
                              src={item.image[0].url}
                              alt={item.subCategoryName}
                              fill
                              className="object-cover rounded"
                              sizes="32px"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded" />
                        )}

                        <span>{item.subCategoryName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No results found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="hidden md:block">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <p className="text-sm text-gray-800">Delivery Location</p>
              </div>
              <div className="flex items-center">
                <div className="text-sm font-bold">
                  {isAddressByIdLoading ? (
                    <div className="h-4 w-24 bg-gray-300 animate-pulse rounded" />
                  ) : isAddressByIdError ? (
                    <span>WestBengal,India</span>
                  ) : addressById?.data ? (
                    <span>
                      {addressById.data.state}, {addressById.data.pincode}
                    </span>
                  ) : (
                    <span>No address selected</span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddressContainerOpen(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div>
              <div className="flex items-center gap-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 rounded-full px-5"
                    >
                      <User size={18} />
                      <span className="font-medium">Dsport</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-xl border bg-white p-2 shadow-xl"
                  >
                    {/* USER INFO */}
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {isLoggedIn ? user?.user?.fullname : "Guest User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isLoggedIn
                          ? "Welcome back 👋"
                          : "Login to access your account"}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    {/* ORDERS */}
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer"
                    >
                      <Link href="/orders">
                        <ShoppingBag size={16} />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* LOGIN / LOGOUT */}
                    {isLoggedIn ? (
                      <DropdownMenuItem
                        onClick={handleUserLogout}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 cursor-pointer focus:text-red-500"
                      >
                        <LogOut size={16} />
                        Logout
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer"
                      >
                        <Link href="/auth/login">
                          <LogIn size={16} />
                          Login
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />

                    {totalCartItems > 0 && isLoggedIn && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {totalCartItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH (unchanged UI) */}
      <div className="container mx-auto px-4 md:hidden sticky top-0 bg-white z-50">
        <div
          className="flex items-center gap-2"
          onClick={() => setIsMobileSearchOpen(true)}
        >
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full my-2 py-5 border-2 border-gray-400"
          />
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center p-3 border-b shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery("");
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Input
              type="search"
              autoFocus
              placeholder="Search for sports gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 flex-1 border-none focus-visible:ring-0"
            />
          </div>

          <div className="p-4 overflow-y-auto">
            {isSearching ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item: any) => (
                <div
                  key={item._id}
                  onClick={() => goToSubCategory(item)}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  {item.image && item.image.length > 0 ? (
                    <div className="w-8 h-8 relative">
                      <Image
                        src={item.image[0].url}
                        alt={item.subCategoryName}
                        fill
                        className="object-cover rounded"
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                  )}

                  <span>{item.subCategoryName}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No results found.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
