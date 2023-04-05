import { Context, Schema, segment} from 'koishi'
import { execSync } from 'child_process'
import { type as ostype } from 'os'

const authorities = {
    'cmd': 4
}

export const name = 'systools'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
    ctx.command(`cmd <...systemCommands>`, 'systools: 运行系统命令(不支持上下文)', {authority: authorities.cmd}).action(async ({session}, ...systemCommands: Array<any>) => {
        if (systemCommands.length > 0) {
            try {
                let decoder = ostype() == 'Windows_NT' ? new TextDecoder('gbk') : new TextDecoder('utf-8')
                let result = decoder.decode(execSync(systemCommands.join(' '), { encoding: "buffer"}))
                if (result.length <= 0) {
                    return 'command ran successfully! (command has not output.)'
                } else if (result.length <= 300) {
                    return result
                } else {
                    let index = 0
                    while (index < result.length) {
                        session.sendQueued(result.slice(index, index+300), 700)
                        index += 300
                    }
                    return
                }
            } catch (e) {
                return `error: ${e.stack}`
            }
        } else {
            return `missing argv: <systemCommands>`
        }
    })
}
