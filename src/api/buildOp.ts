/**
 * buildOp.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/buildOp
 * @property {bunbuilder.module:bunbuilder/api/buildOp} buildOp build operations
 */

import buildConfig from './buildConfig'
import data from '../../data/data.json' assert { type: 'json' }
import type { BROWSER_BUILD_OP_MAP, BROWSER_BUILD_OPS, BUILD_OP_MAP } from './types'
import { extname } from 'node:path'

/**
 * get pre-configured browser target compile extensions
 *
 * @returns {string[]} browser target specific extensions which require compilation
 */
function _hewBrowserCompileExts(): string[] {
    const browser = data.buildTargets.browser
    const compileExts = browser.compileExts
    return compileExts
}

/**
 * infer build operation for browser specific file extension
 *
 * @param {string} ext source file extension
 * @returns {BROWSER_BUILD_OP_MAP} browser target specific build operation for file extension
 */
function _hewBrowserOpMap(ext: string): BROWSER_BUILD_OP_MAP {
    const compileExts = _hewBrowserCompileExts()
    const buildOps = data.buildTargets.browser.buildOps
    const opMap: BROWSER_BUILD_OP_MAP = {
        ext: ext.valueOf(),
        op: buildOps.copy as BROWSER_BUILD_OPS
    }
    if (compileExts.includes(ext)) opMap.op = buildOps.compile as BROWSER_BUILD_OPS
    return opMap
}

/**
 * infer build operations for given extensions based on bunbuilder
 * configuration build target
 *
 * @param {string} ext source file extensions
 * @returns {BUILD_OP_MAP} inferred build operation for given extension
 */
function _inferBuildOpMap(ext: string): BUILD_OP_MAP {
    const config = buildConfig.state
    const buildTargets = data.buildTargets
    const retVal = { opMap: {} as BUILD_OP_MAP }
    switch (config.target) {
        case buildTargets.browser.name:
            const opMap = _hewBrowserOpMap(ext)
            retVal.opMap = opMap
            break
    }
    return retVal.opMap
}

/**
 * list file extensions
 *
 * @param {string[]} files source input files
 * @returns {string[]} list of unique file extensions
 */
function _listExtensions(files: string[]): string[] {
    const extensions = [] as string[]
    files.forEach((file: string) => {
        const ext = extname(file)
        if (!extensions.includes(ext)) extensions.push(ext)
    })
    return extensions
}

/**
 * iterate extensions and infer their build operations
 *
 * @param {string[]} extensions source file extensions
 * @returns {BUILD_OP_MAP[]} per extension build operations
 */
function _inferOpsMapArray(extensions: string[]): BUILD_OP_MAP[] {
    const opMapArr: BUILD_OP_MAP[] = []
    extensions.forEach((ext: string) => {
        const opMap = _inferBuildOpMap(ext)
        opMapArr.push(opMap)
    })
    return opMapArr
}

/**
 * infer file extension build operations
 *
 * @param {string[]} files source input files
 * @returns {BUILD_OP_MAP[]} per extension build operations
 */
function _inferOps(files: string[]): BUILD_OP_MAP[] {
    const extensions = _listExtensions(files)
    const opMapArr: BUILD_OP_MAP[] = _inferOpsMapArray(extensions)
    return opMapArr
}

const buildOp = {
    inferOps: (files: string[]): BUILD_OP_MAP[] => {
        return _inferOps(files)
    }
}

export default buildOp
