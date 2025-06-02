/**
 * io.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/io
 * @property {bunbuilder.module:bunbuilder/api/io} standard i/o
 */

import { styleText } from 'node:util'
import { stdout } from 'node:process'

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

const io = {
    echo: async (str: string, options: ECHO_OPTIONS | undefined = undefined) => {
        await _echo(str, options)
    }
}

export default io
