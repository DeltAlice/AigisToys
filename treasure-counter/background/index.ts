const crab = import('./wasm/crab')
import { TreasureCounter } from './wasm/crab'
import { PluginHelper, ErrorRecord, TreasureRecord } from '../plugin'
import moment from 'moment'

let counter: TreasureCounter | null = null
let fatalErrors: Array<String> = []
let errHistory: Array<ErrorRecord> = []

function feedData(callback: (counter: TreasureCounter) => void) {
    console.log(crab)
    crab.then(module => {
        if (counter === null) {
            counter = new module.TreasureCounter()
        }
        callback(counter)
    })
}

export function run(pluginHelper: PluginHelper) {
    pluginHelper.aigisGameDataService.subscribe('all-quest-info', (url, data) => {
        try {
            feedData(counter => counter.register_quests(data))
        } catch (err) {
            fatalErrors.push(err as string)
        }

    })

    pluginHelper.aigisGameDataService.subscribe(file => file.includes('MissionQuestList'), (url, data) => {
        try {
            console.log("index ", data.Label, data.Data.Contents)
            feedData(counter => counter.register_mission_quest(data.Data.Contents))
        } catch (err) {
            fatalErrors.push(err as string)
        }
    })

    pluginHelper.aigisGameDataService.subscribe(file => file.includes('Map') && file.includes('.aar'), (url, data) => {
        try {
            feedData(counter => {
                data.Data.Files.forEach((e: any) => {
                    if (/Entry\d\d.atb/.test(e.Name)) {
                        counter.register_map(data.Label, e.Name, e.Content.Contents)

                    }
                });
            })
        } catch (err) {
            fatalErrors.push(err as string)
        }
    })
    pluginHelper.aigisGameDataService.subscribe('quest-start', (url, data) => {
        feedData(counter => {
            try {
                let result = counter.check_treasures(data)
                pluginHelper.sendMessage({ kind: 'record', data: result }, (response: any) => { })
            } catch (err) {
                let record = { error: err as string, timestamp: moment().format("MM/DD HH:mm:ss") }
                errHistory.push(record)
                pluginHelper.sendMessage({ kind: 'err-record', data: record }, (response: any) => { })
            }

        }
        )
    })

    pluginHelper.onMessage((msg, sendResponse) => {
        switch (msg.kind) {
            case 'get-history':
                if (fatalErrors.length > 0) {
                    pluginHelper.sendMessage({ kind: 'fatalError', data: fatalErrors }, (response: any) => { })
                }
                let history = counter?.history() as Array<TreasureRecord | ErrorRecord>
                history = history.concat(errHistory)
                history.sort((a, b) => a.timestamp <= b.timestamp ? -1 : 1)
                sendResponse({ kind: 'history', data: history })
                break
            default:
                break
        }
    })

}

