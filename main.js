

const readline = require("readline")


let playerName
let playerClass

const classArray = ["Warrior", "Sorcerer", "Ranger"]

const mainLoop = async () => {
    playerName = await askQuestion("Greetings traveler! Please enter your name: ")

    console.log(`Hello ${playerName}!`)

    console.log("Please select a class:")
    console.log("/t1. Warrior")
    console.log("/t2. Sorcerer")
    console.log("/t3. Ranger")

    while (true) {
        playerClass = await askQuestion("")

        if (typeof (playerClass) !== "number") {
            console.log("Please enter a value of 1, 2, or 3")
            continue
        }
        if (playerName > 3 || playerClass < 1) {
            console.log("Please select a valid choice between 1-3.")
            continue
        }
        break
    }

    console.log(`You have selected ${classType[playerClass]}`)

    const enemyClass = randomIntFromInterval(1, 3)

    console.log(`Your enemy class is a ${classArray[enemyClass]}`)

}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

mainLoop()