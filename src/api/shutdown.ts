/**
 * shutdown.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/shutdown
 * @property {bunbuilder.module:bunbuilder/api/shutdown} shutdown build end cleanup
 */

import fs, { type FSWatcher } from 'node:fs'

const _state = {
    closers: {
        watcher: undefined as unknown as fs.FSWatcher,
        server: undefined as unknown as Bun.Server
    }
}

function _setWatcher(value: FSWatcher) {
    _state.closers.watcher = value
}

function _setServer(value: Bun.Server) {
    _state.closers.server = value
}

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

    set watcher(value: fs.FSWatcher) {
        _setWatcher(value)
    },

    set server(value: Bun.Server) {
        _setServer(value)
    }
}

export default shutdown
