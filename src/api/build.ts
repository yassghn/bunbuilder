/**
 * build.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/build
 * @property {bunbuilder.module:bunbuilder/api/build} build build application
 */

import buildOp from './buildOp'
import buildConfig from './buildConfig'
import data from '../../data/data.json' assert { type: 'json' }
import { readdirSync, lstatSync } from 'node:fs'
import { extname, sep } from 'node:path'
import type { BROWSER_BUILD_OP_MAP, BUILD_OP_MAP } from './types'

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
    files
        .filter((item: string) => {
            const relativePath = dir + sep + item
            return lstatSync(relativePath).isFile()
        })
        .forEach((file: string) => retVal.files.push(file))
    return retVal.files
}

function _applyBrowserBuildOp(file: string, buildOp: string) {
    const buildOps = data.buildTargets.browser.buildOps
    switch (buildOp) {
        case buildOps.copy:
            console.log(buildOp)
            console.log(file)
            break
        case buildOps.compile:
            console.log(buildOp)
            console.log(file)
            break
    }
}

function _browserOpMapBuild(dir: string, files: string[], buildOpMaps: BUILD_OP_MAP[]) {
    buildOpMaps.forEach((opMap: any) => {
        // filter files current operation map target
        const targets = files.filter((file: string) => extname(file) == opMap.ext)
        // iterate targets and apply build operation
        targets.forEach((target: string) => {
            const relativePath = dir + sep + target
            _applyBrowserBuildOp(relativePath, opMap.op)
        })
    })
}

function _opMapBuild(dir: string, files: string[], buildOpMaps: BUILD_OP_MAP[]) {
    const config = buildConfig.state
    const targets = data.buildTargets
    switch (config.target) {
        case targets.browser.name: {
            _browserOpMapBuild(dir, files, buildOpMaps)
        }
    }
}

/**
 * process source files
 *
 * @param {string} dir root source input directory
 * @param {string[]} files source files
 */
function _digestFiles(dir: string, files: string[]) {
    const buildOpMaps: BUILD_OP_MAP[] = buildOp.inferOps(files)
    _opMapBuild(dir, files, buildOpMaps)
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
