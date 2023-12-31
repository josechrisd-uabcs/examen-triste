export const randomRGB = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export const deepCopy = (arr) => {
    if(typeof arr === "object" && arr !== null){
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
        
export const rotationalClamp = (val, min, max) => {
    val -= min
    const diff = max - min;
    while(val < min) val += diff;
    return (val % diff) + min;
}

export const max = (a, b = undefined) => {
    if(Array.isArray(a)) {
        let max = a[0]
        for (let i2 = 1; i2 < a.length; i2++) {
            max < a[i2] && (max = a[i2]);
        }
        return max;
    }
    return a > b ? a : b;
}

export const min = (a, b = undefined) => {
    if(Array.isArray(a)) {
        let min = a[0]
        for (let i2 = 1; i2 < a.length; i2++) {
            min > a[i2] && (min = a[i2]);
        }
        return min;
    }
    return a < b ? a : b;
}