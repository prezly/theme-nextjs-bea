module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, {isServer}) => {
    // @TODO: figure out why we need fs
    // if (!isServer) {
    //   config.node = { fs: 'empty' }
    // }

    return config
  }
}
