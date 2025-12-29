"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselAuto() {
  const plugin = React.useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
    })
  );

  const slides = [
    {
      src: "/CarsoulImage/Untitled design.png",
      caption: "Gear Up. Play Hard. Win Big.",
    },
    {
      src: "/CarsoulImage/cricket.png",
      caption: "Your Game Starts Here.",
    },
    {
      src: "/CarsoulImage/photo-1579758629938-03607ccdbaba.avif",
      caption: "Train Smarter. Perform Better.",
    },
    {
      src: "/CarsoulImage/running.png",
      caption: "Unleash Your Inner Athlete.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full rounded-3xl overflow-hidden shadow-2xl"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-52 sm:h-80 md:h-[480px] overflow-hidden">
                <Image
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-bold text-center px-4 drop-shadow-md">
                    {slide.caption}
                  </h2>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md" />
        <CarouselNext className="right-4 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md" />
      </Carousel>
    </div>
  );
}
