"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { IconAppWindow } from "@tabler/icons-react";
import Image from "next/image";

export function BackgroundGradientDemo() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/hzbbu9s1p0zshylj9ur0.jpg`}
          alt="jordans"
          height="400"
          width="400"
          className="object-contain"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
        Пакет "Инфлюенсер"
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
            - Настройка ИИ под твой стиль<br/>
            - 10 уникальных аватаров в высоком качестве<br/>
            - Доступ к телеграм-боту для создания 1000 вариаций<br/>
        </p>
        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span>Купить </span>
          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
            10 000 ₽
          </span>
        </button>
      </BackgroundGradient>
    </div>
  );
}
