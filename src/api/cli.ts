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
        verbose: {
            type: 'boolean',
            short: 'v'
        },
        help: {
            type: 'boolean',
            short: 'h'
        },
        '?': {
            type: 'boolean',
            short: '?'
        }
    }
    return options
}

/**
 * hew parse args config
 *
 * @returns {object} prase args configuration object
 */
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

/**
 * hew files array by checking parsed positional arguments for individual files
 *
 * @param {PARSED_ARGS} parsed parsed cli arguments
 * @returns {string[]|null} array of individual files
 */
function _hewParsedFiles(parsed: PARSED_ARGS): string[] | null {
    // check for individual files
    if (parsed.positionals.length > 2) {
        const length = parsed.positionals.length
        const files = parsed.positionals.slice(2, length)
        return files
    }
    return null
}

/**
 * hew bunbuilder action plan given parsed cli arguments and positionals
 *
 * @param {PARSED_ARGS} parsed parsed cli arguments
 * @param {string[]|null} files array of individual files
 * @returns {ACTION_PLAN} bunbuilder action plan
 */
function _hewActionPlan(parsed: PARSED_ARGS, files: string[]|null): ACTION_PLAN {
    const actions = { ...parsed.values }
    const actionPlan: ACTION_PLAN = {
        actions: { ...actions },
        files: files == null ? undefined : [...files]
    }
    return actionPlan
}

/**
 * process parsed args
 *
 * @param {PARSED_ARGS} parsed parsed cli arguments
 * @returns {ACTION_PLAN} bunbuilder action plan
 */
function _processParsed(parsed: PARSED_ARGS): ACTION_PLAN {
    // get files
    const files = _hewParsedFiles(parsed)
    // action plan
    const actionPlan = _hewActionPlan(parsed, files)
    return actionPlan
}

/**
 * parse cli arguments
 *
 * @returns {ACTION_PLAN} bunbuilder action plan
 */
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
