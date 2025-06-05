/**
 * make.ts
 */

import type { Target } from 'bun'
import { styleText } from 'node:util'
import { stdout } from 'node:process'

/**
 * @typedef BUILD_OPTIONS
 * @type {BUILD_OPTIONS} object
 * @param entry main module
 * @param outdir output directory
 * @param target intended execution environment
 * @param name customized generated file name
 */
interface BUILD_OPTIONS {
    entry: string
    outdir: string
    target: Target
    name: string
}

/**
 * @typedef {object} ECHO_OPTIONS
 * @type {ECHO_OPTIONS} options for echo
 * @property {boolean} newLine add new line flag
 * @property {string} color color
 */
interface ECHO_OPTIONS {
    newLine?: boolean | undefined
    color?: any | undefined
}

(async function () {
    /**
     * add echo options to string
     *
     * @param {string} str string to add echo options to
     * @param {ECHO_OPTIONS} [options=undefined] echo options
     * @returns {string} optionated string
     */
    function _addEchoOptions(str: string, options: ECHO_OPTIONS): string {
        // copy output string
        const output = { str: str.valueOf() }
        // apply color if specified
        if (options.color) {
            output.str = styleText(options.color, str, { stream: stdout, validateStream: true })
        }
        // add new line if specified
        if (options.newLine) {
            output.str += '\n'
        }
        // return new string
        return output.str
    }

    /**
     * write str to stdout
     *
     * @param {string} str string to write
     * @param {ECHO_OPTIONS} [options=undefined] echo options
     */
    async function _echo(str: string, options: ECHO_OPTIONS | undefined = undefined) {
        // copy output string
        const output = { str: str.valueOf() }
        // process options
        if (options) {
            output.str = _addEchoOptions(str, options)
        }
        // write to stdout
        await Bun.write(Bun.stdout, output.str)
    }

    /**
     * build options
     *
     * @returns {BUILD_OPTIONS} build options
     */
    function hewOptions() {
        const options: BUILD_OPTIONS = {
            entry: './src/bunbuilder.ts',
            outdir: './bin',
            target: 'bun',
            name: '[dir]/bunbuilder.[ext]'
        }
        return options
    }

    /**
     * build bunbuilder
     *
     * @returns {Promise<Bun.BuildOutput>} bun build output
     */
    async function _build(): Promise<Bun.BuildOutput> {
        // get build options
        const options = hewOptions()
        // build
        const output = await Bun.build({
            entrypoints: [options.entry],
            outdir: options.outdir,
            target: options.target,
            naming: options.name
        })

        return output
    }

    /**
     * process build result
     *
     * @param {Bun.BuildOutput} output
     */
    function _processBuildResult(output: Bun.BuildOutput) {
        const success = output.success
        switch (success) {
            case true:
                _echo('build success', { color: 'green' })
                break
            case false:
                _echo('build failed', { color: 'red' })
                break
        }
    }

    /**
     * start build and process output
     */
    async function _startBuild() {
        const output = await _build()
        _processBuildResult(output)
    }

    // start build
    await _startBuild()

})()
