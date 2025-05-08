import { WebAudioModule } from "@webaudiomodules/api";
import { FieldValue, FieldValueFactory } from "./FieldValue.ts";


export class ProgramFieldValue implements FieldValue{

    private program = 0

    constructor(
        private wam: WebAudioModule,
        private onChange: (value: number) => void,
    ){}

    getName(): string {
        return "Program Change"
    }

    getStepCount(): number {
        return 127
    }

    getValue(): number {
        return this.program/127
    }

    setValue(value: number): void {
        this.program = Math.round(value*127)
        this.wam.audioNode.scheduleEvents({type:'wam-midi', data:{bytes:[192, this.program, 0]}})
        this.onChange(this.program/127)
    }

    stringify(value: number): string {
        const program = Math.round(value*127)
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