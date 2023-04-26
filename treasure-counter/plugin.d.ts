import moment from 'moment'

export interface TreasureInfo {
    idx: number,
    num: number,
}
export interface TreasureRecord {
    quest_id: number,
    treasures: Array<TreasureInfo>
    timestamp: string,
}

export interface ErrorRecord {
    error: string,
    timestamp: string
}

export interface Message {
    kind: string,
    data: TreasureRecord | ErrorRecord | Array<TreasureRecord | ErrorRecord> | Array<String> | string | null,
}

interface AigisGameDataService {
    subscribe: (filter: string | ((file: string) => boolean), callback: (url: string, data: any) => void) => void,
}

export interface PluginHelper {
    onMessage: (callback: (msg: Message, sendResponse: (response: Message) => void) => void) => void
    sendMessage: (msg: Message, callback: (response: Message) => void) => void
    aigisGameDataService: AigisGameDataService
}