import { Control, ControlState } from "./Control.ts";
import { ControlMap } from "./ControlMap.ts";

/**
 * Allow to manage the state of the controls of a control map.
 * A new control state manager has to be created when a control map is changed.
 */
export class ControlStateManager{

    private states = new Map<string, Control>()
    public onStateChange?: (name:string)=>void

    constructor(controls: ControlMap){
        const name_map = new Map<string,number>()
        for(const {control} of controls.values){
            if(control.getState && control.setState && control.getStateName){
                const name = control.getStateName()
                const count = name_map.get(name) ?? 1
                name_map.set(name,count+1)
                const final_name = count==1 ? name : name+count
                control.onStateChange = ()=>this.onStateChange?.(final_name)
                this.states.set(final_name, control)
            }
        }
    }

    /**
     * Get the names of the states.
     */
    get names(){ return this.states.keys() }

    /**
     * Set a state by its name.
     * @param name The name of the state to set. 
     * @param value The new value of the state.
     */
    async set(name: string, value: ControlState){
        await this.states.get(name)?.setState?.(value)
    }

    /**
     * Get a state by its name.
     * @param id The name of the state to get.
     * @returns The value of the state, or undefined if the state does not exist.
     */
    async get(name: string): Promise<ControlState | undefined>{
        return await this.states.get(name)?.getState?.()
    }
    
    dispose(){
        this.states.forEach(control => control.onStateChange = undefined)
        this.states.clear()
    }
}