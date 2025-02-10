import { readdir, readdirSync, readFile, writeFile, writeFileSync } from "fs";

const fonts = {}

const files = readdirSync("../media/fonts")

for(let file of files){
    console.log(file)
    let type = null
    if(file.endsWith(".ttf")) type = "ttf"
    if(file.endsWith(".otf")) type = "otf"
    if(type!=null){
        const name = file.split(".")[0]
        fonts[name] = {
            extension: type
        }
    }
}

writeFileSync("../media/fonts/index.json", JSON.stringify(fonts,{}," "))