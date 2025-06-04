/**
 * serve.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/serve
 * @property {bunbuilder.module:bunbuilder/api/serve}
 */

import buildConfig from './buildConfig'
import data from '../../data/data.json' assert { type: 'json' }
import serveStatic from 'serve-static-bun'

function _startServe() {
    const config = buildConfig.state
    const port = data.options.servePort
    Bun.serve({
        port: port,
        fetch: serveStatic(config.options.output)
    })
}

const serve = {
    start: () => {
        _startServe()
    }
}

export default serve
