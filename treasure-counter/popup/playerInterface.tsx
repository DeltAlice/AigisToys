
import { Message, PluginHelper } from '../plugin'

class Mailbox {
    private sender: Array<[Message, any]> = [];
    private listener: Array<(msg: Message) => void> = [];
    private pluginHelper: PluginHelper | null = null
    public send(msg: Message, response?: any) {
        if (this.pluginHelper === null) {
            this.sender.push([msg, response])
        } else {
            this.pluginHelper.sendMessage(msg, response)
        }
    }
    public listen(callback: (msg: Message) => void) {
        if (this.pluginHelper === null) {
            this.listener.push(callback)
        } else {
            this.pluginHelper.onMessage(callback)
        }
    }
    public setPluginHelper(pluginHelper: PluginHelper) {
        this.pluginHelper = pluginHelper
        this.sender.forEach(request => {
            let [msg, response] = request
            this.pluginHelper?.sendMessage(msg, response)
        })
        this.sender = []
        this.listener.forEach(callback => {
            this.pluginHelper?.onMessage(callback)
        })
        this.listener = []
    }
}

let mailbox = new Mailbox();
(global as any).mailbox = mailbox as any;

export { mailbox }


