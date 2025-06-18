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
import clean from './clean'
import data from '../../data/data.json' assert { type: 'json' }
import {
    existsSync,
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
    const exists = existsSync(src)
    if (exists) {
        const stat = lstatSync(src)
        if (stat.isDirectory()) return true
    }
    return false
}

/**
 * check if src is a bunbuilder configuration inputs directory
 *
 * @param {string} src user bunbuilder configuration input source
 * @returns {boolean} flag indicating if src is a preconfigured input directory
 */
function _isInputDirectory(src: string): boolean {
    const config = buildConfig.obj
    const inputs = config.options.inputs
    for (const input of inputs) {
        if (input == src) return true
    }
    return false
}

/**
 * check if a file was removed from the source tree
 *
 * @param {string} file file triggering event
 * @param {string} src user bunbuilder configuration input source
 * @returns {boolean} flag indicating if file was removed
 */
function _fileWasRemoved(file: string, src: string): boolean {
    const path = src + sep + file
    const exists = existsSync(path)
    if (exists) return false
    return true
}

/**
 * check if file is new
 *
 * @param {string} file file triggering event
 * @param {string} src user bunbuilder configuration input source
 * @returns {boolean} flag indicating if file was just added to source tree
 */
function _isNewFile(file: string, src: string): boolean {
    const config = buildConfig.obj
    const outdir = config.options.outdir
    const nSrc = src.startsWith('.') ? src.slice(2, src.length) : src
    const path = nSrc + sep + file
    const outPath = outdir + sep + path
    const exists = existsSync(outPath)
    if (!exists && !_isDirectory(path)) return true
    return false
}

/**
 * watcher timeout & pause
 */
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
    if (_isDirectory(src) && _isInputDirectory(src)) {
        const path = src + sep + file
        if (!_isDirectory(path)) {
            build.single(src, file)
        }
    } else {
        const path = src + sep + file
        build.single('', path)
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
        if ((eventType == 'change' || eventType == 'rename') && file !== null) {
            if (_isNewFile(file, src)) {
                // new file verbose output
                verbose.watcherNewFile(src + sep + file)
                _digestFile(file, src)
            } else if (_fileWasRemoved(file, src)) {
                // clean removed file
                const path = src + sep + file
                verbose.watcherFileRemoved(path)
                clean.singleFile(path)
            } else {
                _digestFile(file, src)
            }
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
 * watch provided sources. apply watch options.
 *
 * @param {string[]} sources array of sources to watch
 * @param {WatchOptions} options watch options
 * @returns {FSWatcher[]} array of created watchers
 */
function _watchSources(sources: string[], options: WatchOptions): FSWatcher[] {
    const watchers = [] as unknown as FSWatcher[]
    sources.forEach((input: string) => {
        verbose.watcherStart(input)
        const watcher = fsWatch(input, options, (eventType, file) => {
            _digestWatchEvent(eventType, file, input)
        })
        // pause watchers after creating them
        _pause()
        watchers.push(watcher)
    })
    return watchers
}

/**
 * begin watching bunbuilder configuration inputs and resources
 */
function _start() {
    const config = buildConfig.obj
    const inputs = config.options.inputs
    const resources = config.options.resources
    const options: WatchOptions = { recursive: true, persistent: true, encoding: 'utf-8' }
    const watchers = [] as unknown as FSWatcher[]
    const inputWatchers = _watchSources(inputs, options)
    const resourceWatchers = _watchSources(resources, options)
    inputWatchers.forEach((watcher: FSWatcher) => watchers.push(watcher))
    resourceWatchers.forEach((watcher: FSWatcher) => watchers.push(watcher))
    _setCloser(watchers)
}

const watch = {
    start: () => {
        _start()
    }
}

export default watch
