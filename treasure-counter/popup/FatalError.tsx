import { Message, PluginHelper } from '../plugin'
import { Box, Heading, Text, Stack, StackDivider } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { mailbox } from './playerInterface'

export function FatalError() {
    const [errors, setErrors] = useState(new Array<string>)
    useEffect(() => {
        mailbox.listen(msg => {
            switch (msg.kind) {
                case 'fatal-error':
                    setErrors([...errors, msg.data as string])
                    break;
                case 'fatal-error-list':
                    setErrors(msg.data as Array<string>)
                    break;
            }
        })
    }, [])
    const items = errors.map((err, idx) =>
        <Text fontSize='sm' color='red' key={`fataError-${idx}`}>
            {err}
        </Text>
    )
    return errors.length > 0 ? <Box p={2} borderWidth='1px' bg='#fccbc5'>
        <Heading size='m' textTransform='uppercase' color='red'>
            因为以下错误，插件很可能无法正确工作
        </Heading>
        <Stack divider={<StackDivider />} spacing='4'>
            {items}
        </Stack >
    </Box> : null

}
