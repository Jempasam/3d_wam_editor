import { Control, ControlContext } from "./Control.js"
import { ColorControl } from "./controls/parameter/ColorControl.js"
import { CursorControl } from "./controls/parameter/CursorControl.js"
import { GrowControl } from "./controls/parameter/GrowControl.js"
import { TextControl } from "./controls/TextControl.js"
import { ConnectionControl } from "./controls/connection/ConnectionControl.js"

/** List of available controls */
export const controls: {[id:string]:(new(context:ControlContext)=>Control)&typeof Control} = {
    "input_control": ConnectionControl.Input,
    "output_control": ConnectionControl.Output,
    "midi_input_control": ConnectionControl.MidiInput,
    "midi_output_control": ConnectionControl.MidiOutput,
    "color_control": ColorControl,
    "cursor_control": CursorControl,
    "grow_control": GrowControl,
    "text": TextControl,
}

export default controls