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

function _applyVerbose(): boolean {
    return buildConfig.verbose
}

async function _buildStart() {
    if (_applyVerbose()) {
        const config = buildConfig.state
        await io.echo('starting build...', newLine)
        await io.echo('target: ')
        await io.echo(config.target, cyan)
        await io.echo('', newLine)
    }
}

async function _copy(file: string) {
    if (_applyVerbose()) {
        const config = buildConfig.state
        await io.echo('copying file ')
        await io.echo(file, cyan)
        await io.echo(' to ')
        await io.echo(config.options.output, cyan)
        await io.echo('', newLine)
    }
}

const verbose = {
    buildStart: async () => {
        await _buildStart()
    },
    copy: async (file: string) => {
        await _copy(file)
    }
}

export default verbose
