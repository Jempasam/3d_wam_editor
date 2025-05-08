import { ColorControl } from "./controls/parameter/ColorControl.js"
import { CursorControl } from "./controls/parameter/CursorControl.js"
import { GrowControl } from "./controls/parameter/GrowControl.js"
import { TextControl } from "./controls/decoration/TextControl.js"
import { ConnectionControl } from "./controls/connection/ConnectionControl.js"
import { Joystick3DControl } from "./controls/parameter/Joystick3DControl.js"
import { DecorationControl } from "./controls/decoration/DecorationControl.js"
import { ControlLibrary } from "../WamGUIGenerator.js"
import { CSettingsValues } from "./controls/settings/settings.js"
import { MorphControl } from "./controls/parameter/MorphControl.js"

/** List of available controls */
export const controls: ControlLibrary = {
    "input_control": ConnectionControl.Input,
    "output_control": ConnectionControl.Output,
    "midi_input_control": ConnectionControl.MidiInput,
    "midi_output_control": ConnectionControl.MidiOutput,
    "color_control": ColorControl.Type,
    "cursor_control": CursorControl.Type,
    "3d_joystick_control": Joystick3DControl.Type,
    "grow_control": GrowControl.Type,
    "text": TextControl.Type,
    "decoration": DecorationControl.Type,
    "morph_control": MorphControl.Type,
}

type ControlCategory = {control:keyof ControlLibrary, values: CSettingsValues}[]

export const control_categories = {
    input: [
        {control:"input_control", values: {}},
    ] as ControlCategory,
    output: [
        {control:"output_control", values: {}},
    ] as ControlCategory,
    event_input: [
        {control:"midi_input_control", values: {}},
    ] as ControlCategory,
    event_output: [
        {control:"midi_output_control", values: {}},
    ] as ControlCategory,
    parameter: [
        {control:"color_control", values: {}},
        {control:"cursor_control", values: {"Base Color":"[color]"}},
        {control:"grow_control", values: {"Base Color":"[color]"}},
    ] as ControlCategory,
}

export default controls