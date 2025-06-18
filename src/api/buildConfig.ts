/**
 * buildConfig.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/buildConfig
 * @property {bunbuilder.module:bunbuilder/api/buildConfig} buildConfig bunbuilder configuration storage
 */

import type { BUNBUILDER_CONFIG } from './types'

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/buildConfig
 * @type {BUNBUILDER_CONFIG_STATE}
 * @typedef {object} BUNBUILDER_CONFIG_STATE bunbuilder configuration storage
 * @property {BUNBUILDER_CONFIG|null} config bunbuilder configuration
 */
interface BUNBUILDER_CONFIG_STATE {
    config: BUNBUILDER_CONFIG | null
    verbose: boolean
}

const _state: BUNBUILDER_CONFIG_STATE = {
    config: null,
    verbose: false
}

/**
 * store bunbuilder configuration
 *
 * @param {BUNBUILDER_CONFIG} config bunbuilder configuration
 */
function _setConfig(config: BUNBUILDER_CONFIG) {
    _state.config = { ...config }
}

/**
 * get bunbuilder configuration
 *
 * @returns {BUNBUILDER_CONFIG} bunbuilder configuration object
 */
function _getConfig(): BUNBUILDER_CONFIG {
    if (_state.config == null) {
        throw new Error('bunbuilder config state was not set')
    } else {
        return _state.config
    }
}

/**
 * set verbose flag for build configuration
 *
 * @param {boolean} value verbose flag
 */
function _setVerbose(value: boolean) {
    _state.verbose = value
}

/**
 * get verbose flag for build configuration
 *
 * @returns {boolean} verbose flag
 */
function _getVerbose(): boolean {
    return _state.verbose
}

const buildConfig = {
    set obj(config: BUNBUILDER_CONFIG) {
        _setConfig(config)
    },

    get obj(): BUNBUILDER_CONFIG {
        return _getConfig()
    },

    set verbose(value: boolean) {
        _setVerbose(value)
    },

    get verbose(): boolean {
        return _getVerbose()
    }
}

export default buildConfig
