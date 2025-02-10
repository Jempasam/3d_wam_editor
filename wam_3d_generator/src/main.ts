import { ControlSettings, ControlSettingsGUI } from "./control/settings.ts"

const target = document.getElementsByTagName("body")[0]

const control_settings: ControlSettings = {
    Text: "text", 
    Color: "color", 
    Font: "font", 
    Size: {min:0.1, max:10, step:0.1},
    Weight: {min:100, max:900, step:100},
}

const gui = new ControlSettingsGUI(control_settings, {})

target.replaceChildren(gui.element)