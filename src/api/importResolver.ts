/**
 * importResolver.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/importResolver
 * @property {bunbuilder.module:bunbuilder/api/importResolver} importResolver resolve imports for bun no bundle hack
 */

import obj from './obj'
import { hewTsConfigPaths } from './tsconfig'
import data from '../../data/data.json' assert { type: 'json' }
import type { BUN_BUILDOUTPUT } from './types'
import { sep } from 'node:path'
import { cwd } from 'node:process'
import buildConfig from './buildConfig'

/**
 * hew array of files from bun build output artifacts
 *
 * @param {Bun.BuildOutput|BUN_BUILDOUTPUT} buildOutput bun build output
 * @returns {string[]} bun build artifact paths
 */
function _hewBuildArtifactFiles(buildOutput: Bun.BuildOutput | BUN_BUILDOUTPUT): string[] {
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
 * normalize relative path import string
 *
 * @param {string} importLine ts config resolved import string
 * @param {string} file build artifact path
 * @returns {string} normalized relative path import string
 */
function _normalizePath(importLine: string, file: string): string {
    const newImportLine = { str: importLine.valueOf() }
    const config = buildConfig.obj
    const jsOutDir = data.buildTargets.browser.buildOptions.jsOutDir
    const outDir = config.options.outdir.slice(2, config.options.outdir.length)
    const fileSplit = file
        .split(/\W/)
        .filter((item: string) => item !== '' && item !== outDir && item !== jsOutDir)
    const importSplit = importLine.split(/\W/).filter((item: string) => item !== '')
    const isTopLevelFile = fileSplit.length == 1
    if (!isTopLevelFile) {
        const isSameDir = fileSplit[0]?.valueOf() == importSplit[0]?.valueOf()
        if (isSameDir) {
            const dir = importSplit[0]
            const fileHasMoreDirs = fileSplit.length > importSplit.length
            const moreSubDirs = fileSplit.length > 2 && importSplit.length > 2
            const fileSubDirs = fileSplit.slice(1, fileSplit.length-1)
            const importSubDirs = importSplit.slice(1, importSplit.length-1)
            const sameSubDirs = fileSubDirs.every((item, index) => item == importSubDirs[index])
            const sameNumDirsDiffer = fileSplit.length == importSplit.length && fileSplit[1] !== importSplit[1]
            if (fileHasMoreDirs || (moreSubDirs && sameNumDirsDiffer)) {
                newImportLine.str = '../' + importSplit.filter((item) => item !== dir).join('/')
            } else if (moreSubDirs && sameSubDirs) {
                newImportLine.str = './' + importSplit[importSplit.length-1]
            } else {
                newImportLine.str = './' + importSplit.filter((item) => item !== dir).join('/')
            }
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
 * @param {Bun.BuildOutput|BUN_BUILDOUTPUT} buildOutput bun build output
 */
async function _correctImports(buildOutput: Bun.BuildOutput | BUN_BUILDOUTPUT) {
    const files = _hewBuildArtifactFiles(buildOutput)
    const transpiler = new Bun.Transpiler()
    const prefix = data.options.noBundleHackImportPrefix
    files.forEach(async (file: string) => {
        await _digestImports(transpiler, file, prefix)
    })
}

async function resolveImports(buildOutput: Bun.BuildOutput | BUN_BUILDOUTPUT) {
    await _correctImports(buildOutput)
}

export default resolveImports
