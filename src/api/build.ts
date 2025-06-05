/**
 * build.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/build
 * @property {bunbuilder.module:bunbuilder/api/build} build build application
 */

import buildOp from './buildOp'
import buildConfig from './buildConfig'
import buildTask from './buildTask'
import verbose from './verbose'
import data from '../../data/data.json' assert { type: 'json' }
import type { BROWSER_BUILD_OP_MAP, BUILD_OP_MAP } from './types'
import { readdirSync, lstatSync } from 'node:fs'
import { extname, sep } from 'node:path'

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

/**
 * apply browser build operation for a given file
 *
 * @param {string} dir root source file directory
 * @param {string} file source file
 * @param {string} buildOp build operation
 */
function _applyBrowserBuildOp(dir: string, file: string, buildOp: string): void

/**
 * apply browser build operation for an array of files
 *
 * @param {string} dir root source file directory
 * @param {string[]} files source file
 * @param {string} buildOp build operation
 */
function _applyBrowserBuildOp(dir: string, files: string[], buildOp: string): void

/**
 * overloaded function to process build operations
 *
 * @param {string} dir root source file directory
 * @param {string|string[]} file source file
 * @param {string} buildOp build operation
 */
function _applyBrowserBuildOp(dir: string, file: string | string[], buildOp: string) {
    const config = buildConfig.state
    const buildOps = data.buildTargets.browser.buildOps
    if (typeof file === 'string') {
        switch (buildOp) {
            case buildOps.copy:
                verbose.copy(file)
                buildTask.copyFile(dir, file, config.options.output)
                break
        }
    } else {
        switch (buildOp) {
            case buildOps.compile:
                buildTask.compile(dir, file, config.options.output)
                break
        }
    }
}

/**
 * apply browser build op map to source files
 *
 * @param {string} dir root source file directory
 * @param {string[]} files source files
 * @param {BUILD_OP_MAP} buildOpMaps build operations map
 */
function _browserOpMapBuild(dir: string, files: string[], buildOpMaps: BUILD_OP_MAP[]) {
    const buildOps = data.buildTargets.browser.buildOps
    buildOpMaps.forEach(async (opMap: BROWSER_BUILD_OP_MAP) => {
        // filter files current operation map target
        const targets = files.filter((file: string) => extname(file) == opMap.ext)
        if (opMap.op == buildOps.compile) {
            _applyBrowserBuildOp(dir, targets, opMap.op)
        } else {
            // iterate targets and apply build operation
            targets.forEach(async (target: string) => {
                _applyBrowserBuildOp(dir, target, opMap.op)
            })
        }
    })
}

/**
 * infer build operation based on bunbuilder config target
 *
 * @param {string} dir root source file directory
 * @param {string[]} files source files
 * @param {BUILD_OP_MAP} buildOpMaps build operations map
 */
function _opMapBuild(dir: string, files: string[], buildOpMaps: BUILD_OP_MAP[]) {
    const config = buildConfig.state
    const targets = data.buildTargets
    switch (config.target) {
        case targets.browser.name: {
            buildTask.makeDestDir(config.options.output)
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
export {}
