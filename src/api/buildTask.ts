/**
 * buildTask.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/buildTask
 * @property {bunbuilder.module:bunbuilder/api/buildTask} buildTask build tasks
 */

import buildConfig from './buildConfig'
import verbose from './verbose'
import { hewBaseUrl } from './tsconfig'
import data from '../../data/data.json' assert { type: 'json' }
import { cp, existsSync, mkdirSync } from 'node:fs'
import { sep } from 'node:path'
import { cwd } from 'node:process'
import resolveImports from './importResolver'

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
 * bun.Build handles an array containing a single file differently. for some reason
 * it truncates the path. need to correct the path here.
 *
 * @param {string[]} files source files
 * @param {string} jsOutDirOpt preconfigured js output directory
 * @returns {string} corrected js output directory
 */
function _hewJsOutDir(files: string[], jsOutDirOpt: string): string {
    const jsOutDir = { str: '' }
    if (files.length > 1) {
        jsOutDir.str = jsOutDirOpt
    } else {
        if (files[0]) {
            // get subdirectories between file and preconfigured baseurl
            const fileArr = files[0].split(sep)
            const fileName = fileArr[fileArr.length - 1] as string
            const baseUrl = hewBaseUrl()
            const baseArr = baseUrl.split('/')
            const lastBase = baseArr[baseArr.length - 1] as string
            const index = fileArr.indexOf(lastBase) + 1
            const dirs = [] as string[]
            for (let i = index; i < fileArr.length; i++) {
                const p = fileArr[i]
                if (p && p !== fileName) {
                    dirs.push(p)
                }
            }
            jsOutDir.str = jsOutDirOpt + sep + dirs.join(sep)
        }
    }
    return jsOutDir.str
}

/**
 * hew a bun build configuration object
 *
 * @param {string[]} files source files
 * @param {string} dest build destination directory
 * @returns {Bun.BuildConfig} bun build configuration object
 */
function _hewBrowserBuildConfig(files: string[], dest: string): Bun.BuildConfig {
    const buildOptions = data.buildTargets.browser.buildOptions
    const jsOutDir = _hewJsOutDir(files, buildOptions.jsOutDir)
    const packages = buildOptions.bundleImports ? 'bundle' : 'external'
    const verbosePlugin = _hewVerboseBuildPlugin(dest)
    const config: Bun.BuildConfig = {
        entrypoints: [...files],
        outdir: dest + sep + jsOutDir,
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
 * @return {Promise<Bun.BuildOutput>} bun.build return promise
 */
function _compileTargetBrowser(
    dir: string,
    files: string[],
    dest: string
): Promise<Bun.BuildOutput> {
    const src = { files: [] as string[] }
    files.forEach((file: string) => {
        src.files.push(dir + sep + file)
    })
    const buildConfig = _hewBrowserBuildConfig(src.files, dest)
    return Bun.build(buildConfig)
}

/**
 * post process bun build artifacts
 *
 * @param {Bun.BuildOutput} buildOutput bun build output
 */
function _digestBuildArtifacts(buildOutput: Bun.BuildOutput) {
    const config = buildConfig.obj
    if (config.options.noBundleHack) {
        resolveImports(buildOutput)
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
    const config = buildConfig.obj
    const targets = data.buildTargets
    switch (config.target) {
        case targets.browser.name:
            _compileTargetBrowser(dir, files, dest)
                .then((buildOutput) => {
                    _digestBuildOutput(buildOutput)
                })
                .catch((reason: any) => {
                    verbose.buildResult(false)
                    console.error(reason)
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
