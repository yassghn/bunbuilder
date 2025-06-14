/**
 * osEvents.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/osEvents
 * @property {bunbuilder.module:bunbuilder/api/osEvents} osEvents handle operating system events
 */

import shutdown from './shutdown'
import verbose from './verbose'
import process from 'node:process'

/**
 * generic shutdown function
 */
async function _closer() {
    await shutdown.close()
}

/**
 * handle sigint (ctrl+c) event
 */
async function _handleSigint() {
    verbose.sigint()
    await _closer().then(() => {
        process.exitCode = 0
        process.exit()
    })
}

/**
 * handle before exit event
 */
function _handleBeforeExit() {
    verbose.beforeExit()
    _closer()
}

/**
 * handle exit event
 */
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
