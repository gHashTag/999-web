"use client";
import { CardStack } from "../ui/card-stack";
import { cn } from "@/lib/utils";
import { BackgroundGradientDemo } from "./вackground-gradient-demo";
export function CardStackDemo() {
  return (
    <div className="flex flex-col items-center justify-center">
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4">
  Отзывы клиентов
</h2>
    <div className="h-[40rem] flex items-center justify-center w-full">
        
      <CardStack items={CARDS} />
    </div>
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4">Цена</h2>
    <div className="h-[50rem] flex items-center justify-center w-full">
        <BackgroundGradientDemo />
    </div>
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div>
   
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
    </div>
  );
};

const CARDS = [
    {
      id: 0,
      name: "Анна Иванова",
      designation: "Довольный клиент",
      content: (
        <p>
          Этот сервис просто потрясающий! <Highlight>Мои фотографии</Highlight> превратились в настоящие произведения искусства. Рекомендую всем!
        </p>
      ),
    },
    {
      id: 1,
      name: "Иван Петров",
      designation: "Пользователь",
      content: (
        <p>
          Я был приятно удивлен качеством и скоростью работы. <Highlight>Мои аватары</Highlight> выглядят невероятно стильно и современно.
        </p>
      ),
    },
    {
      id: 2,
      name: "Екатерина Смирнова",
      designation: "Клиент",
      content: (
        <p>
          Отличный сервис! <Highlight>Индивидуальный подход</Highlight> и внимание к деталям сделали мой опыт незабываемым. Спасибо!
        </p>
      ),
    },
  ];
