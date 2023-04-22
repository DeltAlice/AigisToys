import { Box, Heading, Text, Stack, StackDivider } from '@chakra-ui/layout'
import { extendHisotry } from './history'
import { Message, PluginHelper, Record } from '../plugin'
import { useState } from 'react'
import { error } from 'console'


export default function recvHelper(pluginHelper: PluginHelper) {
    pluginHelper.sendMessage({ kind: '@get(history)', data: null }, response => {
        switch (response.kind) {
            case 'history':
                extendHisotry(response.data)
                break
            case 'fataError':
                reportFatalError(response.data)
                break
            default:
                throw error('unreachable!')
        }
    })
    pluginHelper.onMessage(msg => {
        switch (msg.kind) {
            case 'record': extendHisotry([msg.data])
        }
    })

}


let setFataErrors: ((errors: Array<string>) => void) | null = null
function reportFatalError(errors: Array<string>) {
    setFataErrors!(errors)
}

export function FatalError() {
    const [errors, setErrors] = useState(new Array<string>)
    setFataErrors = (errors: Array<string>) => {
        setErrors(errors)
    }

    const items = errors.map((err, idx) =>
        <Text fontSize='sm' color='red' key={`fataError-${idx}`}>
            {err}
        </Text>
    )
    return errors.length > 0 ? <Box p={2} borderWidth='1px'>
        <Heading size='m' textTransform='uppercase' color='red'>
            因为以下错误，插件很可能无法正确工作
        </Heading>
        <Stack divider={<StackDivider />} spacing='4'>
            {items}
        </Stack >
    </Box> : <div></div>

}

