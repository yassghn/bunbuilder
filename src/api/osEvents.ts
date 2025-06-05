/**
 * osEvents.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/osEvents
 * @property {bunbuilder.module:bunbuilder/api/osEvents} osEvents handle operating system events
 */

import shutdown from './shutdown'
import process from 'node:process'

function _closer(code: NodeJS.Signals) {
    console.log(code)
    shutdown.close()
}

function _addEventListeners() {
    process.on('SIGINT', _closer)
    //process.on('beforeExit', _otherClosingWork)
}

function _handle() {
    _addEventListeners()
}

const osEvents = {
    handle: () => {
        _handle()
    }
}

export default osEvents
