/**
 * build.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/build
 * @property {bunbuilder.module:bunbuilder/api/build} build build application
 */

import io from 'api/io'
import util from './util'

/**
 * echo styled string with a newline
 */
function _buildGreet() {
    const info = util.hewPackageInfoString()
    io.echo(info, {newLine: true, color: 'green' })
}

function _buildAll() {}

const build = {
    greet: () => {
        _buildGreet()
    },

    all: () => {
        _buildAll()
    }
}

export default build
