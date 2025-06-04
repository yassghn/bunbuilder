/**
 * serve.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/serve
 * @property {bunbuilder.module:bunbuilder/api/serve}
 */

import buildConfig from './buildConfig'
import serveStatic from 'serve-static-bun'

function _startServe() {
    const config = buildConfig.state
    Bun.serve({
        port: 3000,
        fetch: serveStatic(config.options.output)
    })
}

const serve = {
    start: () => {
        _startServe()
    }
}

export default serve
