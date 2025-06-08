/**
 * osEvents.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/osEvents
 * @property {bunbuilder.module:bunbuilder/api/osEvents} osEvents handle operating system events
 */

import shutdown from './shutdown'
import process from 'node:process'
import verbose from './verbose'

/**
 * generic shutdown function
 *
 * @param {NodeJS.Signals} code os event code
 */
async function _closer() {
    await shutdown.close()
}

async function _handleSigint() {
    verbose.sigint()
    await _closer().then(() => {
        process.exitCode = 0
        process.exit()
    })
}

function _handleBeforeExit() {
    verbose.beforeExit()
    _closer()
}

function _handleExit() {
    verbose.exit()
}

/**
 * add os event listeners
 */
function _addEventListeners() {
    process.on('SIGINT', _handleSigint)
    process.on('beforeExit', _handleBeforeExit)
    process.on('exit', _handleExit)
    /* process.on('uncaughtException', (error, source) => {
        console.error(error)
        console.dir(source)
    }) */
}

/**
 * handle os events
 */
function _handle() {
    _addEventListeners()
}

const osEvents = {
    handle: () => {
        _handle()
    }
}

export default osEvents
