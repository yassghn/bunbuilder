/**
 * build.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/build
 * @property {bunbuilder.module:bunbuilder/api/build} build build application
 */

import buildOp from './buildOp'
import buildConfig from './buildConfig'
import { readdirSync, lstatSync } from 'node:fs'
import { sep } from 'node:path'

/**
 * recursively traverse input directory and aggregate files
 *
 * @param {string} dir input directory
 * @returns {string[]} recursive file aggregate
 */
function _getFiles(dir: string): string[] {
    const retVal = { files: [] as string[] }
    const files = readdirSync(dir, { encoding: 'utf-8', recursive: true })
    // filter out directories and add results to return val
    files.filter((item: string) => {
        const relativePath = dir + sep + item
        return lstatSync(relativePath).isFile()
    }).forEach((file: string) => retVal.files.push(file))
    return retVal.files
}

/**
 * process source files
 *
 * @param {string} dir root source input directory
 * @param {string[]} files source files
 */
function _digestFiles(dir: string, files: string[]) {
    files.forEach((file: string) => {
        buildOp.inferOperation(dir, file)
    })
}

/**
 * process source input
 *
 * @param {string} input bunbuilder configuration input source
 */
function _digestInput(input: string[]) {
    // iterate all input array
    for (const src of input) {
        // lstat input
        const stat = lstatSync(src)
        // check for directory
        if (stat.isDirectory()) {
            // recursively get all files
            const files = _getFiles(src)
            _digestFiles(src, files)
        } else {
        }
    }
}

/**
 * build whole bun app
 */
function _buildAll() {
    // get config
    const config = buildConfig.state
    // digest all input sources
    _digestInput(config.options.input)
}

const build = {
    all: () => {
        _buildAll()
    }
}

export default build
