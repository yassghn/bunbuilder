/**
 * serve.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/serve
 * @property {bunbuilder.module:bunbuilder/api/serve}
 */

import buildConfig from './buildConfig'
import shutdown from './shutdown'
import verbose from './verbose'
import data from '../../data/data.json' assert { type: 'json' }
import serveStatic from 'serve-static-bun'

/**
 * set bun httper server shutdown handling
 *
 * @param {Bun.Server} server bun http server
 */
function _setCloser(server: Bun.Server) {
    shutdown.server = server
}

/**
 * start http server
 */
function _startServe() {
    const config = buildConfig.obj
    const port = data.options.servePort
    const server: Bun.Server = Bun.serve({
        port: port,
        fetch: serveStatic(config.options.output)
    })
    _setCloser(server)
    verbose.serverStart(port)
}

const serve = {
    start: () => {
        _startServe()
    }
}

export default serve
