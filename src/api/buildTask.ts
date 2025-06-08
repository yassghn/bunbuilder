/**
 * buildTask.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/buildTask
 * @property {bunbuilder.module:bunbuilder/api/buildTask} buildTask build tasks
 */

import buildConfig from './buildConfig'
import data from '../../data/data.json' assert { type: 'json' }
import { cp, existsSync, mkdirSync } from 'node:fs'
import { sep } from 'node:path'
import { cwd } from 'node:process'
import verbose from './verbose'

/**
 * generic copy file
 *
 * @param {string} file file to copy
 * @param {string} dest destinatin directory
 */
function _copyFile(dir: string, file: string, dest: string) {
    const out = dest + sep + file
    const src = dir + sep + file
    const options = { recursive: true }
    cp(src, out, options, (err: any) => {
        if (err) throw err
    })
}

/**
 * create build destination directory if it does not exist
 *
 * @param {string} dest build destination directory
 */
function _makeDestDir(dest: string) {
    if (!existsSync(dest)) {
        mkdirSync(dest)
    }
}

/**
 * hew a bun build plugin which produces verbose build output
 *
 * @param {string} dest build destination
 * @returns {Bun.BunPlugin} verbose build output plugin
 */
function _hewVerboseBuildPlugin(dest: string): Bun.BunPlugin {
    const plugin: Bun.BunPlugin = {
        name: 'verbose build output plugin',
        setup(build: Bun.PluginBuilder) {
            // get current directory name
            const dir = cwd().split(sep).pop() as unknown as string
            build.onLoad({ filter: /\.ts/, namespace: 'file' }, (args) => {
                // get relative path
                const path = args.path
                const index = path.indexOf(dir)
                const relPath = path.substring(index, path.length).replace(dir, '.')
                verbose.compile(relPath, dest)
                return undefined
            })
        }
    }
    return plugin
}

/**
 * hew a bun build configuration object
 *
 * @param {string[]} files source files
 * @param {string} dest build destination directory
 * @returns {Bun.BuildConfig} bun build configuration object
 */
function _hewBrowserBuildConfig(files: string[], dest: string): Bun.BuildConfig {
    const bundleImports = data.buildTargets.browser.buildOptions.bundleImports
    const packages = bundleImports ? 'bundle' : 'external'
    const verbosePlugin = _hewVerboseBuildPlugin(dest)
    const config: Bun.BuildConfig = {
        entrypoints: [...files],
        outdir: dest + sep + 'js',
        target: 'browser',
        format: 'esm',
        packages: packages,
        splitting: false,
        plugins: [verbosePlugin]
    }
    return config
}

/**
 * browser compile target
 *
 * @param {string} dir root source file directory
 * @param {string[]} files source files
 * @param {string} dest build destination directory
 */
function _compileTargetBrowser(dir: string, files: string[], dest: string) {
    const src = { files: [] as string[] }
    files.forEach((file: string) => {
        src.files.push(dir + sep + file)
    })
    const buildConfig = _hewBrowserBuildConfig(src.files, dest)
    return Bun.build(buildConfig)
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
 * @param {string} fileContents build artifact file contents
 * @returns {string} file contents with relative path import prefix
 */
function _prefixReplace(fileContents: string): string {
    const prefix = data.options.noBundleHackImportPrefix
    const regexStr = `"${prefix}`
    const regex = new RegExp(regexStr, 'gim')
    const newContents = fileContents.replaceAll(regex, '"./')
    return newContents
}

/**
 * bun no bundle hack: add missing js extensions
 *
 * @param {string} fileContents build artifact file contents
 * @returns {string} file contents with added js extensions
 */
function _addJsExtension(fileContents: string): string {
    const regex = /(?<=from\s"\.\/[\S].*)(?<!\.js)"/gim
    const newContents = fileContents.replaceAll(regex, '.js"')
    return newContents
}

/**
 * bun no bundle hack: correct import statements for browser target
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 */
function _correctImports(buildOutput: Bun.BuildOutput) {
    const files = _hewBuildArtifactFiles(buildOutput)
    files.forEach(async (file: string) => {
        const contents = await Bun.file(file).text()
        const newContents = { str: '' }
        newContents.str = _prefixReplace(contents)
        newContents.str = _addJsExtension(newContents.str)
        await Bun.write(file, newContents.str)
    })
}

/**
 * post process bun build artifacts
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 */
function _digestBuildArtifacts(buildOutput: Bun.BuildOutput) {
    const config = buildConfig.state
    if (config.options.noBundleHack) {
        _correctImports(buildOutput)
    }
}

/**
 * post process bun build output
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 */
function _digestBuildOutput(buildOutput: Bun.BuildOutput) {
    verbose.buildResult(buildOutput.success)
    _digestBuildArtifacts(buildOutput)
}

/**
 * infer compilation method based on bunbuilder configuration target
 *
 * @param {string} dir root source file directory
 * @param {string[]} files source files
 * @param {string} dest build destination directory
 */
function _compile(dir: string, files: string[], dest: string) {
    const config = buildConfig.state
    const targets = data.buildTargets
    switch (config.target) {
        case targets.browser.name:
            _compileTargetBrowser(dir, files, dest).then((buildOutput) => {
                _digestBuildOutput(buildOutput)
            })
            break
    }
}

const buildTask = {
    copyFile: (dir: string, file: string, dest: string) => {
        _copyFile(dir, file, dest)
    },

    makeDestDir: (dest: string) => {
        _makeDestDir(dest)
    },

    compile: (dir: string, files: string[], dest: string) => {
        _compile(dir, files, dest)
    }
}

export default buildTask
