import React from 'react';

import './App.css';
import { ReactComponent as Logo } from './logo.svg';
import client from "./Client"
// This step is really important

function useSwapPrices() {
  const [swapPrices, setSwapPrices] = React.useState(null)
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

  return swapPrices
}

function App() {
  const swapPrices = useSwapPrices()
  const [apiKey, setApiKey] = React.useState("")
  const [amount, setAmount] = React.useState("0.0044")
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const [available, setAvailable] = React.useState(null)
  const [placeOrderStatus, setPlaceOrderStatus] = React.useState(null)

  const handleLogin = React.useCallback(() => {
    const run = async () => {
      setFailed(false)

      try {
        await client.login(JSON.parse(apiKey))

        const btcBalance = await client.getAccountBalance("usdc")
        setAvailable(btcBalance)
        setReady(true)
      } catch(e){
        console.log(e)
        setFailed(true)
      }
    }
    run()
  }, [apiKey])
  const usdcAmount =  swapPrices != null && parseFloat(amount) * swapPrices.BTC_USDC.buyPrice
  const suficientFunds = available != null && swapPrices != null && parseFloat(available.available.amount) > usdcAmount

  return (
    <div className="App">
      <Logo style={{width: 200, height: 100}} />
      <h1>Swap service example</h1>
      {swapPrices && <p>Current price: {swapPrices.BTC_USDC.buyPrice} USDC / BTC</p>}
      <p>Step 1: Paste in API key: </p>
      <div className="nash-textarea-wrapper">
        <textarea className="nash-input"rows="6" onChange={event => setApiKey(event.target.value)} value={apiKey} />
      </div>
      <br/>
      <button className="nash-button fullwidth" onClick={handleLogin} disabled={apiKey.length === 0}>Login</button>
      {failed && <p>Failed to login!</p>}
      <br />
      <br />
        {swapPrices != null && ready && <>
          <p>Step 2: Choose amount to swap</p>
          {available && <>
            <hr />
            <p>USDC balance:</p>
            <p>Available in trading contract: {available.available.amount} UDSC</p>
            <p>Wallet: {available.personal.amount} UDSC</p>
            <p>In orders: {available.inOrders.amount} UDSC</p>
            <p>Pending: {available.pending.amount} UDSC</p>
            <hr />
          </>}
          <p>
            Amount to sell:
          </p>
          <div className="nash-textarea-wrapper">
            <input className="nash-input" type="text" value={amount} onChange={e => setAmount(e.target.value)} /> BTC
          </div>
          <br />
          <button disabled={!suficientFunds || usdcAmount < 5} className="nash-button fullwidth" onClick={async () => {
              setPlaceOrderStatus("")
              if (!swapPrices) {
                return
              }
              try {
                await client.placeLimitOrder(
                  true,
                  {amount: amount, currency: "btc"},
                  "BUY",
                  "GOOD_TIL_CANCELLED",
                  {amount: swapPrices.BTC_USDC.buyPrice.toString(), currencyA: "usdc", currencyB: "btc"},
                  "btc_usdc"
                )
              } catch(e){
                setPlaceOrderStatus("Order placed")
              }
          }}>
            Swap {amount} BTC for {parseFloat(amount) * swapPrices.BTC_USDC.buyPrice} USDC
          </button>
          <p>{placeOrderStatus}</p>
          {usdcAmount < 5 && <p>Cannot swap: Minimum amount must be larger than 5 usdc</p>}
          {!suficientFunds && <p>Cannot swap: Insifucient funds available in trading contract trading contract</p>}
        </>
      }
    </div>
  );
}

export default App;
