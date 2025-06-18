/**
 * types.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/types
 * @property {bunbuilder.module:bunbuilder/api/types} types typescript types
 */

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {PARSED_ARGS}
 * @typedef {object} PARSED_ARGS parsed cli arguments
 * @property {boolean} [build] build flag
 * @property {boolean} [watch] watch flag
 * @property {boolean} [serve] serve flag
 * @property {boolean} [clean] clean flag
 * @property {boolean} [verbose] verbose flag
 * @property {boolean} [help] help flag
 */
interface PARSED_ARGS {
    build?: boolean
    watch?: boolean
    serve?: boolean
    clean?: boolean
    verbose?: boolean
    help?: boolean
}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {ACTIONS}
 * @typedef {PARSED_ARGS} ACTIONS action plan actions
 */
interface ACTIONS extends PARSED_ARGS {}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {ACTION_PLAN}
 * @typedef {object} ACTION_PLAN bunbuilder action plan
 * @property {object} actions bunbuilder actions
 */
interface ACTION_PLAN {
    actions: ACTIONS
}

const ACTION = {
    build: 'build',
    watch: 'watch',
    serve: 'serve',
    clean: 'clean',
    help: 'help'
}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BUILD_TARGET}
 * @typedef {string} BUILD_TARGET bunbuilder build target
 */
type BUILD_TARGET = 'browser' | 'OTHER_UNCONFIGURED_TARGETS'

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BROWSER_BUILD_OPS}
 * @typedef {string} BROWSER_BUILD_OPS browser target build operations
 */
type BROWSER_BUILD_OPS = 'copy' | 'compile'

type OTHER_UNCONFIGURED_BUILD_OPS = ''

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BUILD_OPS}
 * @typedef {string} BUILD_OPS build operations aggregate
 */
type BUILD_OPS = BROWSER_BUILD_OPS | OTHER_UNCONFIGURED_BUILD_OPS

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {OP_MAP}
 * @typedef {object} OP_MAP map build operations to extensions
 * @property {string} ext file extension
 * @property {BUILD_OPS} op build operation
 */
interface OP_MAP {
    ext: string
    op: BUILD_OPS
}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BROWSER_BUILD_OP_MAP}
 * @typedef {OP_MAP} BROWSER_BUILD_OP_MAP browser target build operation per extension
 */
interface BROWSER_BUILD_OP_MAP extends OP_MAP {}

interface OTHER_UNCONFIGURED_BUILD_OP_MAP extends OP_MAP {}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BUILD_OP_MAP}
 * @typedef {OP_MAP} BUILD_OP_MAP build operations map aggregate
 */
type BUILD_OP_MAP = BROWSER_BUILD_OP_MAP | OTHER_UNCONFIGURED_BUILD_OP_MAP

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {TARGET_OPTIONS}
 * @typedef {object} TARGET_OPTIONS generic bunbuilder target options
 * @property {string[]} inputs input files/folders for build
 * @property {string} outdir output directory
 * @property {string[]} resources application resources
 */
interface TARGET_OPTIONS {
    noBundleHack: boolean
    inputs: string[]
    outdir: string
    resources: string[]
}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BROWSER_TARGET_OPTIONS}
 * @typedef {object} BROWSER_TARGET_OPTIONS browser specific build options
 * @property {boolean} singlePage single page web application flag
 */
interface BROWSER_TARGET_OPTIONS extends TARGET_OPTIONS {
    singlePage: boolean
}

interface OTHER_UNCONFIGURED_TARGET_OPTIONS extends TARGET_OPTIONS {}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BUILD_TARGET_OPTIONS}
 * @typedef {object} BUILD_TARGET_OPTIONS build target specific options
 */
type BUILD_TARGET_OPTIONS = BROWSER_TARGET_OPTIONS | OTHER_UNCONFIGURED_TARGET_OPTIONS

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {BUNBUILDER_CONFIG}
 * @typedef {object} BUNBUILDER_CONFIG bunbuilder configuration
 * @property {BUILD_TARGET} target build target
 * @property {BUILD_TARGET_OPTIONS} options build target options
 */
interface BUNBUILDER_CONFIG {
    target: BUILD_TARGET
    options: BUILD_TARGET_OPTIONS
}

/**
 * @memberof bunbuilder/api.module:bunbuilder/api/types
 * @type {HELP_STRING}
 * @typedef {object} HELP_STRING help output string
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
