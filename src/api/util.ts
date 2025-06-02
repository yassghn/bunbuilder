/**
 * util.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/util
 * @property {bunbuilder.module:bunbuilder/api/util} util utlities
 */

import io from './io'
import packageData from '../../package.json' assert { type: 'json' }
import data from '../../data/data.json' assert { type: 'json' }
import type { HELP_STRING } from './types'

/**
 * hew package info from package.json
 *
 * @returns {string} package info string
 */
function _hewPackageInfoString(): string {
    const name = packageData.name
    const version = packageData.version
    const info = [name, ' ', 'v', version]
    return info.join('')
}

/**
 * echo styled string with a newline
 */
function _greet() {
    const info = _hewPackageInfoString()
    io.echo(info, { newLine: true, color: 'green' })
}

function _appendHelpStr(str: string, add: string, newLineWrap: boolean = false) {
    const retVal = { str: str.valueOf() }
    if (newLineWrap)
        retVal.str += '\n'
    retVal.str += add.valueOf()
    retVal.str += '\n'
    if (newLineWrap)
        retVal.str += '\n'
    return retVal.str
}

function _hewHelpDescription(): HELP_STRING {
    const description = { label: '', str: '' }
    description.str += '\n'
    description.str += data.help.description
    description.str += '\n'
    return description
}

function _hewHelpUsage(): HELP_STRING {
    const usage = { label: '', str: '' }
    const label = Object.keys(data.help)[1] ?? ''
    usage.label = _appendHelpStr(usage.label, label.toUpperCase(), true)
    usage.str = _appendHelpStr(usage.str, data.help.usage)
    return usage
}

function _hewHelpOptions(): HELP_STRING {
    const options = { label: '', str: '' }
    const label = Object.keys(data.help)[2] ?? ''
    options.label = _appendHelpStr(options.label, label.toLocaleUpperCase(), true)
    options.str = _appendHelpStr(options.str, data.help.options.build)
    options.str = _appendHelpStr(options.str, data.help.options.watch)
    options.str = _appendHelpStr(options.str, data.help.options.serve)
    options.str = _appendHelpStr(options.str, data.help.options.clean)
    options.str = _appendHelpStr(options.str, data.help.options.help)
    return options
}

function _hewHelpExamples(): HELP_STRING {
    const examples = { label: '', str: '' }
    const label = Object.keys(data.help)[3] ?? ''
    examples.label = _appendHelpStr(examples.label, label.toLocaleUpperCase(), true)
    examples.str = _appendHelpStr(examples.str, data.help.examples.build)
    examples.str = _appendHelpStr(examples.str, data.help.examples.watch)
    examples.str = _appendHelpStr(examples.str, data.help.examples.serve)
    examples.str = _appendHelpStr(examples.str, data.help.examples.clean)
    examples.str = _appendHelpStr(examples.str, data.help.examples.combo)
    return examples
}

async function _printHelp() {
    const description: HELP_STRING = _hewHelpDescription()
    const usage: HELP_STRING = _hewHelpUsage()
    const options: HELP_STRING = _hewHelpOptions()
    const examples: HELP_STRING = _hewHelpExamples()
    const labelColor = { color: 'yellow' }
    await io.echo(description.str)
    await io.echo(usage.label, labelColor)
    await io.echo(usage.str)
    await io.echo(options.label, labelColor)
    await io.echo(options.str)
    await io.echo(examples.label, labelColor)
    await io.echo(examples.str)
}

const util = {
    greet: () => {
        _greet()
    },

    printHelp: async () => {
        await _printHelp()
    }
}

export default util
