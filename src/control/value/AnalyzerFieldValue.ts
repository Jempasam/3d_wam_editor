import { ControlEnv } from "../Control.ts"
import { ControlShared } from "../ControlShared.ts"
import { FieldValue, FieldValueFactory } from "./FieldValue.ts"

export class AnalyzerFieldValue implements FieldValue{

    private analyzer
    private interval

    constructor(
        private env: ControlEnv,
        private options: {
            name: string,
            value: (node:AnalyserNode)=>number,
            min: number,
            size: number,
        },
        private onChange: (value: number)=> void,
    ){
        this.analyzer = env.shared.allocate(ControlShared.ANALYZER)!
        this.interval = setInterval(()=>{
            this.onChange(this.getValue())
        },100)
    }

    getName(): string { return this.options.name }

    getStepCount(): number { return 0 }

    getValue(): number { return Math.max(0, Math.min(1, (this.options.value(this.analyzer.node)-this.options.min)/this.options.size)) }

    setValue(_: number): void {}

    stringify(value: number): string { return (value*this.options.size+this.options.min).toString() }

    dispose(): void {
        this.env.shared.free(ControlShared.ANALYZER)
        clearInterval(this.interval)
    }

    static Factory = class _ implements FieldValueFactory{

        constructor(
            private env: ControlEnv,
            private options: ConstructorParameters<typeof AnalyzerFieldValue>[1],
        ){}

        async create(onChange: (value: number) => void) {
            return new AnalyzerFieldValue(this.env, this.options, onChange)
        }

    }
}