/**
 * obj.ts
 *
 * @memberof bunbuilder/api
 * @module bunbuilder/api/obj
 * @property {bunbuilder.module:bunbuilder/api/obj} obj js api object toolkit
 */

/**
 * return value of map key by key name
 *
 * @param {object} map string:string js object
 * @param {string} name object key
 * @returns {string} map key value
 */
function _getMapValueFromName(map: object, name: string): string {
    const index = Object.keys(map).indexOf(name)
    const value = Object.values(map)[index]
    return value
}

const obj = {
    map: {
        value: {
            fromName: (map: object, name: string): string => {
                return _getMapValueFromName(map, name)
            }
        }
    }
}

export default obj