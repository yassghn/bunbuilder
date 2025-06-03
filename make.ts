/**
 * make.ts
 */

import io from 'api/io'
import type { Target } from 'bun'

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

(async function () {
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
                io.echo('build success', {color: 'green'})
                break
            case false:
                io.echo('build failed', {color: 'red'})
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
