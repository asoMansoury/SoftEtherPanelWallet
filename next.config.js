const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  // experimental: {
  //   esmExternals: false
  //   // jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  // },
  distDir: "_next",
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID;
    } else {
      return `${new Date().getTime()}`;
    }
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })


    return config
  }
}
