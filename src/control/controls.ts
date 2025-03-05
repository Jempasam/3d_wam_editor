import { Control, ControlContext } from "./Control.js"
import { ColorControl } from "./controls/ColorControl.js"
import { CursorControl } from "./controls/CursorControl.js"
import { GrowControl } from "./controls/GrowControl.js"
import { InputControl } from "./controls/InputControl.js"
import { OutputControl } from "./controls/OutputControl.js"
import { TextControl } from "./controls/TextControl.js"

/** List of available controls */
export const controls: {[id:string]:(new(context:ControlContext)=>Control)&typeof Control} = {
    "input_control": InputControl,
    "output_control": OutputControl,
    "color_control": ColorControl,
    "cursor_control": CursorControl,
    "grow_control": GrowControl,
    "text": TextControl,
}

export default controls