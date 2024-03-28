import { useState, useEffect } from "react";

// Определение размеров экрана для планшетов и телефонов
const tabletBreakpoint = 768; // пиксели, например, для iPad
const phoneBreakpoint = 480; // пиксели, например, для iPhone

function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth < phoneBreakpoint);
      setIsTablet(
        screenWidth >= phoneBreakpoint && screenWidth < tabletBreakpoint
      );
    };

    // Вызов при монтировании компонента
    handleResize();

    // Обработчик изменения размера окна
    window.addEventListener("resize", handleResize);

    // Очистка обработчика
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isTablet };
}

export default useDeviceDetect;
