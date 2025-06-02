/**
 * config.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/config
 * @property {bunbuilder.module:bunbuilder/api/config} config configuration file processing
 */

import data from '../../data/data.json' assert { type: 'json' }
import type { BUNBUILDER_CONFIG } from 'api/types'
import { readFileSync } from 'node:fs'
import { cwd } from 'node:process'
import { sep } from 'node:path'

const defaults = {
    name: data.configFileName
}

/**
 * hew config file absolute path
 *
 * @returns {string} config absolute path
 */
function _hewConfigPath(): string {
    const absPath = cwd() + sep + defaults.name
    return absPath
}

/**
 * import config
 *
 * @returns {BUNBUILDER_CONFIG} config object
 */
function _importConfig(): BUNBUILDER_CONFIG {
    const configPath = _hewConfigPath()
    const data = readFileSync(configPath, 'utf-8')
    const config = JSON.parse(data)
    return config
}

/**
 * parse configuration file
 *
 * @returns {BUNBUILDER_CONFIG} config object
 */
function _parse(): BUNBUILDER_CONFIG {
    const config = _importConfig()
    return config
}

const config = {
    parse: (): BUNBUILDER_CONFIG => {
        return _parse()
    }
}

export default config
