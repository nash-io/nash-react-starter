const { createProxyMiddleware } = require('http-proxy-middleware');

const PROXY_BACKEND = process.env.PROXY_BACKEND || 'http://localhost:4000'
const PROXY_BTC_EXPLORER_DEV1 = 'https://btc-local-explorer.dev1.nash.io'
const PROXY_BTC_EXPLORER_DEV2 = 'https://btc-local-explorer.dev2.nash.io'
const PROXY_BTC_EXPLORER_DEV3 = 'https://btc-local-explorer.dev3.nash.io'
const PROXY_BTC_EXPLORER_DEV4 = 'https://btc-local-explorer.dev4.nash.io'
const PROXY_BTC_EXPLORER_QA1 = 'https://btc-local-explorer.qa1.nash.io'

const proxyTimeout = 3600000
const cookieDomainRewrite = { '*': '' }
const onProxyRes = (proxyRes, req, res) => {
  const sc = proxyRes.headers['set-cookie']
  if (Array.isArray(sc)) {
    proxyRes.headers['set-cookie'] = sc.map(sc => {
      return sc
        .split(';')
        .filter(v => v.trim().toLowerCase() !== 'secure')
        .join('; ')
    })
  }
}

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/swap-prices', {
      target: "https://swap-prices.nash.io",
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/api/socket', {
      target: PROXY_BACKEND,
      changeOrigin: true,
      ws: true,
      proxyTimeout,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/api', {
      target: PROXY_BACKEND,
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )
  app.use(
    createProxyMiddleware('/nash', {
      target: 'https://nash.io',
      pathRewrite: {
        '^/nash': '',
      },
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/btc-explorer-dev1', {
      target: PROXY_BTC_EXPLORER_DEV1,
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/btc-explorer-dev2', {
      target: PROXY_BTC_EXPLORER_DEV2,
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/btc-explorer-dev3', {
      target: PROXY_BTC_EXPLORER_DEV3,
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/btc-explorer-dev4', {
      target: PROXY_BTC_EXPLORER_DEV4,
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )

  app.use(
    createProxyMiddleware('/btc-explorer-qa1', {
      target: PROXY_BTC_EXPLORER_QA1,
      changeOrigin: true,
      cookieDomainRewrite,
      onProxyRes,
    })
  )
}
