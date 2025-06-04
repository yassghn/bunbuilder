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
    Bun.build({
        entrypoints: src.files,
        outdir: dest + sep + 'js'
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
            _compileTargetBrowser(dir, files, dest)
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
