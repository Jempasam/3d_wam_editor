import { ControlEnv } from "../Control.ts"
import { ControlShared } from "../ControlShared.ts"
import { FieldValue, FieldValueFactory } from "./FieldValue.ts"

export class AnalyzerFieldValue implements FieldValue{

    private analyzer
    private interval

    private _actualValue = 0

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
            let newValue = Math.max(0, Math.min(1, (this.options.value(this.analyzer.node)-this.options.min)/this.options.size))
            this._actualValue = Math.sqrt((this._actualValue*this._actualValue+newValue*newValue)/2)
            this.onChange(this.getValue())
        },50)
    }

    getLabel(): string { return this.options.name }

    getMin(): number { return 0 }

    getMax(): number { return 1 }

    getExponant(): number { return 1 }

    getStepSize(): number { return 0 }

    getValue(): number { return this._actualValue }

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