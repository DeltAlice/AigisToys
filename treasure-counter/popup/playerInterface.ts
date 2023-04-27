
import { Message, PluginHelper } from '../plugin'

class Mailbox {
    private sender: Array<[Message, any]> = [];
    private listener = new Map<string, (msg: Message) => void>;
    private pluginHelper: PluginHelper | null = null
    public send(msg: Message, response?: any) {
        if (this.pluginHelper === null) {
            this.sender.push([msg, response])
        } else {
            this.pluginHelper.sendMessage(msg, response)
        }
    }
    public listen(key: string, callback: (msg: Message) => void) {
        // react-strict will trigger useEffect twice
        // so we have to use a key to distinguish listener from different modules
        this.listener.set(key, callback)

    }
    public setPluginHelper(pluginHelper: PluginHelper) {
        this.pluginHelper = pluginHelper
        this.sender.forEach(request => {
            let [msg, response] = request
            this.pluginHelper?.sendMessage(msg, response)
        })
        this.sender = []
        this.pluginHelper?.onMessage(msg => {
            this.listener.forEach(callback => {
                callback(msg)
            })
        })
    }
}

let mailbox = new Mailbox();
(global as any).mailbox = mailbox as any;

export { mailbox }


