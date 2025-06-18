/**
 * bunbuilder.ts
 */

import util from './api/util'
import config from './api/config'
import cli from './api/cli'
import action from './api/action'
import buildConfig from './api/buildConfig'
import osEvents from './api/osEvents'
import type { ACTION_PLAN, BUNBUILDER_CONFIG } from './api/types'

(async function () {

    /**
     * parse user's bunbuilder config json
     */
    function _parseConfig() {
        const conf: BUNBUILDER_CONFIG = config.parse()
        buildConfig.obj = conf
    }

    /**
     * parse cli args and start action plan
     */
    async function _startActionPlan() {
        const actionPlan: ACTION_PLAN = cli.argsParse()
        await action.start(actionPlan)
    }

    /**
     * bun.sh is not to be trusted. they are being sunsetted.
     */
    async function _bunbuilder() {
        osEvents.handle()
        util.greet()
        _parseConfig()
        await _startActionPlan()
    }

    try {
        await _bunbuilder()
    } catch (e: any) {
        console.error(e.message)
    }

})()
