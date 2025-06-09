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
import {
    lstatSync,
    watch as fsWatch,
    type FSWatcher,
    type WatchEventType,
    type WatchOptions
} from 'node:fs'
import { sep } from 'node:path'

const _options = {
    timeout: data.options.watchTimeout
}

const _state = {
    pause: false
}

/**
 * check if src is a directory
 *
 * @param {string} src user bunbuilder configuration input source
 * @returns {boolean} flag indicating if src is a directory
 */
function _isDirectory(src: string): boolean {
    const stat = lstatSync(src)
    if (stat.isDirectory()) return true
    return false
}

function _pause() {
    // set pause flag
    _state.pause = true
    // set timeout
    setTimeout(() => {
        // unpause
        _state.pause = false
    }, _options.timeout)
}

/**
 * process watch event file
 *
 * @param {string} file file triggering event
 * @param {string} src user bunbuilder configuration input source
 */
function _digestFile(file: string, src: string) {
    verbose.watcherChange(file)
    if (_isDirectory(src)) {
        const path = src + sep + file
        if (!_isDirectory(path)) {
            build.single(src, file)
        }
    } else {
        build.single(null, file)
    }
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
            _digestFile(file, src)
        }
        _pause()
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
    const inputs = config.options.inputs
    const options: WatchOptions = { recursive: true, persistent: true, encoding: 'utf-8' }
    const watchers = [] as unknown as FSWatcher[]
    inputs.forEach((input: string) => {
        verbose.watcherStart(input)
        const watcher = fsWatch(input, options, (eventType, file) => {
            _digestWatchEvent(eventType, file, input)
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
