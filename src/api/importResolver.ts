/**
 * importResolver.ts
 */

import data from '../../data/data.json' assert { type: 'json' }
import { sep } from 'node:path'
import { cwd } from 'node:process'

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
    const contents = await Bun.file(file).text()
    const newContents = { str: null as unknown as string }
    const newImportLine = { str: '' }
    const imports = transpiler.scanImports(contents)
    imports.forEach((bunImport: Bun.Import) => {
        if (bunImport.kind == 'import-statement' && bunImport.path.startsWith(prefix)) {
            newImportLine.str = _prefixReplace(bunImport.path)
            newImportLine.str = _addJsExtension(newImportLine.str)
            newContents.str = contents.replace(bunImport.path, newImportLine.str)
        }
    })
    if (newContents.str !== null) {
        await Bun.write(file, newContents.str)
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