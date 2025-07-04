/**
 * shutdown.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/shutdown
 * @property {bunbuilder.module:bunbuilder/api/shutdown} shutdown build end cleanup
 */

import io from './io'
import verbose from './verbose'
import { type FSWatcher } from 'node:fs'

const _state = {
    closers: {
        watchers: undefined as unknown as FSWatcher[],
        server: undefined as unknown as Bun.Server
    }
}

/**
 * add watchers to closers
 *
 * @param {FSWatcher[]} value node file watcher
 */
function _setWatchers(value: FSWatcher[]) {
    _state.closers.watchers = value
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
async function _close() {
    const closers = _state.closers
    // close watcher
    if (closers.watchers) {
        verbose.watcherShutdown()
        closers.watchers.forEach((watcher: FSWatcher) => {
            watcher.close()
        })
    }
    // stop server
    if (closers.server) {
        verbose.serverShutdown()
        await closers.server.stop(true).then(() => {
            closers.server.unref()
        })
    }
    // close io echo hold timeout
    io.closeEchoHoldTimeout()
}

const shutdown = {
    close: async () => {
        await _close()
    },

    set watchers(value: FSWatcher[]) {
        _setWatchers(value)
    },

    set server(value: Bun.Server) {
        _setServer(value)
    }
}

export default shutdown
