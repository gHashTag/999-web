"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Я был в шоке от качества и скорости обработки моих фотографий. НейроФото превратили мои снимки в настоящие шедевры, добавив уникальный и современный стиль. Теперь я могу гордиться своими фотографиями и делиться ими с друзьями.",
    name: "Анатолий",
    title: "Владелец кафе XIII",
  },
  {
    quote:
      "Я всегда боялся, что мои фотографии не будут выглядеть профессионально, но НейроФото доказали, что я ошибался. Они создали для меня уникальные и красивые изображения, которые я теперь могу использовать в своих проектах. Спасибо, НейроФото!",
    name: "Мария",
    title: "",
  },
  {
    quote:
      "Я всегда боялся, что мои фотографии не будут выглядеть профессионально, но НейроФото доказали, что я ошибался. Они создали для меня уникальные и красивые изображения, которые я теперь могу использовать в своих проектах. Спасибо, НейроФото!",
    name: "Мария",
    title: "Фотограф",
  },
  {
    quote:
      "Я всегда боялся, что мои фотографии не будут выглядеть профессионально, но НейроФото доказали, что я ошибался. Они создали для меня уникальные и красивые изображения, которые я теперь могу использовать в своих проектах. Спасибо, НейроФото!",
    name: "Мария",
    title: "Фотограф",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];
