export const randomRGB = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export const rectToRectCollision = (l1, s1, l2, s2) => {
    const [ min_x, min_y ] = l1;
    const [ max_x, max_y ] = l1.map((e, i) => e + s1[i]);
    
    const [ min_x2, min_y2 ] = l2;
    const [ max_x2, max_y2 ] = l2.map((e, i) => e + s2[i]);
    
    return max_x > min_x2 && min_x < max_x2 && max_y > min_y2 && min_y < max_y2;
}