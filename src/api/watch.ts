/**
 * watch.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/watch
 * @property {bunbuilder.module:bunbuilder/api/watch}
 */

import buildConfig from './buildConfig'
import shutdown from './shutdown'
import verbose from './verbose'
import build from './build'
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
 * @param {string} src user bunbuilder configuration input source
 */
function _digestWatchEvent(eventType: WatchEventType, file: string | null, src: string) {
    // prevent watch misfires using a timeout & pause flag
    if (!_state.pause) {
        // process event
        if (eventType == 'change' && file !== null) {
            verbose.watcherChange(file)
            build.single(src, file)
        }
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
    const config = buildConfig.obj
    const input = config.options.input
    const options: WatchOptions = { recursive: true, persistent: true, encoding: 'utf-8' }
    const watchers = [] as unknown as FSWatcher[]
    input.forEach((src: string) => {
        verbose.watcherStart(src)
        const watcher = fsWatch(src, options, (eventType, file) => {
            _digestWatchEvent(eventType, file, src)
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
