const { isPropertyDeclaration } = require("typescript");

console.log("Hello World")
// alert("Elon here")

let person = {
    name: "Elon",
    age: 50
};


function selfIntro(person) {
    alert("Hello my name is " + person.name + " and I am " + person.age + " years old.");
}
selfIntro(person);
console.log(person);
