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

function _digestBuildOutput(buildOutput: Bun.BuildOutput) {
    verbose.buildResult(buildOutput.success)
    const files = [] as unknown as string[]
    const dir = cwd().split(sep).pop() as unknown as string
    buildOutput.outputs.forEach((artifact) => {
        const index = artifact.path.indexOf(dir)
        const relPath = artifact.path.substring(index, artifact.path.length)
        files.push(relPath)
    })
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
