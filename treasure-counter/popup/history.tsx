import { Box, Heading, Stack, StackDivider, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Record } from '../plugin'
import { preloadImages } from "./perloadImages";

let changeHistoryCallback: ((records: Array<Record>) => void) | null = null;

export function extendHisotry(records: Array<Record>) {
    changeHistoryCallback!(records)
}

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
    const [history, setHistory] = useState(new Array<Record>)
    changeHistoryCallback = (records: Array<Record>) => {
        setHistory([
            ...records,
            ...history
        ])
    }
    const items = history.map(record =>
        <Box p={2} key={record.time} borderWidth='1px'>
            <Heading size='m' textTransform='uppercase' > {record.time}</Heading>
            {record.error ?
                <Text fontSize='sm' color='tomato'>
                    {record.error}
                </Text> :
                <Stack direction={['column', 'row']}>
                    {record.treasures.map((treasure, idx) => {
                        return <Image alt={getIconDesc(treasure.idx)} key={`${record.time}-${idx}`}
                            src={getImageSrc(treasure.idx)}>
                        </Image>
                    })}
                </Stack>}
        </Box >
    )
    return <Stack divider={<StackDivider />} spacing='4'>{items}</Stack>

}
