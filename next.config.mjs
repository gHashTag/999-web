/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)?',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ]
  },
  reactStrictMode: false,
  output: 'standalone',
  images: {
    domains: [
      'randomuser.me',
      'images.domains',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      't.me',
      'dmrooqbmxdhdyblqzswu.supabase.co',
      'app.delabwallet.com',
    ],
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
}

export default nextConfig
