/**
 * util.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/util
 * @property {bunbuilder.module:bunbuilder/api/util} util utlities
 */

import io from './io'
import packageData from '../../package.json' assert { type: 'json' }

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
    io.echo(info, {newLine: true, color: 'green' })
}

const util = {
    greet: () => {
        _greet()
    }
}

export default util
