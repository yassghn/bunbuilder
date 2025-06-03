/**
 * bunbuilder.ts
 */

import util from 'api/util'
import config from 'api/config'
import cli from 'api/cli'
import action from 'api/action'
import buildConfig from 'api/buildConfig'
import type { ACTION_PLAN, BUNBUILDER_CONFIG } from 'api/types'

(async function () {

    async function _bunbuilder() {
        const conf: BUNBUILDER_CONFIG = config.parse()
        const actionPlan: ACTION_PLAN = cli.argsParse()
        util.greet()
        buildConfig.state = conf
        await action.start(actionPlan)
    }

    try {
        await _bunbuilder()
    } catch (e: any) {
        console.error(e.message)
    }

})()
