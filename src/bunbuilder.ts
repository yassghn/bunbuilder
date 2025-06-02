/**
 * bunbuilder.ts
 */

import util from 'api/util'
import config from 'api/config'
import cli from 'api/cli'
import action from 'api/actions'
import type { BUNBUILDER_CONFIG } from 'api/types'

(async function () {

    function _bunbuilder() {
        util.greet()
        const conf: BUNBUILDER_CONFIG = config.parse()
        console.log(typeof conf)
        console.dir(conf)
        const actionPlan = cli.argsParse()
        action.start(actionPlan, conf)
    }

    try {
        _bunbuilder()
    } catch (e) {
        console.error(e)
    }
    
})()
