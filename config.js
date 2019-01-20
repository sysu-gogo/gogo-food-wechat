module.exports = {
  restaurant_name: '为食喵',
  server: {
    build: {
      server_name: 'food.micblo.com',
      schema: 'https'
    },
    dev: {
      server_name: '192.168.10.105:7001',
      schema: 'http'
    }
  },
  mode: 'dev'
};