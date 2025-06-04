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
import type { BUILD_OP_MAP } from './types'
import buildTask from './buildTask'
import verbose from './verbose'

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
async function _applyBrowserBuildOp(dir: string, file: string, buildOp: string): Promise<void>
async function _applyBrowserBuildOp(dir: string, files: string[], buildOp: string): Promise<void>

async function _applyBrowserBuildOp(dir: string, file: string | string[], buildOp: string) {
    const config = buildConfig.state
    const buildOps = data.buildTargets.browser.buildOps
    if (typeof file === 'string') {
        switch (buildOp) {
            case buildOps.copy:
                await verbose.copy(file)
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

/* async function _applyBrowserBuildOp(dir: string, files: string[], buildOp: string) {
    const config = buildConfig.state
    const buildOps = data.buildTargets.browser.buildOps
    switch (buildOp) {
        case buildOps.compile:
            buildTask.compile(dir, files, config.options.output)
            break
    }
} */

async function _browserOpMapBuild(dir: string, files: string[], buildOpMaps: BUILD_OP_MAP[]) {
    const buildOps = data.buildTargets.browser.buildOps
    await buildOpMaps.forEach(async (opMap: any) => {
        // filter files current operation map target
        const targets = files.filter((file: string) => extname(file) == opMap.ext)
        if (opMap.op == buildOps.compile) {
            await _applyBrowserBuildOp(dir, targets, opMap.op)
        } else {
            // iterate targets and apply build operation
            await targets.forEach(async (target: string) => {
                await _applyBrowserBuildOp(dir, target, opMap.op)
            })
        }
    })
}

async function _opMapBuild(dir: string, files: string[], buildOpMaps: BUILD_OP_MAP[]) {
    const config = buildConfig.state
    const targets = data.buildTargets
    switch (config.target) {
        case targets.browser.name: {
            buildTask.makeDestDir(config.options.output)
            await _browserOpMapBuild(dir, files, buildOpMaps)
        }
    }
}

/**
 * process source files
 *
 * @param {string} dir root source input directory
 * @param {string[]} files source files
 */
async function _digestFiles(dir: string, files: string[]) {
    const buildOpMaps: BUILD_OP_MAP[] = buildOp.inferOps(files)
    await _opMapBuild(dir, files, buildOpMaps)
}

/**
 * process source input
 *
 * @param {string} input bunbuilder configuration input source
 */
async function _digestInput(input: string[]) {
    // iterate all input array
    for (const src of input) {
        // lstat input
        const stat = lstatSync(src)
        // check for directory
        if (stat.isDirectory()) {
            // recursively get all files
            const files = _getFiles(src)
            await _digestFiles(src, files)
        } else {
        }
    }
}

/**
 * build whole bun app
 */
async function _buildAll() {
    // get config
    const config = buildConfig.state
    // digest all input sources
    await _digestInput(config.options.input)
}

const build = {
    all: async () => {
        await _buildAll()
    }
}

export default build
export {}
