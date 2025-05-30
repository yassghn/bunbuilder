/**
 * io.ts
 *
 * @memberof bunbuilder
 * @module bunbuilder/io
 * @property {bunbuilder.module:bunbuilder/io} io standard i/o
 */

const io = {
    /**
     * write str to stdout
     *
     * @param {string} str string to write
     * @param {boolean} [newline=false] new line flag
     */
    echo: (str: string, newline: boolean = false) => {
        // copy output string
        const output = { str: str.valueOf() }
        // add new line if enabled
        if (newline) {
            output.str += '\n'
        }
        // write to stdout
        Bun.write(Bun.stdout, output.str)
    }
}

export default io