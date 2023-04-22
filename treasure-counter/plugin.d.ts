export interface TreasureInfo {
    idx: number,
    num: number,
}

export interface Record {
    quest_id: number,
    treasures: Array<TreasureInfo>,
    time: string,
    error: string
}

export interface Message {
    kind: string,
    data: any,
}

interface AigisGameDataService {
    subscribe: (filter: string | ((file: string) => boolean), callback: (url: string, data: any) => void) => void,
}

export interface PluginHelper {
    onMessage: (callback: (msg: Message, sendResponse: (response: Message) => void) => void) => void
    sendMessage: (msg: Message, callback: (response: Message) => void) => void
    aigisGameDataService: AigisGameDataService
}