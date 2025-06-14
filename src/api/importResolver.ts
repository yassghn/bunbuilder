/**
 * importResolver.ts
 */

import data from '../../data/data.json' assert { type: 'json' }
import { readFileSync } from 'node:fs'
import { sep } from 'node:path'
import { cwd } from 'node:process'

/**
 * @typedef {object} TSCONFIG_COMP_OPS
 * @type {TSCONFIG_COMP_OPS} tsconfig.json compilerOptions
 * @property {object} paths tsconfig.json compilerOptions paths
 */
interface TSCONFIG_COMP_OPS {
    paths: object
}

/**
 * @typedef {object} TSCONFIG
 * @type {TSCONFIG} tsconfig.json js object
 * @property {TSCONFIG_COMP_OPS} compilerOptions tsconfig.json compilerOptions
 */
interface TSCONFIG {
    compilerOptions: TSCONFIG_COMP_OPS
}

/**
 * hew tsconfig.json path
 *
 * @returns {string} path to tsconfig.json
 */
function _hewTsConfigPath(): string {
    const name = data.options.tsconfigName
    const path = '.' + sep + name
    return path
}

/**
 * filter comments from tsconfig.json
 *
 * @param {string} data unfiltered tsconfig.json
 * @returns {string} tsconfig.json with all comments filtered out
 */
function _filterComments(data: string): string {
    const regex = /\\"|"(?:\\"|[^"])*"|(\/\/.*)/g
    const filteredData = data.replace(regex, (m, g) => (g ? '' : m))
    return filteredData
}

/**
 * hew tsconfig.json as js object
 *
 * @returns {TSCONFIG} tsconfig.json js object
 */
function _hewTsConfig(): TSCONFIG {
    const path = _hewTsConfigPath()
    const data = readFileSync(path, 'utf-8')
    const filteredData = _filterComments(data)
    const tsConfig = JSON.parse(filteredData)
    return tsConfig
}

/**
 * hew paths from tsconfig.json
 *
 * @returns {object} object containing tsconfig.json compierOptions.paths
 */
function _hewTsConfigPaths(): object {
    const tsconfig = _hewTsConfig() as TSCONFIG
    const paths = tsconfig.compilerOptions.paths
    return paths
}

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
 * bun no bundle hack: replace preconfigured prefix with relative path prefix
 *
 * @param {string} importString build artifact import string
 * @returns {string} import string with relative path import prefix
 */
function _prefixReplace(importString: string): string {
    const prefix = data.options.noBundleHackImportPrefix
    const newImportString = importString.replace(prefix, './')
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
            newImportLine.str = _prefixReplace(bunImport.path)
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
    const paths = _hewTsConfigPaths()
    console.dir(paths)
    files.forEach(async (file: string) => {
        await _digestImports(transpiler, file, prefix)
    })
}

function resolveImports(buildOutput: Bun.BuildOutput) {
    _correctImports(buildOutput)
}

export default resolveImports
