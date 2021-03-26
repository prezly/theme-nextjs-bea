module.exports = {
  webpack: (config, {isServer}) => {

    if (!isServer) {
      config.node = { fs: 'empty' }
    }

    return config
  }
}
