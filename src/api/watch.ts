/**
 * watch.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/watch
 * @property {bunbuilder.module:bunbuilder/api/watch}
 */

import buildConfig from './buildConfig'
import shutdown from './shutdown'
import data from '../../data/data.json' assert { type: 'json' }
import { watch as fsWatch, type FSWatcher, type WatchEventType, type WatchOptions } from 'node:fs'

const _options = {
    timeout: data.options.watchTimeout
}

const _state = {
    pause: false
}

/**
 * process watch event
 *
 * @param {WatchEventType} eventType watch event
 * @param {string|null} file file triggering event
 */
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

/**
 * add watchers to shutdown
 *
 * @param {FSWatcher[]} watchers
 */
function _setCloser(watchers: FSWatcher[]) {
    shutdown.watchers = watchers
}

/**
 * begin watching bunbuilder configuration inputs
 */
function _start() {
    const config = buildConfig.state
    const input = config.options.input
    const options: WatchOptions = { recursive: true, persistent: true, encoding: 'utf-8' }
    const watchers = [] as unknown as FSWatcher[]
    input.forEach((src: string) => {
        const watcher = fsWatch(src, options, (eventType, file) => {
            _digestWatchEvent(eventType, file)
        })
        watchers.push(watcher)
    })
    _setCloser(watchers)
}

const watch = {
    start: () => {
        _start()
    }
}

export default watch
