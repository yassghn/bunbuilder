/**
 * types.ts
 */

/**
 * @typedef {object} PARSED_ARGS
 * @type {PARSED_ARGS} parsed cli arguments
 * @property {object} values cli arguments
 * @property {string[]} positionals positional cli aruments
 */
interface PARSED_ARGS {
    values: object
    positionals: string[]
}

/**
 * @typedef {object} ACTIONS
 * @type {ACTIONS} action plan actions
 * @property {boolean} [build] build flag
 * @property {boolean} [watch] watch flag
 * @property {boolean} [serve] serve flag
 * @property {boolean} [clean] clean flag
 * @property {boolean} [help] help flag
 */
type ACTIONS = {
    build?: boolean
    watch?: boolean
    serve?: boolean
    clean?: boolean
    help?: boolean
}

/**
 * @typedef {object} ACTION_PLAN
 * @type {ACTION_PLAN} bunbuilder action plan
 * @property {object} actions bunbuilder actions
 * @property {string[]} [files] individual files for actions
 */
interface ACTION_PLAN {
    actions: ACTIONS
    files: string[] | undefined
}

const ACTION = {
    build: 'build',
    watch: 'watch',
    serve: 'serve',
    clean: 'clean',
    help: 'help'
}

/**
 * @typedef {string} BUILD_TARGET
 * @type {BUILD_TARGET} bunbuilder build target
 */
type BUILD_TARGET = 'browser' | 'OTHER_UNCONFIGURED_TARGETS'

/**
 * @typedef {object} TARGET_OPTIONS
 * @type {TARGET_OPTIONS} generic bunbuilder target options
 * @property {string[]} input input files/folders for build
 * @property {string} output output directory
 */
interface TARGET_OPTIONS {
    input: string[]
    output: string
}

/**
 * @typedef {object} BROWSER_TARGET_OPTIONS
 * @type {BROWSER_TARGET_OPTIONS} browser specific build options
 * @property {boolean} singlePage single page web application flag
 */
interface BROWSER_TARGET_OPTIONS extends TARGET_OPTIONS {
    singlePage: boolean
}

/**
 * @typedef {object} BUNBUILDER_CONFIG
 * @type {BUNBUILDER_CONFIG} bunbuilder configuration
 * @property {BUILD_TARGET} target build target
 * @property {BROWSER_TARGET_OPTIONS | 'OTHER_UNCONFIGURED_TARGETS'} options build target options
 */
interface BUNBUILDER_CONFIG {
    target: BUILD_TARGET
    options: BROWSER_TARGET_OPTIONS | 'OTHER_UNCONFIGURED_TARGETS'
}

export type { PARSED_ARGS, ACTIONS, ACTION_PLAN, BUILD_TARGET, BROWSER_TARGET_OPTIONS, BUNBUILDER_CONFIG }
export { ACTION }
