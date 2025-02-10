
/** Get the first element that matches the selector */
export function get(target: string, root: Document|HTMLElement = document): HTMLElement{
    return root.querySelector(target)!!
}