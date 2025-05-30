/**
 * bunbuilder.ts
 */

import build from 'build'
import type { BUILD_OPTIONS } from 'types'
import packageData from '../package.json' assert { type: 'json' }

function _hewPackageInfoString(): string {
    const info = [packageData.name, '-', 'v', packageData.version]
    return info.join('')
}

function _bunbuilder(options: BUILD_OPTIONS) {
    console.log(_hewPackageInfoString())
    console.log(options)
}

function bunbuilder(options: BUILD_OPTIONS) {
    _bunbuilder(options)
    build.buildAll(options)
}

export default bunbuilder