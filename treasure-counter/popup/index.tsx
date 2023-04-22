import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { App } from "./App"
import recvHelper from "./playerInterface"

const container = document.createElement('div')
container.setAttribute('id', 'root')
document.body.appendChild(container)

const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>,
)

let globalObject = global as any;
globalObject.recvHelper = recvHelper




