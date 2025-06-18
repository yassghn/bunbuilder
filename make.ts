/**
 * make.ts
 *
 * @module make.module:make
 * @property {make.module:make} make build bunbuilder
 */

import { styleText } from 'node:util'
import { stdout } from 'node:process'

/**
 * @memberof make.module:make
 * @type {ECHO_OPTIONS}
 * @typedef {object} ECHO_OPTIONS options for echo
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
     * @memberof make.module:make
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
     * @memberof make.module:make
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
     * hew bun build config
     *
     * @memberof make.module:make
     * @returns {Bun.BuildConfig} bun build configuration object
     */
    function _hewBuildConfig(): Bun.BuildConfig {
        const options: Bun.BuildConfig = {
            entrypoints: ['./src/bunbuilder.ts'],
            outdir: './bin',
            target: 'bun',
            naming: '[dir]/bunbuilder.[ext]',
            packages: 'external'
        }
        return options
    }

    /**
     * build bunbuilder
     *
     * @memberof make.module:make
     * @returns {Promise<Bun.BuildOutput>} bun build output
     */
    async function _build(): Promise<Bun.BuildOutput> {
        // get build config
        const config = _hewBuildConfig()
        // build
        const output = await Bun.build(config)

        return output
    }

    /**
     * process build result
     *
     * @memberof make.module:make
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
     *
     * @memberof make.module:make
     */
    async function _startBuild() {
        const output = await _build()
        _processBuildResult(output)
    }

    // start build
    await _startBuild()

})()
