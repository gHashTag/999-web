import React from "react";
import { Vortex } from "../ui/vortex";
import { Button } from "@/components/ui/moving-border";

export function VortexDemo() {
    const onCreateOrder = () => {
        window.location.href = "https://t.me/neurocalls";
      };
    return (
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[20rem] overflow-hidden">
        <Vortex
          backgroundColor="transparent"
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            {/* Заголовок */}
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            Представь, как твои фотографии превращаются в стильные и современные произведения искусства, подчеркивая твою индивидуальность и выделяя из толпы.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Button onClick={() => onCreateOrder()}>
              Заказать
            </Button>
            {/* <button className="px-4 py-2 text-white">Watch trailer</button> */}
          </div>
        </Vortex>
      </div>
    );
  }
