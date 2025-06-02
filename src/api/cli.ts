/**
 * cli.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/cli
 * @property {bunbuilder.module:bunbuilder/api/cli}
 */

import type { PARSED_ARGS, ACTION_PLAN } from './types'
import { parseArgs } from 'node:util'

/**
 * hew options for parsing cli arguments
 *
 * @returns {object} parseArgs options
 */
function _hewParseArgsOptions(): object {
    const options = {
        build: {
            type: 'boolean',
            short: 'b'
        },
        watch: {
            type: 'boolean',
            short: 'w'
        },
        serve: {
            type: 'boolean',
            short: 's'
        },
        clean: {
            type: 'boolean',
            short: 'c'
        },
        help: {
            type: 'boolean',
            short: 'h'
        }
    }
    return options
}

function _hewParseArgsConfig(): object {
    const options = _hewParseArgsOptions()
    const config = {
        args: Bun.argv,
        strict: true,
        allowPositionals: true,
        options: { ...options }
    }
    return config
}

function _processParsed(parsed: PARSED_ARGS): ACTION_PLAN {
    // spread parsed values
    const actions = { ...parsed.values }
    const files = []
    // check for individual files
    if (parsed.positionals.length > 2) {
        const length = parsed.positionals.length
        const arr = parsed.positionals.slice(2, length)
        files.push(arr)
    }
    // action plan
    const actionPlan: ACTION_PLAN = {
        actions: { ...actions },
        files: files[0]
    }
    return actionPlan
}

function _argsParse(): ACTION_PLAN {
    const config = _hewParseArgsConfig()
    const parsed = parseArgs(config)
    const actionPlan = _processParsed(parsed)
    return actionPlan
}

const cli = {
    argsParse: (): ACTION_PLAN => {
        return _argsParse()
    }
}

export default cli
