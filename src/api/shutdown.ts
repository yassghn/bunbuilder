/**
 * shutdown.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/shutdown
 * @property {bunbuilder.module:bunbuilder/api/shutdown} shutdown build end cleanup
 */

import { type FSWatcher } from 'node:fs'

const _state = {
    closers: {
        watcher: undefined as unknown as FSWatcher,
        server: undefined as unknown as Bun.Server
    }
}

/**
 * add watcher to closers
 *
 * @param {FSWatcher} value node file watcher
 */
function _setWatcher(value: FSWatcher) {
    _state.closers.watcher = value
}

/**
 * add http server to closers
 *
 * @param {Bun.Server} value bun http server
 */
function _setServer(value: Bun.Server) {
    _state.closers.server = value
}

/**
 * shutdown running processes
 */
function _close() {
    const closers = _state.closers
    // close watcher
    if (closers.watcher)
        closers.watcher.close()
    // stop server
    if (closers.server)
        closers.server.stop()
}

const shutdown = {
    close: () => {
        _close()
    },

    set watcher(value: FSWatcher) {
        _setWatcher(value)
    },

    set server(value: Bun.Server) {
        _setServer(value)
    }
}

export default shutdown
