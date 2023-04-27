import { Box, Heading, Stack, StackDivider, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { preloadImages } from "./perloadImages";
import { mailbox } from "./playerInterface";
import { ErrorRecord, Message, TreasureRecord } from "../plugin";
import axios from 'axios'

let cachedImages = preloadImages

export const iconUrl = 'https://aigisapi.pigtv.moe/static/ico/0'
function getImageUrl(idx: number): string {
    if (idx >= 1000 && idx < 2000) {
        return `${iconUrl}/_${idx}.png`
    } else if (idx - 1000000 < 2000 && idx - 1000000 >= 1000) {
        idx = idx - 1000000
    }
    return `${iconUrl}/${idx}.png`
}

async function downloadAllImages(treasureIds: Array<number>): Promise<void[]> {
    return Promise.all(treasureIds.map(async idx => {
        if (!cachedImages[idx]) {
            let url = getImageUrl(idx)
            try {
                let res = await axios.get(url, { responseType: 'arraybuffer' })
                if (res.status == 200) {
                    let base64 = Buffer.from(res.data, 'binary').toString('base64')
                    cachedImages[idx] = base64
                }
            } catch (err) {
                // omit errors
            }
        }
    }))
}


function getImage(idx: number) {
    if (cachedImages[idx]) {
        return `data:image/png;base64,${cachedImages[idx]}`
    } else {
        return undefined
    }
}

function getIconDesc(idx: number) {
    switch (idx) {
        case 3001: return '收集物×1'
        case 3002: return '收集物×3'
        case 3003: return '收集物×5'
        case 23203: return '勋章×3'
        case 23205: return '勋章×5'
        default: return `${idx >= 1000 && idx < 2000 ? '_' : ''}${idx}.png`
    }
}


export function TreasureItems() {
    const [history, setHistory] = useState(new Array<TreasureRecord | ErrorRecord>)
    useEffect(() => {
        mailbox.listen('TreasureItems', msg => {
            switch (msg.kind) {
                case 'record':
                    downloadAllImages((msg.data as TreasureRecord).treasures
                        .map(t => t.idx))
                        .finally(() => setHistory(history => [msg.data as TreasureRecord | ErrorRecord, ...history]))
                    break;
                // fallthrough intentionally
                case 'err-record':
                    setHistory([msg.data as TreasureRecord | ErrorRecord, ...history])
                    break;
                default: break;
            }
        })
        mailbox.send({ kind: 'get-history', data: null }, (msg: Message) => {
            if (msg.kind = 'history') {
                downloadAllImages(
                    Array.from(
                        new Set( // remove duplicates
                            ((msg.data as Array<TreasureRecord | ErrorRecord>)
                                .filter(r => (r as TreasureRecord).treasures != null)
                                .map(r => (r as TreasureRecord).treasures.map(t => t.idx)))
                                .flat()
                        )
                    )
                ).finally(() => setHistory(msg.data as Array<TreasureRecord | ErrorRecord>))
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
                            src={getImage(treasure.idx)}>
                        </Image>
                    })}
                </Stack>}
        </Box >
    )
    return <Stack divider={<StackDivider />} spacing='4'>{items}</Stack>

}
