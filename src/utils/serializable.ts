

export type Ser = string | number | boolean | null | Ser[] | { [key: string]: Ser }


function fill(from: any, to: any, prefix: string, separator: string){
    for(const [key, value] of Object.entries(from)){
        if(typeof value === "object"){
            fill(value, to, prefix + key + separator, separator)
        }
        else{
            to[prefix + key] = value
        }
    }
}

export function flatten(obj: any, separator: string): any{
    const ret = {} as any
    fill(obj, ret, "", separator)
    return ret
}