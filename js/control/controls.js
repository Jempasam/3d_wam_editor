import { Control } from "./Control.js"
import { TestControl } from "./controls/TestControl.js"
import { TextControl } from "./controls/TextControl.js"

/**
 * List of available controls
 * @type {{ [label:string]: typeof Control }}
 */
const controls = {
    "test": TestControl,
    "text": TextControl,
    "test2": TestControl,
    "test3": TestControl,
}

export default controls