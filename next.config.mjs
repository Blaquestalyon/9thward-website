/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // /_next/static is content-hashed by Next. Everything else revalidates on
  // every visit (ETag), so a redesign never pairs new HTML with stale images.
  async headers() {
    return [
      {
        source: "/:path((?!_next/static|_next/image).*)",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Airtable attachment CDNs
      { protocol: "https", hostname: "dl.airtable.com" },
      { protocol: "https", hostname: "v5.airtableusercontent.com" },
      { protocol: "https", hostname: "v4.airtableusercontent.com" },
      { protocol: "https", hostname: "*.airtableusercontent.com" },
      // Common artist image / cover-art hosts (album art, socials)
      { protocol: "https", hostname: "i.scdn.co" }, // Spotify
      { protocol: "https", hostname: "i1.sndcdn.com" }, // SoundCloud
      { protocol: "https", hostname: "i.ytimg.com" }, // YouTube thumbnails
      { protocol: "https", hostname: "f4.bcbits.com" }, // Bandcamp
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" }, // Apple Music
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
