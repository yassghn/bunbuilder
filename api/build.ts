/**
 * build.ts
 *
 * @memberof bunbuilder
 * @module bunbuilder/io
 * @property {bunbuilder.module:bunbuilder/build} io standard i/o
 */

import io from 'io'
import type { BUILD_OPTIONS } from 'types'

const build = {
    /**
     * build greeting: initial text
     */
    greet: () => {
        // init greeting
        const greeting = ['bunbuilder', 'greet']
        // stdout
        greeting.forEach((str) => io.echo(str))
    },

    buildAll: (options: BUILD_OPTIONS) => {
        console.log(options)
    }
}

export default build
