/**
 * watch.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/watch
 * @property {bunbuilder.module:bunbuilder/api/watch}
 */

import buildConfig from './buildConfig'
import data from '../../data/data.json' assert { type: 'json' }
import { watch as fsWatch, lstatSync, type WatchEventType, type WatchOptions } from 'node:fs'

const _options = {
    timeout: data.options.watchTimeout
}

const _state = {
    pause: false
}

function _findFirstDir(input: string[]): string {
    const dir = input.find((src: string) => lstatSync(src).isDirectory())
    if (!dir) {
        const err = `cannot find a directory to watch: ${input}`
        throw new Error(err)
    }
    return dir
}

function _digestWatchEvent(eventType: WatchEventType, file: string | null) {
    // prevent watch misfires using a timeout & pause flag
    if (!_state.pause) {
        // process event
        console.log(eventType)
        console.log(file)
        // set pause flag
        _state.pause = true
        // set timeout
        setTimeout(() => {
            // unpause
            _state.pause = false
        }, _options.timeout)
    }
}

function _start() {
    const config = buildConfig.state
    const dir = _findFirstDir(config.options.input)
    const options: WatchOptions = { recursive: true, persistent: true, encoding: 'utf-8' }
    fsWatch(dir, options, (eventType, file) => { _digestWatchEvent(eventType, file)})
}

const watch = {
    start: () => {
        _start()
    }
}

export default watch
