
export interface PathCmd{
    type: "m" | "z" | "l"|"h"|"v" | "c"|"s"|"q" |"a"
    values: number[]
}

export const PATH = {

    parse(path: string): PathCmd[] {
        const re = /([mzlhvcdqa])([^mzlhvcdqa]*)/g
        const res: PathCmd[] = []
        let m: RegExpExecArray | null
        while ((m = re.exec(path))) {
            const type = m[1] as PathCmd["type"]
            const vals = m[2]
                .trim()
                // 🔧 correction : suppression du `.replace(/0$/, '')`
                .split(/[\s,]+/)
                .filter(s => s.length > 0)
                .map(Number);
            res.push({ type, values: vals })
        }
        return res
    },


    serialize(cmds: PathCmd[]): string {
        return cmds
            .map(c =>
                c.type === 'z' ? 'z' : `${c.type.toLowerCase()} ${c.values.join(' ')}`
            )
            .join(' ')
            .trim()
    },
}