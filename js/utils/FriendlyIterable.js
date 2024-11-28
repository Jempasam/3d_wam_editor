
/**
 * A friendly iterable wrapper
 * @template T
 */
export class FriendlyIterable {
    
    /**
     * @param {Iterable<T>} iterable 
     */
    constructor(iterable){
        this.content = iterable
    }

    [Symbol.iterator](){
        return this.content[Symbol.iterator]()
    }


    /**
     * Performs the specified action for each element in an array.
     * @param {(value:T, index:number)=>void} callbackfn  A function that accepts up to two arguments. forEach calls the callbackfn function one time for each element in the array.
     */
    forEach(callbackfn){
        let index=0
        for(let value of this.content){
            callbackfn(value,index)
            index++
        }
    }


    /**
     * Returns the value of the first element of the iterator where predicate is true, and undefined
     * otherwise.
     * @param {(value: T, index: number) => boolean} predicate find calls predicate once for each element of the iterator, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @returns {T|undefined}
     */
    find(predicate){
        let index=0
        for(let value of this.content){
            if(predicate(value,index))return value
            index++
        }
        return undefined
    }

    /**
     * Returns the index of the first element of the iterator where predicate is true, and -1
     * otherwise.
     * @param {(value: T, index: number) => boolean} predicate find calls predicate once for each element of the iterator, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element index. Otherwise, find returns -1.
     * @returns {number}
     */
    findIndex(predicate){
        let index=0
        for(let value of this.content){
            if(predicate(value,index))return index
            index++
        }
        return -1
    }

    /**
     * Returns the index of the first occurrence of a value in an iterator, or -1 if it is not present.
     * @param {T} value The value to locate in the iterator.
     * @returns {number}
     */
    indexOf(value){
        return this.findIndex(v=>v===value)
    }

    /**
     * Determines whether the specified callback function returns true for any element of an iterator.
     * @param {(value: T, index: number) => boolean} predicate A function that accepts up to two arguments. some calls the predicate function for each element of the iterator until the predicate returns true, or until the end of the iterator.
     * @returns {boolean}
     */
    some(predicate){ return this.findIndex(predicate)!=-1 }

    /**
     * Determines whether all the members of an iterator satisfy the specified test.
     * @param {(value: T, index: number) => boolean} predicate A function that accepts up to two arguments. every calls the predicate function for each element of the iterator until the predicate returns false, or until the end of the iterator.
     * @returns {boolean}
     */
    every(predicate){ return this.findIndex((value,index)=>!predicate(value,index))==-1 }

    /**
     * Returns a new iterator that contains the elements of the original iterator that satisfy the specified predicate.
     * @template U
     * @param {(value: T, index: number) => U} mapper A function that accepts up to two arguments. filter calls the predicate function one time for each element of the iterator.
     * @returns {U[]}
     */
    map(mapper){
        const result=[]
        let index=0
        for(let value of this.content){
            result.push(mapper(value,index))
            index++
        }
        return result
    }

    /**
     * Applies a function against an accumulator and each element in the iterator (from left to right) to reduce it to a single value.
     * @param {(previousValue: T, currentValue: T, currentIndex: number) => T} callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
     * @returns {T}
     */
    reduce(callbackfn){
        let index=0
        let previousValue
        for(let value of this.content){
            if(previousValue==undefined)previousValue=value
            else previousValue=callbackfn(previousValue,value,index)
            index++
        }
        if(previousValue==undefined)throw new Error("Reduce of empty iterator with no initial value")
        return previousValue
    }

    /**
     * Checks if the iterable contains the specified value.
     * @param {T} value 
     * @returns {boolean}
     */
    includes(value) {
        return this.some(v=>v===value)
    }
    
}