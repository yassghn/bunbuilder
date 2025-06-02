/**
 * action.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/action
 * @property {bunbuilder.module:bunbuilder/api/action}
 */

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
 * process action type
 *
 * @param {string} action action to invoke
 */
async function _processAction(action: string, config: BUNBUILDER_CONFIG) {
    switch (action) {
        case ACTION.build:
            console.log(action)
            console.dir(config)
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
        await _processAction(action, config)
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
