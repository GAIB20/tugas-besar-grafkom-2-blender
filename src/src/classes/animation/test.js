function easeBetween(start, end, x) {

    // Apply easing
    let easedX = 1 - Math.cos((x * Math.PI) / 2);

    // Scale easedX back from [0, 1] to [start, end]
    let result = (easedX * (end - start)) + start;

    return result;
}


for(let i = 0; i <= 1; i += 0.1){
    console.log(easeBetween(3, 10, i));
}