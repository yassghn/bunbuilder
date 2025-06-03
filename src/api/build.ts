/**
 * build.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/build
 * @property {bunbuilder.module:bunbuilder/api/build} build build application
 */

import buildOp from './buildOp'
import type { BUNBUILDER_CONFIG } from './types'
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
 * build whole bun app
 *
 * @param {BUNBUILDER_CONFIG} config bunbuilder configuration
 */
function _buildAll(config: BUNBUILDER_CONFIG) {
    // iterate all inputs
    for (const input of config.options.input) {
        // lstat input
        const stat = lstatSync(input)
        // check for directory
        if (stat.isDirectory()) {
            // recursively get all files
            const files = _getFiles(input)
            _digestFiles(input, files)
        } else {
        }
    }
}

const build = {
    all: (config: BUNBUILDER_CONFIG) => {
        _buildAll(config)
    }
}

export default build
