/**
 * action.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/action
 * @property {bunbuilder.module:bunbuilder/api/action} action invoke bunbuilder actions
 */

import build from './build'
import buildConfig from './buildConfig'
import { ACTION } from './types'
import type { ACTION_PLAN } from './types'
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
 * @param {string[]} [files] individual files to build
 */
async function _takeActionBuild(files: string[] | undefined) {
    if (!files) {
        build.all()
    }
}

/**
 * process action type
 *
 * @param {string} action action to invoke
 * @param {string[]} [files] individual files to build
 */
async function _processAction(action: string, files: string[] | undefined) {
    switch (action) {
        case ACTION.build:
            _takeActionBuild(files)
            break
        case ACTION.clean:
            console.log(action)
            break
        case ACTION.serve:
            console.log(action)
            break
        case ACTION.watch:
            console.log(action)
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
async function _processActions(actionPlan: ACTION_PLAN) {
    for (const action in actionPlan.actions) {
        await _processAction(action, actionPlan.files)
    }
}

function _filterVerbose(actionPlan: ACTION_PLAN) {
    if (actionPlan.actions.verbose) {
        buildConfig.verbose = true
        delete actionPlan.actions.verbose
    }
}

/**
 * begin processing bunbuilder action plan with given configuration
 *
 * @param {ACTION_PLAN} actionPlan bunbuilder action plan
 */
async function _start(actionPlan: ACTION_PLAN) {
    _filterVerbose(actionPlan)
    await _processActions(actionPlan)
}

const action = {
    start: async (actionPlan: ACTION_PLAN) => {
        await _start(actionPlan)
    }
}

export default action
