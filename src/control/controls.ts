import { Control, ControlContext } from "./Control.js"
import { ColorControl } from "./controls/parameter/ColorControl.js"
import { CursorControl } from "./controls/parameter/CursorControl.js"
import { GrowControl } from "./controls/parameter/GrowControl.js"
import { TextControl } from "./controls/text/TextControl.js"
import { ConnectionControl } from "./controls/connection/ConnectionControl.js"
import { Joystick3DControl } from "./controls/parameter/Joystick3DControl.js"

/** List of available controls */
export const controls: {[id:string]:(new(context:ControlContext)=>Control)&typeof Control} = {
    "input_control": ConnectionControl.Input,
    "output_control": ConnectionControl.Output,
    "midi_input_control": ConnectionControl.MidiInput,
    "midi_output_control": ConnectionControl.MidiOutput,
    "color_control": ColorControl,
    "cursor_control": CursorControl,
    "3d_joystick_control": Joystick3DControl,
    "grow_control": GrowControl,
    "text": TextControl,
}

export default controls