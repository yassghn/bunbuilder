/**
 * bunbuilder.ts
 */

import util from 'api/util'
import config from 'api/config'
import cli from 'api/cli'
import action from 'api/action'
import buildConfig from 'api/buildConfig'
import type { ACTION_PLAN, BUNBUILDER_CONFIG } from 'api/types'
import osEvents from 'api/osEvents'

(async function () {

    /**
     * parse config and add to buildConfig state
     */
    function _parseConfig() {
        const conf: BUNBUILDER_CONFIG = config.parse()
        buildConfig.state = conf
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
