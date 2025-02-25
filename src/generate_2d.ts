import { initializeWamHost } from "@webaudiomodules/sdk"
import controls from "./control/controls.ts"
import { WamGUIGenerator, WAMGuiInitCode } from "./WamGUIGenerator.ts"

const json = decodeURIComponent(location.search.slice(1))
console.log(json)
const description = JSON.parse(json) as WAMGuiInitCode

const audioContext = new AudioContext()
const [host] = await initializeWamHost(audioContext)

const container = document.createElement("div")
container.className="wam_container"
document.body.appendChild(container)

const generator = WamGUIGenerator.create_and_init(
    {html:container},
    description,
    controls,
    audioContext,
    host
)


// {"aspect_ratio":1.2,"bottom_color":"#8cb8c8","top_color":"#6640ae","controls":[{"x":0.4093785823137988,"y":0.14375000000000002,"width":0.19686342637080373,"height":0.16875,"values":{"Text":"BoDiddley","Color":"#000000","Font":"avara"},"control":"text"},{"x":0.11250000000000002,"y":0.353125,"width":0.20937500000000003,"height":0.21875,"values":{"Base Color":"#222222","Cursor Color":"#0000ff","Target":"overdrive"},"control":"cursor_control"},{"x":0.3856250000000001,"y":0.35124404765538675,"width":0.20937500000000006,"height":0.21875,"values":{"Base Color":"#222222","Cursor Color":"#00ffcc","Target":"offset"},"control":"cursor_control"},{"x":0.6606250000000001,"y":0.34500000000000003,"width":0.20937500000000006,"height":0.21875,"values":{"Base Color":"#222222","Cursor Color":"#00ffcc","Target":"offset"},"control":"cursor_control"},{"x":0.3856250000000001,"y":0.6075,"width":0.20937500000000006,"height":0.21875,"values":{"Base Color":"#222222","Cursor Color":"#00ffcc","Target":"offset"},"control":"cursor_control"}],"wam_url":"https://www.webaudiomodules.com/community/plugins/burns-audio/distortion/index.js"}
// http://localhost:5173/test.html?%7B%22aspect_ratio%22%3A1.2%2C%22bottom_color%22%3A%22%238cb8c8%22%2C%22top_color%22%3A%22%236640ae%22%2C%22controls%22%3A%5B%7B%22x%22%3A0.4093785823137988%2C%22y%22%3A0.14375000000000002%2C%22width%22%3A0.19686342637080373%2C%22height%22%3A0.16875%2C%22values%22%3A%7B%22Text%22%3A%22BoDiddley%22%2C%22Color%22%3A%22%23000000%22%2C%22Font%22%3A%22avara%22%7D%2C%22control%22%3A%22text%22%7D%2C%7B%22x%22%3A0.11250000000000002%2C%22y%22%3A0.353125%2C%22width%22%3A0.20937500000000003%2C%22height%22%3A0.21875%2C%22values%22%3A%7B%22Base%20Color%22%3A%22%23222222%22%2C%22Cursor%20Color%22%3A%22%230000ff%22%2C%22Target%22%3A%22overdrive%22%7D%2C%22control%22%3A%22cursor_control%22%7D%2C%7B%22x%22%3A0.3856250000000001%2C%22y%22%3A0.35124404765538675%2C%22width%22%3A0.20937500000000006%2C%22height%22%3A0.21875%2C%22values%22%3A%7B%22Base%20Color%22%3A%22%23222222%22%2C%22Cursor%20Color%22%3A%22%2300ffcc%22%2C%22Target%22%3A%22offset%22%7D%2C%22control%22%3A%22cursor_control%22%7D%2C%7B%22x%22%3A0.6606250000000001%2C%22y%22%3A0.34500000000000003%2C%22width%22%3A0.20937500000000006%2C%22height%22%3A0.21875%2C%22values%22%3A%7B%22Base%20Color%22%3A%22%23222222%22%2C%22Cursor%20Color%22%3A%22%2300ffcc%22%2C%22Target%22%3A%22offset%22%7D%2C%22control%22%3A%22cursor_control%22%7D%2C%7B%22x%22%3A0.3856250000000001%2C%22y%22%3A0.6075%2C%22width%22%3A0.20937500000000006%2C%22height%22%3A0.21875%2C%22values%22%3A%7B%22Base%20Color%22%3A%22%23222222%22%2C%22Cursor%20Color%22%3A%22%2300ffcc%22%2C%22Target%22%3A%22offset%22%7D%2C%22control%22%3A%22cursor_control%22%7D%5D%2C%22wam_url%22%3A%22https%3A%2F%2Fwww.webaudiomodules.com%2Fcommunity%2Fplugins%2Fburns-audio%2Fdistortion%2Findex.js%22%7D