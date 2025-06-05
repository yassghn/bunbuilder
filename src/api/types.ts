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
 * @property {boolean} [verbose] verbose flag
 * @property {boolean} [help] help flag
 */
type ACTIONS = {
    build?: boolean
    watch?: boolean
    serve?: boolean
    clean?: boolean
    verbose?: boolean
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
 * @typedef {string} BROWSER_BUILD_OPS
 * @type {BROWSER_BUILD_OPS} browser target build operations
 */
type BROWSER_BUILD_OPS = 'copy' | 'compile'

type OTHER_UNCONFIGURED_BUILD_OPS = ''

/**
 * @typedef {string} BUILD_OPS
 * @type {BUILD_OPS} build operations aggregate
 */
type BUILD_OPS = BROWSER_BUILD_OPS | OTHER_UNCONFIGURED_BUILD_OPS

/**
 * @typedef {object} OP_MAP
 * @type {OP_MAP} map build operations to extensions
 * @property {string} ext file extension
 * @property {BUILD_OPS} op build operation
 */
interface OP_MAP {
    ext: string
    op: BUILD_OPS
}

/**
 * @typedef {OP_MAP} BROWSER_BUILD_OP_MAP
 * @type {BROWSER_BUILD_OP_MAP} browser target build operation per extension
 */
interface BROWSER_BUILD_OP_MAP extends OP_MAP {}

interface OTHER_UNCONFIGURED_BUILD_OP_MAP extends OP_MAP {}

/**
 * @typedef {OP_MAP} BUILD_OP_MAP
 * @type {BUILD_OP_MAP} build operations map aggregate
 */
type BUILD_OP_MAP = BROWSER_BUILD_OP_MAP | OTHER_UNCONFIGURED_BUILD_OP_MAP

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

interface OTHER_UNCONFIGURED_TARGET_OPTIONS extends TARGET_OPTIONS {}

/**
 * @typedef {object} BUILD_TARGET_OPTIONS
 * @type {BUILD_TARGET_OPTIONS} build target specific options
 */
type BUILD_TARGET_OPTIONS = BROWSER_TARGET_OPTIONS | OTHER_UNCONFIGURED_TARGET_OPTIONS

/**
 * @typedef {object} BUNBUILDER_CONFIG
 * @type {BUNBUILDER_CONFIG} bunbuilder configuration
 * @property {BUILD_TARGET} target build target
 * @property {BUILD_TARGET_OPTIONS} options build target options
 */
interface BUNBUILDER_CONFIG {
    target: BUILD_TARGET
    options: BUILD_TARGET_OPTIONS
}

/**
 * @typedef {object} HELP_STRING
 * @type {HELP_STRING} help output string
 * @property {string} label help output section label
 * @property {string} str help output section
 */
interface HELP_STRING {
    label: string
    str: string
}

export type {
    PARSED_ARGS,
    ACTIONS,
    ACTION_PLAN,
    BUILD_TARGET,
    BROWSER_BUILD_OPS,
    BUILD_OPS,
    OP_MAP,
    BROWSER_BUILD_OP_MAP,
    BUILD_OP_MAP,
    TARGET_OPTIONS,
    BROWSER_TARGET_OPTIONS,
    BUILD_TARGET_OPTIONS,
    BUNBUILDER_CONFIG,
    HELP_STRING
}
export { ACTION }
