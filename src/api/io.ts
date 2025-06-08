/**
 * io.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/io
 * @property {bunbuilder.module:bunbuilder/api/io} io standard i/o
 */

import data from '../../data/data.json' assert { type: 'json' }
import { styleText } from 'node:util'
import { stdout } from 'node:process'

const options = {
    echoHoldTimeout: data.options.echoHoldTimeout,
    limitTimeoutMultiplier: data.options.limitTimeoutMultiplier
}

/**
 * @typedef {object} ECHO_OPTIONS
 * @type {ECHO_OPTIONS} options for echo
 * @property {boolean} newLine add new line flag
 * @property {string} color color
 */
interface ECHO_OPTIONS {
    newLine?: boolean | undefined
    color?: any | undefined
}

/**
 * @typedef {object} ECHO_STR_OPTS
 * @type {ECHO_STR_OPTS} echo string and options
 * @property {string} str echo string
 * @property {ECHO_OPTIONS} options echo options
 */
interface ECHO_STR_OPTS {
    str: string
    options: ECHO_OPTIONS | undefined
}

const newLine = { newLine: true }

const _echoHold = {
    queue: [] as ECHO_STR_OPTS[],
    timeout: undefined as unknown as NodeJS.Timeout,
    limit: options.echoHoldTimeout * options.limitTimeoutMultiplier,
    queueTimer: 0
}

/**
 * close echo hold timeout
 */
function _closeEchoHoldTimeout() {
    if (_echoHold.timeout && _echoHold.timeout.hasRef()) {
        _echoHold.timeout.close()
        _echoHold.timeout.unref()
    }
}

/**
 * hew echo str opts
 *
 * @param {string} str echo string
 * @param {ECHO_OPTIONS|undefined} options echo optins
 * @returns {ECHO_STR_OPTS} echo string and options
 */
function _hewEchoStrOpts(
    str: string,
    options: ECHO_OPTIONS | undefined = undefined
): ECHO_STR_OPTS {
    const echoStrOpts: ECHO_STR_OPTS = {
        str: str,
        options: options
    }
    return echoStrOpts
}

/**
 * add echo string with options to echo hold queue
 *
 * @param {ECHO_STR_OPTS} echoStrOpts echo string and options
 */
function _appendEchoHold(echoStrOpts: ECHO_STR_OPTS) {
    _echoHold.queue.push(echoStrOpts)
}

/**
 * close echohold timeout if time limit is reached
 */
function _timeoutLimit() {
    if (_echoHold.queueTimer >= _echoHold.limit) {
        _closeEchoHoldTimeout()
    } else {
        _echoHold.queueTimer += options.echoHoldTimeout
    }
}

/**
 * echo every echohold echo string and its options
 */
async function _digestEchoHold() {
    const numQueued = _echoHold.queue.length
    if (numQueued > 0) {
        // iterate echo hold
        for (let i = 0; i < numQueued; i++) {
            // pop first item off the array
            const echoStrOpts: ECHO_STR_OPTS | undefined = _echoHold.queue.shift()
            if (echoStrOpts) {
                // write array item
                await _echo(echoStrOpts.str, echoStrOpts.options)
            }
        }
    } else {
        _timeoutLimit()
    }
}

/**
 * queue echo with options, reset queue timer
 *
 * @param {string} str echo string
 * @param {ECHO_OPTIONS} options echo options
 */
function _queueEcho(str: string, options: ECHO_OPTIONS | undefined = undefined) {
    const echoStrOpts = _hewEchoStrOpts(str, options)
    _appendEchoHold(echoStrOpts)
    // reset echo hold queue timer
    _echoHold.queueTimer = 0
}

/**
 * poll echo hold queue
 */
function _pollEchoHold() {
    const timeout: NodeJS.Timeout = setInterval(_digestEchoHold, options.echoHoldTimeout)
    _echoHold.timeout = timeout
}

/**
 * add echo options to string
 *
 * @param {string} str string to add echo options to
 * @param {ECHO_OPTIONS} [options=undefined] echo options
 * @returns {string} optionated string
 */
function _addEchoOptions(str: string, options: ECHO_OPTIONS): string {
    // copy output string
    const output = { str: str.valueOf() }
    // apply color if specified
    if (options.color) {
        output.str = styleText(options.color, str, { stream: stdout, validateStream: true })
    }
    // add new line if specified
    if (options.newLine) {
        output.str += '\n'
    }
    // return new string
    return output.str
}

/**
 * write str to stdout
 *
 * @param {string} str string to write
 * @param {ECHO_OPTIONS} [options=undefined] echo options
 */
async function _echo(str: string, options: ECHO_OPTIONS | undefined = undefined) {
    // copy output string
    const output = { str: str.valueOf() }
    // process options
    if (options) {
        output.str = _addEchoOptions(str, options)
    }
    // write to stdout
    await Bun.write(Bun.stdout, output.str)
}

// begin polling echo hold
_pollEchoHold()

const io = {
    echo: async (str: string, options: ECHO_OPTIONS | undefined = undefined) => {
        await _echo(str, options)
    },

    queueEcho: (str: string, options: ECHO_OPTIONS | undefined = undefined) => {
        _queueEcho(str, options)
    },

    closeEchoHoldTimeout: () => {
        _closeEchoHoldTimeout()
    }
}

export default io
export { newLine }
