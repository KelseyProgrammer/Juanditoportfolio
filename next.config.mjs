/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Mux poster frames for video clips in the Darkroom
      { protocol: "https", hostname: "image.mux.com" }
    ]
  }
};

export default nextConfig;
