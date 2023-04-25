import { Box, Heading, Stack, StackDivider, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { preloadImages } from "./perloadImages";
import { mailbox } from "./playerInterface";
import { ErrorRecord, Message, TreasureRecord } from "../plugin";



export const iconUrl = 'https://aigisapi.pigtv.moe/static/ico/0'
function getImageSrc(idx: number): string {
    if (preloadImages[idx]) {
        return `data:image/png;base64,${preloadImages[idx]}`
    } else {
        return `${iconUrl}/${idx >= 1000 && idx < 2000 ? '_' : ''}${idx}.png`
    }
}

function getIconDesc(idx: number) {
    switch (idx) {
        case 3001: return '收集物×1'
        case 3002: return '收集物×3'
        case 3003: return '收集物×5'
        default: return `${idx >= 1000 && idx < 2000 ? '_' : ''}${idx}.png`
    }
}


export function TreasureItems() {
    const [history, setHistory] = useState(new Array<TreasureRecord | ErrorRecord>)
    useEffect(() => {
        mailbox.listen(msg => {
            switch (msg.kind) {
                case 'record':
                case 'err-record':
                    setHistory([msg.data as TreasureRecord | ErrorRecord, ...history])
                    break;
                default: break;
            }
        })
        mailbox.send({ kind: 'get-history', data: null }, (msg: Message) => {
            if (msg.kind = 'history') {
                setHistory(msg.data as Array<TreasureRecord | ErrorRecord>)
            }
        })
    }, [])

    const items = history.map((record: TreasureRecord | ErrorRecord) =>
        <Box p={2} key={record.timestamp} borderWidth='1px'>
            <Heading size='m' textTransform='uppercase'>{record.timestamp}</Heading>
            {(record as ErrorRecord).error ?
                <Text fontSize='sm' color='tomato'>
                    {(record as ErrorRecord).error}
                </Text> :
                <Stack direction={['column', 'row']}>
                    {(record as TreasureRecord).treasures.map((treasure, idx) => {
                        return <Image alt={getIconDesc(treasure.idx)} key={`${record.timestamp}-${idx}`}
                            src={getImageSrc(treasure.idx)}>
                        </Image>
                    })}
                </Stack>}
        </Box >
    )
    return <Stack divider={<StackDivider />} spacing='4'>{items}</Stack>

}
