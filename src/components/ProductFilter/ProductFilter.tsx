"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Star } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { useGetAllProductsColorWiseQuery } from "@/services/apiSlice";

/* ================= TYPES ================= */

interface ProductFilterProps {
  handleClose: () => void;
}

type RatingKey = 1 | 2 | 3 | 4;

/* ================= DEBOUNCE HOOK ================= */

function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/* ================= COMPONENT ================= */

const ProductFilter: React.FC<ProductFilterProps> = ({ handleClose }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInteracted = useRef(false);

  const subcategoryId = params.id as string;

  /* ================= API ================= */

  const { data, isLoading } = useGetAllProductsColorWiseQuery(
    { subcategoryId },
    { skip: !subcategoryId }
  );

  /* ================= META ================= */

const meta = useMemo(() => {
  if (!data?.colorItems?.length) {
    return {
      minPrice: 0,
      maxPrice: 0,
      sizes: [],
      colors: [],
      genders: [],
      showGenderFilter: false,
    };
  }

  const prices: number[] = [];
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const genders = new Set<string>();

  data.colorItems.forEach((item: any) => {
    if (item.color) colors.add(item.color);

    // ✅ ADD ALL genders (including "No")
    if (item.gender) genders.add(item.gender);

    item.sizes?.forEach((s: any) => {
      if (s.offerPrice) prices.push(s.offerPrice);
      if (s.size) sizes.add(s.size);
    });
  });

  // ✅ Check if at least one gender is NOT "No"
  const hasValidGender = Array.from(genders).some(
    (g) => g && g !== "No"
  );

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    sizes: Array.from(sizes),
    colors: Array.from(colors),

    // ✅ Only real genders shown (No removed from UI)
    genders: hasValidGender
      ? Array.from(genders).filter((g) => g !== "No")
      : [],

    // ✅ Final visibility condition
    showGenderFilter: hasValidGender,
  };
}, [data]);


  /* ================= ⭐ RATING COUNTS ================= */

  const ratingCounts = useMemo<
    Record<RatingKey, number> & { noRating: number }
  >(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, noRating: 0 };

    data?.colorItems?.forEach((item: any) => {
      if (!item.totalReviews || item.totalReviews === 0) {
        counts.noRating++;
      } else {
        const r = Math.floor(item.averageRating);
        if (r >= 1) counts[1]++;
        if (r >= 2) counts[2]++;
        if (r >= 3) counts[3]++;
        if (r >= 4) counts[4]++;
      }
    });

    return counts;
  }, [data]);

  /* ================= STATE ================= */

  // UI slider value (instant)
  const [priceRange, setPriceRange] = useState<number[]>([0, 0]);

  // Debounced value (used for URL)
  const debouncedPriceRange = useDebounce(priceRange, 500);

  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get("size")?.split(",") || []
  );

  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get("color")?.split(",") || []
  );

  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchParams.get("gender")?.split(",") || []
  );

  const [selectedRatings, setSelectedRatings] = useState<RatingKey[]>(
    searchParams.get("rating")
      ? (searchParams.get("rating")!
          .split(",")
          .map(Number) as RatingKey[])
      : []
  );

  const [noRating, setNoRating] = useState<boolean>(
    searchParams.get("noRating") === "true"
  );

  /* ================= INIT PRICE ================= */

  useEffect(() => {
    if (!meta.minPrice || !meta.maxPrice) return;

    setPriceRange([
      Number(searchParams.get("minPrice")) || meta.minPrice,
      Number(searchParams.get("maxPrice")) || meta.maxPrice,
    ]);
  }, [meta.minPrice, meta.maxPrice]);

  /* ================= URL SYNC (DEBOUNCED) ================= */

  useEffect(() => {
    if (!hasInteracted.current) return;

    const query = new URLSearchParams();

    const isDefaultPrice =
      debouncedPriceRange[0] === meta.minPrice &&
      debouncedPriceRange[1] === meta.maxPrice;

    if (!isDefaultPrice) {
      query.set("minPrice", String(debouncedPriceRange[0]));
      query.set("maxPrice", String(debouncedPriceRange[1]));
    }

    selectedSizes.length
      ? query.set("size", selectedSizes.join(","))
      : query.delete("size");

    selectedColors.length
      ? query.set("color", selectedColors.join(","))
      : query.delete("color");

    selectedGenders.length
      ? query.set("gender", selectedGenders.join(","))
      : query.delete("gender");

    selectedRatings.length
      ? query.set("rating", selectedRatings.join(","))
      : query.delete("rating");

    noRating
      ? query.set("noRating", "true")
      : query.delete("noRating");

    router.push(`?${query.toString()}`, { scroll: false });
  }, [
    debouncedPriceRange,
    selectedSizes,
    selectedColors,
    selectedGenders,
    selectedRatings,
    noRating,
    meta.minPrice,
    meta.maxPrice,
  ]);

  /* ================= TOGGLES ================= */

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    hasInteracted.current = true;
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const toggleRating = (rating: RatingKey) => {
    hasInteracted.current = true;
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  if (isLoading) return null;

  /* ================= UI ================= */

  return (
    <div className="fixed top-0 w-full h-screen z-999 left-0 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={handleClose} />

      <div className="absolute right-0 lg:w-[35%] md:w-[45%] w-full h-full bg-white border-l flex flex-col z-50">
        <div className="p-4 flex justify-between border-b">
          <h1 className="font-bold text-lg">Product Filters</h1>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* Price */}
          <div>
            <h2 className="font-semibold mb-3">Price Range</h2>
            <Slider
              value={priceRange}
              min={meta.minPrice}
              max={meta.maxPrice}
              step={100}
              onValueChange={(v) => {
                hasInteracted.current = true;
                setPriceRange(v);
              }}
            />
            <div className="flex justify-between text-sm mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>

          {/* Size */}
          <div>
            <h2 className="font-semibold mb-3">Size</h2>
            <div className="flex flex-wrap gap-3">
              {meta.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  onClick={() =>
                    toggleSelection(size, selectedSizes, setSelectedSizes)
                  }
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h2 className="font-semibold mb-3">Color</h2>
            <div className="flex flex-wrap gap-3">
              {meta.colors.map((color) => (
                <Button
                  key={color}
                  variant={
                    selectedColors.includes(color) ? "default" : "outline"
                  }
                  onClick={() =>
                    toggleSelection(color, selectedColors, setSelectedColors)
                  }
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
          {/* Gender */}
{meta.showGenderFilter && (
  <div>
    <h2 className="font-semibold mb-3">Gender</h2>
    <div className="flex flex-wrap gap-3">
      {meta.genders.map((gender) => (
        <Button
          key={gender}
          variant={
            selectedGenders.includes(gender) ? "default" : "outline"
          }
          onClick={() =>
            toggleSelection(gender, selectedGenders, setSelectedGenders)
          }
        >
          {gender}
        </Button>
      ))}
    </div>
  </div>
)}


          {/* ⭐ Rating */}
          <div>
            <h2 className="font-semibold mb-3">Rating</h2>
            <div className="flex gap-2 flex-wrap">
              {[4, 3, 2, 1].map((r) => (
                <Button
                  key={r}
                  variant={
                    selectedRatings.includes(r as RatingKey)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => toggleRating(r as RatingKey)}
                >
                  {r}★ & above ({ratingCounts[r as RatingKey]})
                  <Star className="w-4 h-4 ml-1 fill-yellow-400" />
                </Button>
              ))}

              <Button
                variant={noRating ? "default" : "outline"}
                onClick={() => {
                  hasInteracted.current = true;
                  setNoRating((p) => !p);
                }}
              >
                No Rating ({ratingCounts.noRating})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
