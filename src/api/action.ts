/**
 * action.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/action
 * @property {bunbuilder.module:bunbuilder/api/action}
 */

import build from './build'
import { ACTION } from './types'
import type { ACTION_PLAN, BUNBUILDER_CONFIG } from './types'
import util from './util'

/**
 * invoke help action
 */
async function _takeActionHelp() {
    await util.printHelp()
}

/**
 * invoke build action
 *
 * @param {BUNBUILDER_CONFIG} config bunbuilder configuration
 * @param {string[]} [files] individual files to build
 */
async function _takeActionBuild(config: BUNBUILDER_CONFIG, files: string[] | undefined) {
    if (!files) {
        build.all(config)
    }
}

/**
 * process action type
 *
 * @param {string} action action to invoke
 */
async function _processAction(action: string, config: BUNBUILDER_CONFIG, files: string[] | undefined) {
    switch (action) {
        case ACTION.build:
            _takeActionBuild(config, files)
            break
        case ACTION.clean:
            console.log(action)
            console.dir(config)
            break
        case ACTION.serve:
            console.log(action)
            console.dir(config)
            break
        case ACTION.watch:
            console.log(action)
            console.dir(config)
            break
        case ACTION.help:
            await _takeActionHelp()
            break
        default:
            await _takeActionHelp()
            break
    }
}

/**
 * process bunbuilder action plan
 *
 * @param {ACTION_PLAN} actionPlan bunbuilder actions to process
 */
async function _processActions(actionPlan: ACTION_PLAN, config: BUNBUILDER_CONFIG) {
    for (const action in actionPlan.actions) {
        await _processAction(action, config, actionPlan.files)
    }
}

/**
 * begin processing bunbuilder action plan with given configuration
 *
 * @param {ACTION_PLAN} actionPlan bunbuilder action plan
 * @param {BUNBUILDER_CONFIG} config bunbuilder configuration
 */
async function _start(actionPlan: ACTION_PLAN, config: BUNBUILDER_CONFIG) {
    await _processActions(actionPlan, config)
}

const action = {
    start: async (actionPlan: ACTION_PLAN, config: BUNBUILDER_CONFIG) => {
        await _start(actionPlan, config)
    }
}

export default action
