import { WebAudioModule } from "@webaudiomodules/api";
import { FieldValue, FieldValueFactory } from "./FieldValue.ts";


export class ProgramFieldValue implements FieldValue{

    private program = 0

    constructor(
        private wam: WebAudioModule,
        private onChange: (value: number) => void,
    ){}

    getLabel(): string { return "Program Change" }


    getMin(): number { return 0 }

    getMax(): number { return 127 }

    getStepSize(): number { return 1 }

    getExponant(): number { return 1 } 


    getValue(): number { return this.program }

    setValue(value: number): void {
        this.program = value
        this.wam.audioNode.scheduleEvents({type:'wam-midi', data:{bytes:[192, this.program, 0]}})
        this.onChange(this.program)
    }

    stringify(value: number): string {
        const program = value
        return `Program n°${program}`
    }

    dispose(): void { }

    static Factory = class _ implements FieldValueFactory{

        constructor(private wam: WebAudioModule){}

        async create(onChange: (value: number) => void) {
            return new ProgramFieldValue(this.wam, onChange)
        }

    }
}