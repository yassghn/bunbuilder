/**
 * action.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/action
 * @property {bunbuilder.module:bunbuilder/api/action}
 */

import type { ACTION_PLAN, BUNBUILDER_CONFIG } from './types'

function _start(actionPlan: ACTION_PLAN, config: BUNBUILDER_CONFIG) {

}

const action = {
    start: (actionPlan: ACTION_PLAN, config: BUNBUILDER_CONFIG) => {
        _start(actionPlan, config)
    }
}

export default action
