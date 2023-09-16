export const randomRGB = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export const deepCopy = (arr) => {
    if(typeof arr === "object"){
        if(Array.isArray(arr)){
            const n = [];
            arr.forEach((e, i) => n[i] = deepCopy(e))
            return n;
        }
        const n = {};
        Object.entries(arr).forEach(([key, val]) => {
            n[key] = deepCopy(val);
        })
        return n;
    }
    return arr;
}