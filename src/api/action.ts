/**
 * action.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/action
 * @property {bunbuilder.module:bunbuilder/api/action} action invoke bunbuilder actions
 */

import build from './build'
import buildConfig from './buildConfig'
import clean from './clean'
import serve from './serve'
import util from './util'
import verbose from './verbose'
import watch from './watch'
import { ACTION } from './types'
import type { ACTION_PLAN } from './types'

/**
 * invoke help action
 */
async function _takeActionHelp() {
    await util.printHelp()
}

/**
 * invoke build action
 */
function _takeActionBuild() {
    build.all()
}

/**
 * invoke clean action
 */
function _takeActionClean() {
    clean.outdir()
}

/**
 * invoke serve action
 */
function _takeActionServe() {
    serve.start()
}

/**
 * invoke watch action
 */
function _takeActionWatch() {
    watch.start()
}

/**
 * process action type
 *
 * @param {string} action action to invoke
 */
async function _digestAction(action: string) {
    switch (action) {
        case ACTION.build:
            verbose.buildStart()
            _takeActionBuild()
            break
        case ACTION.clean:
            _takeActionClean()
            break
        case ACTION.serve:
            _takeActionServe()
            break
        case ACTION.watch:
            _takeActionWatch()
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
async function _digestActions(actionPlan: ACTION_PLAN) {
    for (const action in actionPlan.actions) {
        await _digestAction(action)
    }
}

/**
 * enable verbose if flag is set, filter out from action plan
 *
 * @param {ACTION_PLAN} actionPlan bunbuilder action plan
 */
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
    await _digestActions(actionPlan)
}

const action = {
    start: async (actionPlan: ACTION_PLAN) => {
        await _start(actionPlan)
    }
}

export default action
