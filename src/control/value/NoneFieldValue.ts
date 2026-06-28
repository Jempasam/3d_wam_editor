import { FieldValue, FieldValueFactory } from "./FieldValue.ts";


export class NoneFieldValue implements FieldValue{

    getLabel(): string { return "None" }


    getMin(): number { return 0 }
    getMax(): number { return 0 }
    getExponant(): number { return 1 }
    getStepSize(): number { return 0 }

    getValue(): number { return 0 }
    setValue(_: number): void {}

    stringify(_: number): string { return "None" }

    dispose(): void { }

    static INSTANCE = new NoneFieldValue()

    static Factory = class _ implements FieldValueFactory{

        static INSTANCE = new _()

        async create(_: (value: number) => void) {
            return NoneFieldValue.INSTANCE
        }

    }
}