/**
 * verbose.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/verbose
 * @property {bunbuilder.module:bunbuilder/api/verbose} verbose verbose build output
 */

import buildConfig from './buildConfig'
import io from './io'

function _applyVerbose(): boolean {
    return buildConfig.verbose
}

async function _buildStart() {
    if (_applyVerbose()) {
        const config = buildConfig.state
        const newLine = { newLine: true }
        await io.echo('starting build...', newLine)
        await io.echo('target: ')
        await io.echo(config.target, { color: 'cyan' })
    }
}

const verbose = {
    buildStart: async () => {
        await _buildStart()
    }
}

export default verbose
