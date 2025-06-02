/**
 * config.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/config
 * @property {bunbuilder.module:bunbuilder/api/config} config configuration file processing
 */

import data from '../../data/data.json' assert { type: 'json' }
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
 * @returns {object|null} config object
 */
function _importConfig(): object | null {
    const configPath = _hewConfigPath()
    const data = readFileSync(configPath, 'utf-8')
    const config = JSON.parse(data)
    return config
}

/**
 * parse configuration file
 *
 * @returns {object|null} config object
 */
function _parse(): object | null {
    const config = _importConfig()
    return config
}

const config = {
    parse: (): object | null => {
        return _parse()
    }
}

export default config
