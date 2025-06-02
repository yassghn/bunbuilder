/**
 * util.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/util
 * @property {bunbuilder.module:bunbuilder/api/util} util utlities
 */

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

const util = {
    hewPackageInfoString: (): string => {
        return _hewPackageInfoString()
    }
}

export default util
