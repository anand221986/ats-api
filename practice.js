//closure  
1.
function A() {
    let count = 0;
    return function b() {
        count++;
        console.log(count);
    }
}

let inc = A();
inc()
inc()

let a=[1,2,2,2,3,4,55,1,1]

const unique = a.filter((item, index) => {
     console.log(`item: ${item}, index: ${index}, indexOf(item): ${a.indexOf(item)}`);
    return a.indexOf(item) === index;

});
console.log(unique,'unique')
console.log(new Set(a))

