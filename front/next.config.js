/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    API_FRONT: process.env.API_FRONT,
    API_BACK: process.env.API_BACK,
  }
}

module.exports = nextConfig
