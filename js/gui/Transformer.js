import { html } from "../utils/doc.js";

function to_css(v) { return (Math.round(v*10000)/100)+"%" }

/**
 * A transformer element.
 * Coordinates are expressed as numbers between 0 and 1.
 */
export class Transformer {

    #x
    #y
    #width
    #height

    /** @type {(x:number,y:number,width:number,height:number)=>void} */  onmove = ()=>{}

    constructor(){
        this.element = html.a`
            <div class="transformer">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        `
        this.#width = 1;
        this.#height = 1;
        this.#x = 0;
        this.#y = 0;

        
        this.element.style.width =  to_css(this.width)
        this.element.style.height = to_css(this.height)
        this.element.style.left = to_css(this.x)
        this.element.style.top = to_css(this.y)
    }

    /** Get the transformer left x coordinate. */
    set x(value){
        if(value+this.#width > 1) value = 1-this.#width
        if(value < 0) value = 0
        this.element.style.left = to_css(value)
        this.#x = value
        this.onmove(this.x, this.y, this.width, this.height)
    }
    get x(){ return this.#x }

    /** Get the transformer top y coordinate. */
    set y(value){
        if(value+this.#height > 1) value = 1-this.#height
        if(value < 0) value = 0
        this.element.style.top = to_css(value)
        this.#y = value
        this.onmove(this.x, this.y, this.width, this.height)
    }
    get y(){ return this.#y }

    /** Get the transformer width. */
    set width(value){
        if(this.#x+value > 1) value = 1-this.#x
        if(value < 0.05) value = 0.05
        this.element.style.width = to_css(value)
        this.#width = value
        this.onmove(this.x, this.y, this.width, this.height)
    }
    get width(){ return this.#width }

    /** Get the transformer height. */
    set height(value){
        if(this.#y+value > 1) value = 1-this.#y
        if(value < 0.05) value = 0.05
        this.element.style.height = to_css(value)
        this.#height = value
        this.onmove(this.x, this.y, this.width, this.height)
    }
    get height(){ return this.#height }


    /** The current center of the selector */
    get center(){
        return [ this.x+this.width/2, this.y+this.height/2 ]
    }

    /**
     * Set a new size for the transformer around a point. The part of the transformer
     * that is at the point location should not move.
     * The point is expressed with numbers between 0 and 1 relative to the transformer size.
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    setSizeAround(x, y, width, height){
        console.assert(x >= 0 && x <= 1 && y >= 0 && y <= 1)

        if(width < 0.05) width = 0.05
        if(height < 0.05) height = 0.05

        const lx = this.x + this.width*x
        const ly = this.y + this.height*y

        width =  Math.min(width,  lx/(x+0.000001), (1-lx)/(1.00000001-x), 1)
        height = Math.min(height, ly/(y+0.000001), (1-ly)/(1.00000001-y), 1)

        const newx = lx - width*x
        const newy = ly - height*y
        this.#width = width
        this.#height = height
        this.#x = newx
        this.#y = newy
        this.element.style.width = to_css(this.#width) + "%"
        this.element.style.height = to_css(this.#height) + "%"
        this.element.style.left = to_css(this.#x) + "%"
        this.element.style.top = to_css(this.#y) + "%"
        this.onmove(this.x, this.y, this.width, this.height)
    }

    /** The right x coordinate of the transformer */
    set right(value){ this.width = value-this.x }
    get right(){ return this.x+this.width }

    /** The bottom y coordinate of the transformer */
    set bottom(value){ this.height = value-this.y }
    get bottom(){ return this.y+this.height }

    /** The left x coordinate of the transformer */
    set left(value){
        const offset = value-this.x
        this.right -= offset
        this.x += offset
    }
    get left(){ return this.x }

    /** The top y coordinate of the transformer */
    set top(value){
        const offset = value-this.y
        this.bottom -= offset
        this.y += offset
    }
    get top(){ return this.y }

    
    //// Handle mouse controls ////
    dragged=null

    /**
     * Start resizing the given border of the transformer.
     * @param {0|1|2|3} border 
     * @param {number} startMousePageX 
     * @param {number} startMousePageY
     */
    startResizing(border, startMousePageX, startMousePageY){
        const [left, right, top, bottom] = (()=>{
            if(border==0) return [true, false, true, false]
            if(border==2) return [false, true, false, true]
            if(border==1) return [false, true, true, false]
            if(border==3) return [true, false, false, true]
            throw new Error("Invalid border id")
        })()

        this.dragged = this.element.children[border]
        this.dragged.classList.add("_dragged")

        const originalWidth = this.width, originalHeight = this.height
        const oLeft = this.left, oRight = this.right, oTop = this.top, oBottom = this.bottom
        const bounds = this.element.getBoundingClientRect() 
        /** @param {MouseEvent} e */
        let fn = (e)=>{
            let offset_x = (e.pageX-startMousePageX)/bounds.width*originalWidth
            let offset_y = (e.pageY-startMousePageY)/bounds.height*originalHeight
            console.log("offset",offset_x,offset_y)
            console.log("new",originalWidth+offset_x, originalHeight+offset_y)
            if(left) this.left = oLeft+offset_x
            if(right) this.right = oRight+offset_x
            if(top) this.top = oTop+offset_y
            if(bottom) this.bottom = oBottom+offset_y
            if(this.dragged!=this.element.children[border]){
                window.removeEventListener("mousemove", fn)
                this.element.children[border].classList.remove("_dragged")
            } 
        }
        window.addEventListener("mousemove", fn)
    }

    /**
     * Start moving the transformer.
     * @param {number} startMousePageX
     * @param {number} startMousePageY
     */
    startMoving(startMousePageX, startMousePageY){
        if(this.dragged) this.dragged.classList.remove("_dragged")
        this.dragged = this.element.children[4]
        this.dragged.classList.add("_dragged")
        const bounds = this.element.getBoundingClientRect()
        const oX = this.x, oY = this.y
        /** @param {MouseEvent} e */
        let fn = (e)=>{
            this.x = oX + (e.pageX-startMousePageX)/bounds.width*this.width
            this.y = oY + (e.pageY-startMousePageY)/bounds.height*this.height
            if(this.dragged!=this.element.children[4]){
                window.removeEventListener("mousemove", fn)
                this.element.children[4].classList.remove("_dragged")
            }
        }
        window.addEventListener("mousemove", fn)
    }
    

    /**
     * Register the events that allow the transformer to
     * be manually moved and resized.
     */
    registerEvents(){
        let undrag = ()=> this.dragged = null
        window.addEventListener("mouseup", undrag)
        window.addEventListener("blur", undrag)

        const handler = (border) => /** @param {MouseEvent} e */(e)=>{ e.preventDefault(); this.startResizing(border, e.pageX, e.pageY) }
        this.element.children[0].addEventListener("mousedown", handler(0))
        this.element.children[2].addEventListener("mousedown", handler(2))
        this.element.children[1].addEventListener("mousedown", handler(1))
        this.element.children[3].addEventListener("mousedown", handler(3))
        this.element.children[4].addEventListener("mousedown", /** @param {MouseEvent} e */(e)=>{
            e.preventDefault()
            this.startMoving(e.pageX, e.pageY)
        })
    }

}