/**
 * options.ts
 */

import type { Target } from 'bun'

interface BUILD_OPTIONS {
    entry: string
    outdir: string
    target: Target
    name: string
}

function hewOptions() {
    const options: BUILD_OPTIONS = {
        entry: './index.ts',
        outdir: './bin',
        target: 'bun',
        name: '[dir]/bunbuilder.[ext]'
    }
    return options
}

export default hewOptions
export type { BUILD_OPTIONS }