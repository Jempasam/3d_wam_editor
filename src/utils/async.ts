
export async function parallel(...callbacks:(()=>Promise<any>)[]){
    await Promise.all(callbacks.map(cb => cb()));
}

export async function parallelFor(from:number, to:number, callback:(i:number)=>Promise<any>){
    await Promise.all(Array.from({length: to - from}, (_, i) => callback(i + from)));
}

export async function parallelForEach<T>(array:T[], callback:(item:T, i:number)=>Promise<any>){
    await Promise.all(array.map((item, i) => callback(item, i)));
}