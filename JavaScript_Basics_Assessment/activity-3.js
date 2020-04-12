//Activity 3 - JavaScript Arrays and Loops

const studentNames = ["Gauss", "Turing", "Euler"];
alert("Type 3 names, please.");
for (let i = 0; i < 3; i++) {
	studentNames.push(prompt(`Name number ${i+1}:`));
}

for (let j = 0; j < studentNames.length; j++) {
	console.log(studentNames[j]);
}