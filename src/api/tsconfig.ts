/**
 * tsconfig.js
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/tsconfig
 * @property {bunbuilder.module:bunbuilder/api/tsconfig} tsconfig hew tsconfig json as object
 */

import data from '../../data/data.json' assert { type: 'json' }
import { readFileSync } from 'node:fs'
import { sep } from 'node:path'

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/tsconfig
 * @type {TSCONFIG_COMP_OPS}
 * @typedef {object} TSCONFIG_COMP_OPS tsconfig.json compilerOptions
 * @property {string} baseUrl tsconfig.json compilerOptions baseUrl
 * @property {object} paths tsconfig.json compilerOptions paths
 */
interface TSCONFIG_COMP_OPS {
    baseUrl: string
    paths: object
}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/tsconfig
 * @type {TSCONFIG}
 * @typedef {object} TSCONFIG tsconfig.json js object
 * @property {TSCONFIG_COMP_OPS} compilerOptions tsconfig.json compilerOptions
 */
interface TSCONFIG {
    compilerOptions: TSCONFIG_COMP_OPS
}

/**
 * hew tsconfig.json path
 *
 * @returns {string} path to tsconfig.json
 */
function _hewTsConfigPath(): string {
    const name = data.options.tsconfigName
    const path = '.' + sep + name
    return path
}

/**
 * filter comments from tsconfig.json
 *
 * @param {string} data unfiltered tsconfig.json
 * @returns {string} tsconfig.json with all comments filtered out
 */
function _filterComments(data: string): string {
    const regex = /\\"|"(?:\\"|[^"])*"|(\/\/.*)/g
    const filteredData = data.replace(regex, (m, g) => (g ? '' : m))
    return filteredData
}

/**
 * hew tsconfig.json as js object
 *
 * @returns {TSCONFIG} tsconfig.json js object
 */
function _hewTsConfig(): TSCONFIG {
    const path = _hewTsConfigPath()
    const data = readFileSync(path, 'utf-8')
    const filteredData = _filterComments(data)
    const tsConfig = JSON.parse(filteredData)
    return tsConfig
}

/**
 * hew baseUrl from tsconfig.json
 *
 * @returns {string} string containing tsconfig.json compilerOptions.baseUrl
 */
function _hewBaseUrl(): string {
    const tsconfig = _hewTsConfig() as TSCONFIG
    const baseUrl = tsconfig.compilerOptions.baseUrl
    return baseUrl
}

/**
 * hew paths from tsconfig.json
 *
 * @returns {object} object containing tsconfig.json compierOptions.paths
 */
function _hewTsConfigPaths(): object {
    const tsconfig = _hewTsConfig() as TSCONFIG
    const paths = tsconfig.compilerOptions.paths
    return paths
}

function hewTsConfigPaths(): object {
    return _hewTsConfigPaths()
}

function hewBaseUrl(): string {
    return _hewBaseUrl()
}

export { hewBaseUrl, hewTsConfigPaths }
