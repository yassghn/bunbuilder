/**
 * postProcess.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/postProcess
 * @property {bunbuilder.module:bunbuilder/api/postProcess} postProcess post processing build artifacts
 */

import buildConfig from './buildConfig'
import resolveImports from './importResolver'
import { hewBaseUrl } from './tsconfig'
import data from '../../data/data.json' assert { type: 'json' }
import { join as pathJoin, sep } from 'node:path'
import { existsSync, renameSync, readdirSync, lstatSync, mkdirSync, rmSync } from 'node:fs'
import type { BUN_BUILD_ARTIFACT, BUN_BUILDOUTPUT } from './types'

/**
 * hew path of where files were output to
 *
 * @returns {string} path string
 */
function _hewPath(): string {
    const baseUrl = hewBaseUrl()
    const base = baseUrl.startsWith('.') ? baseUrl.slice(2, baseUrl.length) : baseUrl.valueOf()
    const dest = buildConfig.obj.options.outdir
    const jsOutDir = data.buildTargets.browser.buildOptions.jsOutDir
    const path = pathJoin(...[dest, jsOutDir, base])
    return path
}

/**
 * check if moving files is necessary
 *
 * @param {path} path possibly erraneous outdir structure
 * @returns {boolean} flag indicating if move is necessary
 */
function _needMoveFiles(path: string): boolean {
    const exists = existsSync(path)
    return exists
}

/**
 * move files/directories from path to correct outdir recursively
 *
 * @param {string} path path where files are to be moved from
 * @param {string} [dp] sub destination path (used internally)
 */
function _moveFiles(path: string, dp: any = undefined) {
    const dest = buildConfig.obj.options.outdir
    const jsOutDir = data.buildTargets.browser.buildOptions.jsOutDir
    const srcPath = pathJoin('.', path)
    const destPath = dp ? dp.valueOf() : pathJoin(...['.', dest, jsOutDir])
    const files = readdirSync(path, { encoding: 'utf-8' })
    files.forEach((file: string) => {
        const _srcPath = { str: pathJoin(srcPath, file) }
        const _destPath = { str: pathJoin(destPath, file) }
        const stat = lstatSync(_srcPath.str)
        if (stat.isDirectory()) {
            mkdirSync(_destPath.str)
            _moveFiles(_srcPath.str, _destPath.str)
        } else {
            renameSync(_srcPath.str, _destPath.str)
        }
    })
}

/**
 * delete the idiot pussy bitch boys
 *
 * @param {string} path path string with erraneous outdir
 */
function _deleteError(path: string) {
    const dest = buildConfig.obj.options.outdir
    const jsOutDir = data.buildTargets.browser.buildOptions.jsOutDir
    const keep = pathJoin(dest, jsOutDir).split(sep)
    const split = path.split(sep)
    for (let i = split.length - 1; i > 0; i--) {
        const item = split[i]
        if (item && !keep.includes(item)) {
            const delPath = split.join(sep)
            rmSync(delPath, { recursive: true, force: true })
            split.pop()
        } else {
            break
        }
    }
}

/**
 * don't leave pussy bitch boys alive
 *
 * @param {Bun.BuildOutput} buildOutput
 * @returns {BUN_BUILD_ARTIFACT[]} mock bun build artifacts
 */
function _hewMockBunBuildArtifacts(buildOutput: Bun.BuildOutput): BUN_BUILD_ARTIFACT[] {
    const artifacts = [] as BUN_BUILD_ARTIFACT[]
    const baseUrl = hewBaseUrl()
    const base = baseUrl.startsWith('.') ? baseUrl.slice(2, baseUrl.length) : baseUrl
    for (let i = 0; i < buildOutput.outputs.length; i++) {
        if (buildOutput.outputs[i]) {
            const artifact = buildOutput.outputs[i]
            if (artifact) {
                const p = pathJoin(sep, base)
                const path = artifact.path.replace(p, '')
                const item: BUN_BUILD_ARTIFACT = { path: path.valueOf() }
                artifacts.push(item)
            }
        }
    }
    return artifacts
}

/**
 * post process bun build artifacts
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 */
async function _postProcess(buildOutput: Bun.BuildOutput) {
    const config = buildConfig.obj
    const path = _hewPath()
    const artifacts: BUN_BUILDOUTPUT = { outputs: [] as BUN_BUILD_ARTIFACT[] }
    if (_needMoveFiles(path)) {
        _moveFiles(path)
        _deleteError(path)
        artifacts.outputs = _hewMockBunBuildArtifacts(buildOutput)
    }
    if (config.options.noBundleHack) {
        if (artifacts.outputs.length > 0) {
            resolveImports(artifacts)
        } else {
            resolveImports(buildOutput)
        }
    }
}

function postProcess(buildOutput: Bun.BuildOutput) {
    _postProcess(buildOutput)
}

export default postProcess
