/**
 * build.ts
 */

import type { Target } from "bun"

interface BUILD_OPTIONS {
    entry: string
    outdir: string
    target: Target,
    name: string
}

(async function () {

    function _hewOptions() {
        const options: BUILD_OPTIONS = {
            entry: './index.ts',
            outdir: './bin',
            target: 'bun',
            name: '[dir]/bunbuilder.[ext]'
        }
        return options
    }

    async function _build() {
        // get build options
        const options = _hewOptions()
        // build
        await Bun.build({
            entrypoints: [options.entry],
            outdir: options.outdir,
            target: options.target,
            naming: options.name
        })
    }

    _build()

})()