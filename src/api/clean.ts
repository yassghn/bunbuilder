/**
 * clean.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/clean
 * @property {bunbuilder.module:bunbuilder/api/clean} clean bunbuilder configuration outdir cleaning
 */

import buildConfig from './buildConfig'
import verbose from './verbose'
import { rmSync, readdirSync } from 'node:fs'
import path from 'node:path'

/**
 * delete everything inside of bunbuilder configuration outdir
 */
function _cleanOutdir() {
    verbose.clean()
    const config = buildConfig.obj
    const outdir = config.options.outdir
    const options = { force: true, recursive: true }
    readdirSync(outdir).forEach((item: string) => {
        rmSync(path.join(outdir, item), options)
    })
}

/**
 * clean single file from bunbuilder configuration outdir
 *
 * @param {string} src relative path of file to be cleaned
 */
function _cleanSingleFile(src: string) {
    verbose.cleanSingle(src)
    const config = buildConfig.obj
    const outdir = config.options.outdir
    const options = { force: true }
    rmSync(path.join(outdir, src), options)
}

const clean = {
    outdir: () => {
        _cleanOutdir()
    },

    singleFile: (path: string) => {
        _cleanSingleFile(path)
    }
}

export default clean
