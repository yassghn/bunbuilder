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
 * @typedef {object} ACTION_PLAN
 * @type {ACTION_PLAN} bunbuilder action plan
 * @property {object} actions bunbuilder actions
 * @property {string[]} files individual files for actions
 */
interface ACTION_PLAN {
    actions: object
    files: string[] | undefined
}

export type { PARSED_ARGS, ACTION_PLAN }
