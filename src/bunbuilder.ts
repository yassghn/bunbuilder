/**
 * bunbuilder.ts
 */

import util from 'api/util'
import config from 'api/config'

(async function () {

    function _bunbuilder() {
        util.greet()
        const conf = config.parse()
        console.dir(conf)
    }

    try {
        _bunbuilder()
    } catch (e) {
        console.error(e)
    }
    
})()
