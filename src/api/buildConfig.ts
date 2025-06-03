/**
 * buildConfig.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/buildConfig
 * @property {bunbuilder.module:bunbuilder/api/buildConfig} buildConfig bunbuilder configuration storage
 */

import type { BUNBUILDER_CONFIG } from './types'

/**
 * @typedef {object} BUNBUILDER_CONFIG_STATE
 * @type {BUNBUILDER_CONFIG_STATE} bunbuilder configuration storage
 * @property {BUNBUILDER_CONFIG|null} config bunbuilder configuration
 */
interface BUNBUILDER_CONFIG_STATE {
    config: BUNBUILDER_CONFIG | null
}

const _state: BUNBUILDER_CONFIG_STATE = {
    config: null
}

/**
 * store bunbuilder configuration
 *
 * @param {BUNBUILDER_CONFIG} config bunbuilder configuration
 */
function _setState(config: BUNBUILDER_CONFIG) {
    _state.config = { ...config }
}

/**
 * get bunbuilder configuration
 *
 * @returns {BUNBUILDER_CONFIG} bunbuilder configuration object
 */
function _getState(): BUNBUILDER_CONFIG {
    if (_state.config == null) {
        throw new Error('bunbuilder config state was not set')
    } else {
        return _state.config
    }
}

const buildConfig = {
    set state(config: BUNBUILDER_CONFIG) {
        _setState(config)
    },

    get state(): BUNBUILDER_CONFIG {
        return _getState()
    }
}

export default buildConfig
