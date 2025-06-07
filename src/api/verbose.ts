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
import data from '../../data/data.json' assert { type: 'json' }

const highlight = { color: data.options.verboseHighlightColor }

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
        await io.echo(config.target, highlight)
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
        io.queueEcho(file, highlight)
        io.queueEcho(' to ')
        io.queueEcho(config.options.output, highlight)
        io.queueEcho('', newLine)
    }
}

function _buildResult(success: boolean) {
    if (_applyVerbose()) {
        if (success) {
            const options = { newLine: true, color: 'green' }
            io.queueEcho('build successful', options)
        } else {
            const options = { newLine: true, color: 'red' }
            io.queueEcho('build failed', options)
        }
    }
}

const verbose = {
    buildStart: async () => {
        await _buildStart()
    },

    buildResult: (success: boolean) => {
        _buildResult(success)
    },

    copy: (file: string) => {
        _copy(file)
    }
}

export default verbose
