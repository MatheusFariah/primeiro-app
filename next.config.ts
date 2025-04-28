/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // expose these vars to the browser bundle
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

module.exports = nextConfig;
