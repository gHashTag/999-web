"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "Загрузите фото",
    description:
      "Загрузите 10-20 фотографии с вашим лицом, на которых мы сможем создать ваш уникальный цифровой образ.",
    content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white text-4xl">
        ШАГ 1
      </div>
    ),
  },
  {
    title: "Доверьтесь магии ИИ",
    description:
      "Наш ИИ создаст ваш уникальный цифровой образ, который будет отражать ваш стиль и индивидуальность.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--blue-500),var(--purple-500))] flex items-center justify-center text-white text-4xl">
  ШАГ 2
</div>
      </div>
    ),
  },
  {
    title: "Получите результат",
    description:
      "Получите результате возможнось создавать нейрофотографии со своим лицом в телеграм боте. Мы создадим для вас нейрофотографии, которые будут отражать ваш стиль и индивидуальность.",
    content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--pink-500))] flex items-center justify-center text-white text-4xl">
        ШАГ 3
      </div>
    ),
  },
  {
    title: " ",
    description:
      "  ",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
         
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
