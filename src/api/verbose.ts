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

const cyan = { color: 'cyan' }

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
async function _buildStart() {
    if (_applyVerbose()) {
        const config = buildConfig.state
        await io.echo('starting build...', newLine)
        await io.echo('target: ')
        await io.echo(config.target, cyan)
        await io.echo('', newLine)
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
        io.queueEcho('copying file ')
        io.queueEcho(file, cyan)
        io.queueEcho(' to ')
        io.queueEcho(config.options.output, cyan)
        io.queueEcho('', newLine)
    }
}

const verbose = {
    buildStart: async () => {
        await _buildStart()
    },

    copy: (file: string) => {
        _copy(file)
    }
}

export default verbose
