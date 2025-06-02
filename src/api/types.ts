/**
 * types.ts
 */

interface PARSED_ARGS {
    values: object
    positionals: string[]
}

interface ACTION_PLAN {
    actions: object
    files: string[] | undefined
}

export type { PARSED_ARGS, ACTION_PLAN }
