import { Transformer } from "./Transformer.ts"


/**
 * A multiselector and movement manager.
 */
export class Selector<T>{

    on_select = (selected:T)=>{}
    on_unselect = (unselected:T)=>{}
    on_move = (moved:T,x:number,y:number,width:number,height:number)=>{}

    private _selecteds = new Set<T>()
    
    transformer: Transformer|null = null

    constructor(
        private get_position: (value:T)=>{x:number,y:number,width:number,height:number},
        private container: HTMLElement
    ) { }

    /** The selected elements. */
    set selecteds(selecteds: Iterable<T>){
        for(const v of [...this._selecteds]) this.unselect(v)
        for(const v of selecteds) this.select(v) 
    }

    /**
     * @returns The selected elements.
     */
    get selecteds(): Omit<Set<T>, 'add'|'delete'|'clear'>{
        return this._selecteds
    }

    /** Unselect all elements. */
    unselect_all(){
        for(const s of [...this._selecteds]){
            this.unselect(s)
        }
    }

    /**
     * Select an element
     * @param selection 
     */
    select(selection: T){
        if(this._selecteds.has(selection)) return
        this._selecteds.add(selection)
        this.on_select(selection)

        this.#placeTransformer()
    }

    /**
     * Unselect an element
     * @param selection 
     */
    unselect(selection: T){
        if(!this._selecteds.has(selection)) return
        this._selecteds.delete(selection)
        this.on_unselect(selection)

        if(this.transformer){
            this.transformer.element.remove()
            this.transformer = null
        }

        this.#placeTransformer()
    }

    #placeTransformer(){
        if(this._selecteds.size > 0){
            /* Get the bounding box of the selected elements */
            let left = Number.MAX_SAFE_INTEGER
            let top = Number.MAX_SAFE_INTEGER
            let right = Number.MIN_SAFE_INTEGER
            let bottom = Number.MIN_SAFE_INTEGER
            for(const selected of this.selecteds){
                const {x,y,width,height} = this.get_position(selected)
                if(x<left) left = x
                if(y<top) top = y
                if(x+width>right) right = x+width
                if(y+height>bottom) bottom = y+height
            }
            if(!this.transformer){
                this.transformer = new Transformer()
                this.transformer.registerEvents()
                this.container.appendChild(this.transformer.element)
            }
            else{
                this.transformer.onmove = ()=>{}   
                this.transformer.left=0
                this.transformer.top=0
                this.transformer.width=1
                this.transformer.height=1
            }

            this.transformer.left = left
            this.transformer.top = top
            this.transformer.right = right
            this.transformer.bottom = bottom

            /* Get the element relative positions */
            let relative_positions = []
            for(const selected of this.selecteds){
                const {x,y,width,height} = this.get_position(selected)
                relative_positions.push({ x:(x-left)/(right-left), y:(y-top)/(bottom-top), width: width/(right-left), height: height/(bottom-top) })
            }

            /* On move */
            this.transformer.onmove = (gx,gy,gw,gh)=>{
                const selecteds= [...this.selecteds]
                for(let i=0; i<selecteds.length; i++){
                    const selected = selecteds[i]
                    const pos = relative_positions[i]
                    this.on_move(
                        selected,
                        pos.x * gw + gx,
                        pos.y * gh + gy,
                        pos.width * gw,
                        pos.height * gh
                    )

                }
            }
        }
        else{
            if(this.transformer)this.transformer.element.remove()
            this.transformer = null
        }
    }
}