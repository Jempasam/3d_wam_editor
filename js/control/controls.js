import { Control } from "./Control.js"
import { TestControl } from "./TestControl.js"

/**
 * List of available controls
 * @type {{ [label:string]: typeof Control }}
 */
const controls = {
    "test": TestControl,
    "test2": TestControl,
    "test3": TestControl,
}

export default controls