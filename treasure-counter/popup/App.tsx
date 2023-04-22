
import {
  extendTheme,
  ChakraProvider,
  Center, Card,
  CardHeader, CardBody,
} from '@chakra-ui/react'
import { TreasureItems } from './history'
import { Help } from './help'
import { FatalError } from './playerInterface'


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
