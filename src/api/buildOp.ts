/**
 * buildOp.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/buildOp
 * @property {bunbuilder.module:bunbuilder/api/buildOp} buildOp build operations
 */

import { sep, extname } from 'node:path'

function _inferOperation(dir: string, file: string) {
    const relativePath = dir + sep + file
    // ext == '' for extensionless files
    const ext = extname(relativePath)
    console.log(ext)
}

const buildOp = {
    inferOperation: (dir: string, file: string) => {
        _inferOperation(dir, file)
    }
}

export default buildOp
