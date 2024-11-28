

/**
 * 
 * @param {string} unsafe 
 * @returns 
 */
export function escapeHtml(unsafe)
{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Create a document fragment from a template string.
 * Node are inserted as is, other values are escaped as string.
 * Iterables are expanded.
 * Undefined and null values are ignored.
 * Function are called.
 * 
 * If in a start balise of an element, a function placeholder is preceded by a "@" character, 
 * the function will be called with the element as argument, after the element is created.
 * 
 * If in a start balise of an element, a object placeholder is preceded by a "@" character,
 * their key-value of event name-function will be registred to the element. A custom "init" event
 * is called once directly after the element is created.
 * 
 * 
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {DocumentFragment}
 **/
export function html(strings, ...values) {
    let result= ""
    let nodes= []
    let functions_to_call= []

    // Built the inner html and fetch the nodes
    function addValue(value){
        if(value===null || value===undefined)result
        else if(value instanceof Node){
            result+=`<span id="_sam_frament_target_${nodes.length}"></span>`
            nodes.push(value)
        }
        else if(typeof value === "string")result+=escapeHtml(value)
        else if(typeof value[Symbol.iterator]==="function"){
            for(const v of value)addValue(v)
        }
        else if (typeof value === "function")addValue(value())
        else result+=escapeHtml(""+value)
    }
    for(let i=0; i<values.length; i++){
        if(strings[i].endsWith("@") && (typeof values[i] === "function" || typeof values[i] === "object")){
            // Register a function to call on the element
            result+= strings[i].slice(0, -1)
            result+= `_sam_fragment_to_call_${functions_to_call.length}=sam`
            functions_to_call.push(values[i])
        }
        else{
            // Normal value interpolation
            result+=strings[i]
            addValue(values[i])
        }
    }
    result+=strings[strings.length-1]

    // Create the fragment and replace the placeholders
    const fragment= document.createRange().createContextualFragment(result)
    for(let i=0; i<nodes.length; i++){
        const target= fragment.getElementById(`_sam_frament_target_${i}`)
        target?.replaceWith(nodes[i])
    }

    // Call the functions
    for(let i=0; i<functions_to_call.length; i++){
        const target= fragment.querySelector(`[_sam_fragment_to_call_${i}]`)
        target.removeAttribute(`_sam_fragment_to_call_${i}`)
        if(typeof functions_to_call[i]==="function") functions_to_call[i]()
        else for(const [key, value] of Object.entries(functions_to_call[i])){
            if(key=="init")value(target)
            else target.addEventListener(key, value)
        }
    }
    return fragment
}

/**
 * Work like html`` but return undefined if any of the value is undefined or null.
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {DocumentFragment}
 **/
html.opt= function(strings, ...values){
    if(values.includes(null) || values.includes(undefined))return undefined
    else return html(strings, ...values)
}

/**
 * Work like html`` but return undefined if all the values are undefined, null, or empty arrays.
 * The search for undefined, null, and empty arrays is NOT recursive.
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {DocumentFragment}
 */
html.not_empty= function(strings, ...values){
    console.log(values)
    if(values.every(v=>v===null || v===undefined || (v.length && v.length===0)))return undefined
    else return html(strings, ...values)
}

/**
 * Work like html`` but return the first element child of the fragment.
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {HTMLElement}
 **/
html.a= function(strings, ...values){
    return html(strings, ...values).firstElementChild
}
