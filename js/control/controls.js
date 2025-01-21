import { Control } from "./Control.js"
import { ColorControl } from "./controls/ColorControl.js"
import { CursorControl } from "./controls/CursorControl.js"
import { GrowControl } from "./controls/GrowControl.js"
import { TestControl } from "./controls/TestControl.js"
import { TextControl } from "./controls/TextControl.js"

/**
 * List of available controls
 * @type {{ [label:string]: typeof Control }}
 */
const controls = {
    "color_control": ColorControl,
    "cursor_control": CursorControl,
    "grow_control": GrowControl,
    "test": TestControl,
    "text": TextControl,
}

export default controls