
import {
  extendTheme,
  ChakraProvider,
  Center, Card,
  CardHeader, CardBody,
} from '@chakra-ui/react'
import { TreasureItems } from './TreasureItems'
import { Help } from './help'
import { FatalError } from './FatalError'

const theme = extendTheme({
  fonts: {
    heading: `'Microsoft YaHei', sans-serif`,
    body: `'Microsoft YaHe', sans-serif`,
  },
})

export const App = () => (
  <ChakraProvider theme={theme}>
    <Center>
      <Card width='80%'>
        <CardHeader>
          <Help />
        </CardHeader>
        <CardBody>
          <FatalError />
          <TreasureItems />
        </CardBody>
      </Card>
    </Center>
  </ChakraProvider >
)
