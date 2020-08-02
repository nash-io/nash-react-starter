
import {
  Client,
  EnvironmentConfiguration
} from '@neon-exchange/api-client-typescript'
import {
  configurePoolSettings
} from '@neon-exchange/nash-protocol'
// This step is really important
configurePoolSettings(10)

const client = new Client({
    ...EnvironmentConfiguration.production,
  host: "localhost:3000",
  isLocal: true
})

export default client