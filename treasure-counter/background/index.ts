const crab = import('./wasm/crab')
import { TreasureCounter } from './wasm/crab'
import { PluginHelper, Record } from '../plugin'
import moment from 'moment'
let counter: TreasureCounter | null = null
let history: Array<Record> = []
let fatalErrors: Array<string> = []

function feedData(register: (counter: TreasureCounter) => void) {
    crab.then(module => {
        if (counter === null) {
            counter = new module.TreasureCounter()
        }
        register(counter)
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
            let record: Record = {
                quest_id: 0,
                treasures: [],
                time: moment().format('MM-DD HH:mm:ss'),
                error: ''
            }
            try {
                let result = counter.check_treasures(data)
                record.quest_id = result.quest_id
                record.treasures = result.treasures
            } catch (err) {
                record.error = err as string
            }
            history.push(record)
            pluginHelper.sendMessage({ kind: 'record', data: record }, (response: any) => { })
        }
        )
    })

    pluginHelper.onMessage((msg, sendResponse) => {
        if (fatalErrors) {
            sendResponse({ kind: 'fatalError', data: fatalErrors })
        }
        switch (msg.kind) {
            case '@get(history)': sendResponse({ kind: 'history', data: history })
                break
            default:
                break
        }
    })

}

