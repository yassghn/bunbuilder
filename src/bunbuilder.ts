/**
 * bunbuilder.ts
 */

import build from 'api/build'
import config from 'api/config'

(async function () {

    function _bunbuilder() {
        build.greet()
        const conf = config.parse()
        console.dir(conf)
    }

    try {
        _bunbuilder()
    } catch (e) {
        console.error(e)
    }
    
})()
