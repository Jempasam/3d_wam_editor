import { ControlEnv } from "../Control.ts"
import { ControlShared } from "../ControlShared.ts"
import { FieldValue } from "./FieldValue.ts"

/*export class AnalyzerFieldValue implements FieldValue{

    private analyzer

    constructor(
        private env: ControlEnv,
        private options: {
            name: string,
            value: (node:AnalyserNode)=>number,
            min: number,
            size: number,
        }
    ){
        this.analyzer = env.shared.allocate(ControlShared.ANALYZER)
    }

    getName(): string { return this.options.name }

    getStepCount(): number { return 0 }

    getValue(): number { return  }

    setValue(_: number): void {}

    stringify(value: number): string { return (value*this.options.size+this.options.min).toString() }

    dispose(): void {
        this.env.shared.allocate(ControlShared.ANALYZER)
    }

    static INSTANCE = new NoneFieldValue()

    static Factory = class _ implements FieldValueFactory{

        static INSTANCE = new _()

        async create(_: (value: number) => void) {
            return NoneFieldValue.INSTANCE
        }

    }
}*/