
/**
 * Get the first element that matches the selector
 * @param {string} target 
 * @param {HTMLDocument|HTMLElement=} root 
 * @returns {HTMLElement}
 */
export function get(target, root){
    root ??= document
    return root.querySelector(target)
}