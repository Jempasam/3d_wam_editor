import { ControlEnv } from "./Control.ts"

export interface ShareMapDataType<T>{
    create(env: ControlEnv): T
    dispose(value: T): void
}

export interface AsyncShareMapDataType<T>{
    create(env: ControlEnv): Promise<T>
    dispose(value: T): void
}

export class ShareMap{

    constructor(private env: ControlEnv){ }

    private content = new Map<ShareMapDataType<any>|AsyncShareMapDataType<any>, {count:number, value:any}>()
    
    allocate<T>(type: ShareMapDataType<T>): T{
        const entry = this.content.get(type)
        if(entry){
            entry.count++
            return entry.value as T
        }else{
            const value = type.create(this.env)
            this.content.set(type, {count:1, value})
            return value
        }
    }

    get<T>(type: ShareMapDataType<T>|AsyncShareMapDataType<T>): T|undefined{
        return this.content.get(type)?.value
    }

    async allocate_async<T>(type: AsyncShareMapDataType<T>): Promise<T>{
        const entry = this.content.get(type)
        if(entry){
            entry.count++
            return entry.value as T
        }else{
            const value = await type.create(this.env)
            this.content.set(type, {count:1, value})
            return value
        }
    }

    free<T>(type: ShareMapDataType<T>|AsyncShareMapDataType<T>, quantity: number = 1): void{
        const entry = this.content.get(type)
        if(entry){
            entry.count-=quantity
            if(entry.count <= 0){
                type.dispose(entry.value as T)
                this.content.delete(type)
            }
        }
    }

    get keys(){
        return this.content.keys()
    }
}