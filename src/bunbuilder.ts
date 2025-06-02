/**
 * bunbuilder.ts
 */

import util from 'api/util'
import config from 'api/config'
import cli from 'api/cli'
import action from 'api/action'
import type { ACTION_PLAN, BUNBUILDER_CONFIG } from 'api/types'

(async function () {

    function _bunbuilder() {
        const conf: BUNBUILDER_CONFIG = config.parse()
        const actionPlan: ACTION_PLAN = cli.argsParse()
        util.greet()
        action.start(actionPlan, conf)
    }

    try {
        _bunbuilder()
    } catch (e: any) {
        console.error(e.message)
    }
    
})()
