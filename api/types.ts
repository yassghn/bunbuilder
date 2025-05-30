/**
 * types.ts
 */

/**
 * @typedef IN_OPTIONS
 * @type {object} IN_OPTIONS build files input options
 * @property {string[]} src source directory
 * @property {string[]} ts typescript directory
 * @property {string[]} css css directory
 * @property {string[]} html html files
 */
interface IN_OPTIONS {
    src: string[]
    ts: string[]
    css: string[]
    html: string[]
}

/**
 * @typedef OUT_OPTIONS
 * @type {object} OUT_OPTIONS build output destinations
 * @property {string} dist distribution directory
 * @property {string} js javascript directory
 * @property {string} css css directory
 */
interface OUT_OPTIONS {
    dist: string
    js: string
    css: string
}

/**
 *
 */
interface WEB_BUILD_OPTIONS {
    in: IN_OPTIONS
    out: OUT_OPTIONS
}

interface BUILD_OPTIONS extends WEB_BUILD_OPTIONS {}

export type { BUILD_OPTIONS }