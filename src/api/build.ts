/**
 * build.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/build
 * @property {bunbuilder.module:bunbuilder/api/build} build build application
 */

import type { BUNBUILDER_CONFIG } from './types'

function _buildAll(config: BUNBUILDER_CONFIG) {
    console.dir(config)
}

const build = {

    all: (config: BUNBUILDER_CONFIG) => {
        _buildAll(config)
    }

}

export default build
