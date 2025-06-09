/**
 * verbose.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/verbose
 * @property {bunbuilder.module:bunbuilder/api/verbose} verbose verbose build output
 */

import buildConfig from './buildConfig'
import io from './io'
import { newLine } from './io'
import data from '../../data/data.json' assert { type: 'json' }

const highlight = { color: data.options.verboseHighlightColor }

/**
 * check if we're applying verbose to the current process
 *
 * @returns {boolean} verbose configuration flag
 */
function _applyVerbose(): boolean {
    return buildConfig.verbose
}

/**
 * verbose build start output
 */
function _buildStart() {
    if (_applyVerbose()) {
        const config = buildConfig.state
        io.echoSync('starting build...', newLine)
        io.echoSync('target: ')
        io.echoSync(config.target, highlight)
        io.echoSync('', newLine)
    }
}

/**
 * verbose copy output
 *
 * @param {string} file target for copy operation
 */
function _copy(file: string) {
    if (_applyVerbose()) {
        const config = buildConfig.state
        io.echoSync('copying file ')
        io.echoSync(file, highlight)
        io.echoSync(' to ')
        io.echoSync(config.options.output, highlight)
        io.echoSync('', newLine)
    }
}

/**
 * verbose build result
 *
 * @param {boolean} success bun build output compilation result
 */
function _buildResult(success: boolean) {
    if (_applyVerbose()) {
        if (success) {
            const options = { newLine: true, color: 'green' }
            io.echoSync('build successful', options)
        } else {
            const options = { newLine: true, color: 'red' }
            io.echoSync('build failed', options)
        }
    }
}

/**
 * verbose compile
 *
 * @param {string} file source input file
 * @param {string} dest compilation destination
 */
function _compile(file: string, dest: string) {
    if (_applyVerbose()) {
        io.echoSync('compiling file ')
        io.echoSync(file, highlight)
        io.echoSync(' to ')
        io.echoSync(dest, highlight)
        io.echoSync('', newLine)
    }
}

/**
 * verbose sigint event
 */
function _sigint() {
    io.echoSync('sigint exit cleanup', newLine)
}

/**
 * verbose before exit event
 */
function _beforeExit() {
    io.echoSync('cleanup', newLine)
}

/**
 * verbose exit
 */
function _exit() {
    io.echoSync('shutting down bunbuilder', newLine)
}

function _serverStart(port: number) {
    io.echoSync('starting http server on ')
    io.echoSync(`localhost:${port}`, highlight)
    io.echoSync('', newLine)
}

function _serverShutdown() {
    io.echoSync('shutting down http server', newLine)
}

function _watcherStart(input: string) {
    io.echoSync('starting watcher on: ')
    io.echoSync(input, highlight)
    io.echoSync('', newLine)
}

function _watcherShutdown() {
    io.echoSync('closing watchers', newLine)
}

function _watcherChange(file: string) {
    io.echoSync('watcher detected change: ')
    io.echoSync(file, highlight)
    io.echoSync('', newLine)
}

const verbose = {
    buildStart: () => {
        _buildStart()
    },

    buildResult: (success: boolean) => {
        _buildResult(success)
    },

    compile: (file: string, dest: string) => {
        _compile(file, dest)
    },

    copy: (file: string) => {
        _copy(file)
    },

    serverStart: (port: number) => {
        _serverStart(port)
    },

    serverShutdown: () => {
        _serverShutdown()
    },

    watcherStart: (input: string) => {
        _watcherStart(input)
    },

    watcherShutdown: () => {
        _watcherShutdown()
    },

    watcherChange: (file: string) => {
        _watcherChange(file)
    },

    sigint: () => {
        _sigint()
    },

    beforeExit: () => {
        _beforeExit()
    },

    exit: () => {
        _exit()
    }
}

export default verbose
