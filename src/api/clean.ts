/**
 * clean.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/clean
 * @property {bunbuilder.module:bunbuilder/api/clean}
 */

import buildConfig from './buildConfig'
import verbose from './verbose'
import { rmSync, readdirSync } from 'node:fs'
import path from 'node:path'

/**
 * delete everything inside of bunbuilder configuration output directory
 */
function _cleanOutdir() {
    verbose.clean()
    const config = buildConfig.obj
    const outdir = config.options.output
    const options = { force: true, recursive: true }
    readdirSync(outdir).forEach((item: string) => {
        rmSync(path.join(outdir, item), options)
    })
}

const clean = {
    outdir: () => {
        _cleanOutdir()
    }
}

export default clean
