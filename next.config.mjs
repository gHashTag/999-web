/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)?",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Добавляем ваш сайт в разрешённые источники
          {
            key: "Access-Control-Allow-Origin",
            value: "https://dao999nft.com/",
          },
          // Разрешаем определённые методы
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          // Разрешаем заголовки, необходимые для вашего API
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
          // Разрешаем cookies и другие учётные данные
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
  reactStrictMode: false,
  images: {
    domains: [
      "randomuser.me",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
    ],
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
