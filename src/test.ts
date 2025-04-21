import { ControlSettingsGUI } from "./control/settings.ts"

const settings = document.getElementById("settings")!!
const settingsGUI = new ControlSettingsGUI({
    "Nom":"text",
    "Cheveux":"color",
    "Est un homme":"boolean",
    "Ville":{choice:["Paris","Lyon","Marseille"]},
    "Age":[0,100],
})
settings.replaceChildren(settingsGUI.element)