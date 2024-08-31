

const readline = require("readline")


let playerName
let playerClass

const classArray = ["", "Warrior", "Sorcerer", "Ranger"]
const characterSheet = {
    Warrior: {
        health: 10,
        attacks: {
            slash: 2,
            stab: 2,
        },
        defence: "armor"
    },
    Sorcerer: {
        life: 6,
        attack: {
            fireball: 3,
            icebolt: 2
        },
        defence: "energy"
    },
    Ranger: {
        life: 6,
        attack: {
            trap: 1,
            poison: 2
        },
        defense: "dodge"
    }
}
const mainLoop = async () => {
    playerName = await askQuestion("Greetings traveler! Please enter your name: ")

    console.log(`Hello ${playerName}!`)

    console.log("Please select a class:")
    console.log("  1. Warrior")
    console.log("  2. Sorcerer")
    console.log("  3. Ranger")

    while (true) {
        const selection = await askQuestion("")
        playerClass = parseInt(selection)
        if (playerClass === NaN) {
            console.log("Please enter a value of 1, 2, or 3")
            continue
        }
        if (playerName > 3 || playerClass < 1) {
            console.log("Please select a valid choice between 1-3.")
            continue
        }
        break
    }

    console.log(`You have selected the ${classArray[playerClass]} class`)

    const enemyClass = randomIntFromInterval(1, 3)

    console.log(`Your enemy class is a ${classArray[enemyClass]}`)

    const player = characterSheet[classArray[playerClass]]
    const enemy = characterSheet[classArray[enemyClass]]

    const playerLife = player.life
    const enemyLife = enemy.life

    const playerAttacks = player.attacks
    const enemyAttacks = enemy.attacks

    let playerAttackDamage = 0

    while (true) {
        setTimeout(2000);
        console.log("Your enemy is preparing to attack, what will you do?")
        console.log("Type out your selection: ")
        for (const attackKey in playerAttacks){
            console.log(`  [${attackKey}] damage:${playerAttacks[attackKey]}`)
        }

        const playerAttackSelection = await askQuestion()
        const playerAtt = playerAttack[playerAttackSelection]
        
        if (!playerAtt){
            console.log("Invalid attack selected. You forego your turn.")
        } else {
            playerAttackDamage = playerAtt
        }

        enemyLife = enemyLife - playerAttackDamage

        

    }

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