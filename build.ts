/**
 * build.ts
 */

import hewOptions from 'options'

(async function () {

    async function _build() {
        // get build options
        const options = hewOptions()
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