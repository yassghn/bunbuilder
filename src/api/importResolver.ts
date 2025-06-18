/**
 * importResolver.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/importResolver
 * @property {bunbuilder.module:bunbuilder/api/importResolver} importResolver post processing build artifacts for bun no bundle hack
 */

import obj from './obj'
import { hewTsConfigPaths } from './tsconfig'
import data from '../../data/data.json' assert { type: 'json' }
import { sep } from 'node:path'
import { cwd } from 'node:process'
import buildConfig from './buildConfig'

/**
 * hew array of files from bun build output artifacts
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 * @returns {string[]} bun build artifact paths
 */
function _hewBuildArtifactFiles(buildOutput: Bun.BuildOutput): string[] {
    const files = [] as unknown as string[]
    const dir = cwd().split(sep).pop() as unknown as string
    buildOutput.outputs.forEach((artifact) => {
        const index = artifact.path.indexOf(dir)
        const relPath = artifact.path.substring(index, artifact.path.length).replace(dir, '.')
        files.push(relPath)
    })
    return files
}

/**
 * bun no bundle hack: add relative path prefix
 *
 * @param {string} importString build artifact import string
 * @returns {string} import string with relative path import prefix
 */
function _addPrefix(importString: string): string {
    const newImportString = './' + importString
    return newImportString
}

/**
 * bun no bundle hack: add missing js extensions
 *
 * @param {string} importString build artifact import string
 * @returns {string} import string with added js extensions
 */
function _addJsExtension(importString: string): string {
    const jsExt = '.js'
    if (!importString.endsWith(jsExt)) {
        importString += jsExt
    }
    return importString
}

/**
 * resolve prefixed import from tsconfig
 *
 * @param {string} importLine build artifact import string
 * @returns {string} import resolved from tsconfig paths
 */
function _resolveFromTsConfigPaths(importLine: string): string {
    const tsConfigPaths = hewTsConfigPaths()
    const val = obj.map.value.fromName(tsConfigPaths, importLine)
    return val
}

/**
 * infer if build artifact is top level directory source file
 *
 * @param {string} file build artifact path
 * @returns {boolean} top level source file flag
 */
function _isTopLevel(file: string): boolean {
    const config = buildConfig.obj
    const jsOutDir = data.buildTargets.browser.buildOptions.jsOutDir
    const outDir = config.options.outdir.slice(2, config.options.outdir.length)
    const path = outDir + sep + jsOutDir
    const arr = file.split(path) as string[]
    if (arr[1]) {
        const spliced = arr[1].slice(2, arr[1].length)
        if (spliced && spliced.indexOf(sep) < 0) return true
    }
    return false
}

/**
 * normalize relative path import string
 *
 * @param {string } importLine build artifact import string
 * @param {string} file build artifact path
 * @returns {string} normalized relative path import string
 */
function _normalizePath(importLine: string, file: string): string {
    const newImportLine = { str: importLine.valueOf() }
    const arr = importLine.split('/')
    const dir = sep + arr[1] + sep
    const pathHasDir = file.indexOf(dir) > 0 ? true : false
    if (_isTopLevel(file)) {
        newImportLine.str = arr.join('/')
    } else {
        if (pathHasDir) {
            const newArr = arr.filter((val: string) => val != arr[1])
            newImportLine.str = newArr.join('/')
        } else {
            arr[0] = '..'
            newImportLine.str = arr.join('/')
        }
    }
    return newImportLine.str
}

/**
 * process import statements for a given build artifact
 *
 * @param {Bun.Transpiler} transpiler bun transpiler
 * @param {string} file build artifact path
 * @param {string} prefix no bundle hack prefix
 */
async function _digestImports(transpiler: Bun.Transpiler, file: string, prefix: string) {
    const contents = {
        str: await Bun.file(file).text(),
        importsAltered: false
    }
    const imports = transpiler.scanImports(contents.str)
    imports.forEach((bunImport: Bun.Import) => {
        if (bunImport.kind == 'import-statement' && bunImport.path.startsWith(prefix)) {
            const newImportLine = { str: '' }
            newImportLine.str = _resolveFromTsConfigPaths(bunImport.path)
            newImportLine.str = _addPrefix(newImportLine.str)
            newImportLine.str = _normalizePath(newImportLine.str, file)
            newImportLine.str = _addJsExtension(newImportLine.str)
            contents.str = contents.str.replace(bunImport.path, newImportLine.str)
            contents.importsAltered = true
        }
    })
    if (contents.importsAltered) {
        await Bun.write(file, contents.str)
    }
}

/**
 * bun no bundle hack: correct import statements for browser target
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 */
function _correctImports(buildOutput: Bun.BuildOutput) {
    const files = _hewBuildArtifactFiles(buildOutput)
    const transpiler = new Bun.Transpiler()
    const prefix = data.options.noBundleHackImportPrefix
    files.forEach(async (file: string) => {
        await _digestImports(transpiler, file, prefix)
    })
}

function resolveImports(buildOutput: Bun.BuildOutput) {
    _correctImports(buildOutput)
}

export default resolveImports
