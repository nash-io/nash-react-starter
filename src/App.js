import React from 'react';
import {
  Client,
  EnvironmentConfiguration
} from '@neon-exchange/api-client-typescript'
import {
  configurePoolSettings
} from '@neon-exchange/nash-protocol'
import './App.css';

// This step is really important
configurePoolSettings(10)

const client = new Client({
    ...EnvironmentConfiguration.production,
  host: "localhost:3000",
  isLocal: true
})

function App() {
  const [swapPrices, setSwapPrices] = React.useState(null)
  const [apiKey, setApiKey] = React.useState("")
  const [amount, setAmount] = React.useState("0.0044")
  const [ready, setReady] = React.useState(false)
  const handleLogin = React.useCallback(() => {
    client.login(JSON.parse(apiKey)).then(() => {
      setReady(true)
    })
  }, [apiKey])

  React.useEffect(() => {
    const run = async () => {
      try {
        const swapPrices = await fetch('swap-prices')
        const data = await swapPrices.json()
        setSwapPrices(data)
      } catch(e) {
        console.log(e)
      }
    }
    run()
    setInterval(run, 15000)
  }, [])

  return (
    <div className="App">
      <p>Paste in API key: </p>
      <textarea cols="200" rows="6" onChange={event => setApiKey(event.target.value)} value={apiKey} /><br/>
      <button onClick={handleLogin} disabled={apiKey.length === 0}>Login</button>
      <br />
        {ready && <>
          <p>User logged in!</p>
          <p>
            Amount to sell: <input type="text" value={amount} onChange={e => setAmount(e.target.value)} /> BTC
          </p>
          <button onClick={() => {
              if (!swapPrices) {
                return
              }
              client.placeLimitOrder(
                true,
                {amount: amount, currency: "btc"},
                "BUY",
                "GOOD_TIL_CANCELLED",
                {amount: swapPrices.BTC_USDC.buyPrice.toString(), currencyA: "usdc", currencyB: "btc"},
                "btc_usdc"
              )
          }}>
            Swap {amount} BTC for {parseFloat(amount) * swapPrices.BTC_USDC.buyPrice} USDC
          </button>
        </>
      }
      {swapPrices && <p>Current price: {swapPrices.BTC_USDC.buyPrice} USDC / BTC</p>}
    </div>
  );
}

export default App;
