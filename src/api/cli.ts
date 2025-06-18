/**
 * cli.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/cli
 * @property {bunbuilder.module:bunbuilder/api/cli}
 */

import util from './util'
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
 * hew bunbuilder action plan given parsed cli arguments and positionals
 *
 * @param {PARSED_ARGS} parsed parsed cli arguments
 * @returns {ACTION_PLAN} bunbuilder action plan
 */
function _hewActionPlan(args: PARSED_ARGS): ACTION_PLAN {
    const actions = { ...args }
    const actionPlan: ACTION_PLAN = {
        actions: { ...actions }
    }
    return actionPlan
}

/**
 * check if any arguments were parsed from cli
 *
 * @param {PARSED_ARGS} parsed parsed cli arguments
 * @returns {boolean} flag indicating if any arguments were parsed
 */
function _hasArgs(args: PARSED_ARGS): boolean {
    if (Object.keys(args).length > 0) return true
    return false
}

/**
 * process parsed args
 *
 * @param {PARSED_ARGS} parsed parsed cli arguments
 * @returns {ACTION_PLAN} bunbuilder action plan
 */
function _processParsed(args: PARSED_ARGS): ACTION_PLAN {
    if (!_hasArgs(args)) {
        // when no args are passed default to swcbv
        Object.assign(args, {
            serve: true,
            watch: true,
            clean: true,
            build: true,
            verbose: true
        })
    }
    // action plan
    const actionPlan = _hewActionPlan(args)
    // solo help checkup
    util.soloHelpCheckup(actionPlan)
    return actionPlan
}

/**
 * parse cli arguments
 *
 * @returns {ACTION_PLAN} bunbuilder action plan
 */
function _argsParse(): ACTION_PLAN {
    const config = _hewParseArgsConfig()
    const args = parseArgs(config).values
    const actionPlan = _processParsed(args)
    return actionPlan
}

const cli = {
    argsParse: (): ACTION_PLAN => {
        return _argsParse()
    }
}

export default cli
