"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#DEEFE7]">
      <SliderPrimitive.Range className="absolute h-full bg-[#002333]" />
    </SliderPrimitive.Track>
    
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-[#002333] shadow focus:outline-none focus:ring-1 focus:ring-[#002333]" />
   
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-[#002333] shadow focus:outline-none focus:ring-1 focus:ring-[#002333]" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
