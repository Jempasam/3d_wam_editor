import { Transformer } from "./Transformer.js"


/**
 * A multiselector and movement manager.
 * @template T
 */
export class Selector{

    /** @type {(selected:T)=>void} */ on_select = ()=>{}
    /** @type {(unselected:T)=>void} */ on_unselect = ()=>{}
    /** @type {(moved:T,x:number,y:number,width:number,height:number)=>void} */ on_move = ()=>{}

    #selecteds = new Set()
    
    /** @type {Transformer|null} */  transformer = null

    /**
     * @param {(value:T)=>{x:number,y:number,width:number,height:number}} get_position
     * @param {HTMLElement} container
     */
    constructor(get_position,container){
        this.get_position = get_position
        this.container = container
    }

    /**
     * The selected elements.
     * @param {Iterable<T>} selecteds
     */
    set selecteds(selecteds){
        for(const v of [...this.#selecteds]) this.unselect(v)
        for(const v of selecteds) this.select(v) 
    }

    /**
     * @returns {Omit<Set<T>, 'add'|'delete'|'clear'>} The selected elements.
     */
    get selecteds(){
        return this.#selecteds
    }

    /**
     * Unselect all elements.
     */
    unselect_all(){
        for(const s of [...this.#selecteds]){
            this.unselect(s)
        }
    }

    /**
     * Select an element
     * @param {T} selection 
     */
    select(selection){
        if(this.#selecteds.has(selection)) return
        this.#selecteds.add(selection)
        this.on_select(selection)

        this.#placeTransformer()
    }

    /**
     * Unselect an element
     * @param {T} selection 
     */
    unselect(selection){
        if(!this.#selecteds.has(selection)) return
        this.#selecteds.delete(selection)
        this.on_unselect(selection)

        if(this.transformer){
            this.transformer.element.remove()
            this.transformer = null
        }

        this.#placeTransformer()
    }

    #placeTransformer(){
        if(this.#selecteds.size > 0){
            /* Get the bounding box of the selected elements */
            let left = Number.MAX_SAFE_INTEGER
            let top = Number.MAX_SAFE_INTEGER
            let right = Number.MIN_SAFE_INTEGER
            let bottom = Number.MIN_SAFE_INTEGER
            for(const selected of this.selecteds){
                const {x,y,width,height} = this.get_position(selected)
                console.log(this.get_position(selected))
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