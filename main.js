const readline = require("readline")

let playerName;
let playerClass;
let enemyName = "Your enemy";

const classArray = ["", "Warrior", "Sorcerer", "Ranger"]

const createWarrior = (name) => {
    return {
        name: name,
        life: 10,
        actions: {
            "sword slash": { damage: 2, effect: "bleed" },
            "shield bash": { damage: 2, effect: "stagger" },
        },
        effects: []
    }
}

const createSorcerer = (name) => {
    return {
        name: name,
        life: 6,
        actions: {
            "cast fireball": { damage: 3, effect: "burn" },
            "cast icebolt": { damage: 3, effect: "freeze" }
        },
        effects: []
    }
}

const createRanger = (name) => {
    return {
        name: name,
        life: 6,
        actions: {
            "set trap": { damage: 2, effect: "trap" },
            "poison arrow": { damage: 3, effect: "poison" }
        },
        effects: []
    }
}

const getClass = (selection, name) => {
    switch (selection) {
        case "Warrior": return createWarrior(name);
        case "Sorcerer": return createSorcerer(name);
        case "Ranger": return createRanger(name);
    }
}

const intro = async () => {
    playerName = await getUserInput("Greetings traveler! Please enter your name: ");
    console.log(`Hello ${playerName}!`);
}

const classSelection = async () => {
    console.log("Please select a class:")
    console.log("  1. Warrior")
    console.log("  2. Sorcerer")
    console.log("  3. Ranger")

    while (true) {
        const selection = await getUserInput("")
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

    console.log(`${playerName} has selected the ${classArray[playerClass]} class`)
}

const enemySelection = () => {
    const enemyClass = randomIntFromInterval(1, 3)
    console.log(`Your enemy class is a ${classArray[enemyClass]}`);
    return enemyClass;
}

const calculateEnemyAttack = (enemy) => {
    const rand = randomIntFromInterval(0, 1);
    let count = 0;
    for (const attackKey in enemy.actions) {
        if (rand == count) {
            return attackKey;
        }
        count++;
    }
}

const playerAction = async (player, enemy) => {
    await wait(2000);
    console.log("Select your attack (type out the attack exactly): ")
    for (const attackKey in player.actions) {
        console.log(`  [${attackKey}] damage: up to ${player.actions[attackKey].damage}`)
    }
    const playerSelection = await getUserInput("");
    const playerAttack = player.actions[playerSelection];
    if (!playerAttack) {
        console.log(`Invalid attack selected. ${player.name} hesitates and ${enemy.name} takes advantage of the opportunity.`)
        return
    }
    const playerDamage = randomIntFromInterval(0, playerAttack.damage);
    console.log(`${player.name} attacks with ${playerSelection}...`);
    await wait(2000);
    if (playerDamage === 0) {
        console.log(`${player.name}'s attack missed!`);
        return;
    }

    enemy.life -= playerDamage;
    console.log(`${player.name} hits ${enemy.name} for ${playerDamage}, bringing their life down to ${enemy.life}`);
    if (playerAttack.effect) {
        applyStatusEffect(enemy, playerAttack.effect);
        if (enemy.effects?.some(x => x.status === playerAttack.effect)) {
            console.log(`${enemy.name} has been affected by a new status effect: ${playerAttack.effect}`);
        }
    }
}

const enemyAction = async (enemy, player) => {
    await wait(2000);
    const enemySelection = calculateEnemyAttack(enemy);
    const enemyAttack = enemy.actions[enemySelection];
    const enemyDamage = randomIntFromInterval(0, enemyAttack.damage);
    console.log(`${enemy.name} attacks with ${enemySelection}...`);
    await wait(2000);
    if (enemyDamage === 0) {
        console.log(`${enemy.name} attack misses! ${player.name} got lucky!`);
        return;
    }
    player.life -= enemyDamage;
    console.log(`${enemy.name} hits ${player.name} for ${enemyDamage}, bringing ${player.name}'s life down to ${player.life}`);
    if (enemyAttack.effect) {
        applyStatusEffect(player, enemyAttack.effect);
        if (player.effects?.some(x => x.status === enemyAttack.effect)) {
            console.log(`${enemy.name} has been affected by a new status effect: ${enemyAttack.effect}`);
        }
    }
}

const applyStatusEffect = (target, status) => {

    const applyChance = randomIntFromInterval(0, 1);
    if (applyChance === 0) {
        console.log(`${target.name} avoided status effect: ${status}`)
        return;
    }

    if (!target.effects) target.effects = []

    switch (status) {
        case "bleed":
            if (!target.effects.some(x => x.status === "bleed")) {
                target.effects.push({
                    status: "bleed",
                    damage: 1,
                    stunned: false,
                    expirationTurn: target.turnCounter + 2
                })
            }
            break;
        case "stagger":
            if (!target.effects.some(x => x.status === "stagger")) {
                target.effects.push({
                    status: "stagger",
                    damage: 0,
                    stunned: true,
                    expirationTurn: target.turnCounter + 1
                })
            }
            break;
        case "burn":
            if (!target.effects.some(x => x.status === "burn")) {
                target.effects.push({
                    status: "burn",
                    damage: 1,
                    stunned: false,
                    expirationTurn: target.turnCounter + 2
                })
            }
            break;
        case "freeze":
            if (!target.effects.some(x => x.status === "freeze")) {
                target.effects.push({
                    status: "freeze",
                    damage: 0,
                    stunned: true,
                    expirationTurn: target.turnCounter + 2
                })
            }
            break;
        case "trap":
            if (!target.effects.some(x => x.status === "trap")) {
                target.effects.push({
                    status: "trap",
                    damage: 1,
                    stunned: true,
                    expirationTurn: target.turnCounter + 2
                })
            }
            break;
        case "poison":
            if (!target.effects.some(x => x.status === "poison")) {
                target.effects.push({
                    status: "poison",
                    damage: 2,
                    stunned: false,
                    expirationTurn: target.turnCounter + 2
                })
            }
            break;
        default:
            break;
    }
}

const calculateStatusEffectsForTurn = (target) => {
    if (!target.effects) return;

    for (const effect of target.effects) {
        if (effect.damage > 0) {
            target.life -= effect.damage;
            console.log(`${target.name} has been damaged by status: ${effect.status} for -${effect.damage}`);
            console.log(`${target.name} life total: ${target.life}`)
            if (target.life < 1) return;
        }
    }
}

const applyDurationToEffects = (target) => {
    if (!target.effects) return;

    let i = target.effects.length;
    while (i--) {
        const effect = target.effects[i];
        if (target.turnCounter === effect.expirationTurn) {
            console.log(`${target.name} is no longer affected by the status effect ${effect.status}`)
            target.effects.splice(i, 1);
            continue;
        }
    }
}

const combatLoop = async () => {
    const player = getClass(classArray[playerClass], playerName);
    const enemyClass = enemySelection();
    const enemy = getClass(classArray[enemyClass], enemyName);

    await wait(2000);

    console.log(`${enemyName} is preparing to attack, what will ${player.name} do?`)

    player.turnCounter = 1;
    enemy.turnCounter = 1;

    while (!(player.life < 1) && !(enemy.life < 1)) {

        calculateStatusEffectsForTurn(player);
        if (player.life < 1) break;
        if (player.effects?.some(x => x.stunned === true)) {
            console.log(`${player.name} is stunned and cannot attack!`);
        } else {
            await playerAction(player, enemy);
        }
        player.turnCounter++
        applyDurationToEffects(player);

        calculateStatusEffectsForTurn(enemy);
        if (enemy.life < 1) break;
        if (enemy.effects?.some(x => x.stunned === true)) {
            console.log(`${enemy.name} is stunned and cannot attack!`);
        } else {
            await enemyAction(enemy, player);
        }
        enemy.turnCounter++
        applyDurationToEffects(enemy);
    }

    if (player.life <= 0) {
        console.log(`${player.name} has died. Better luck next time...`);
        const continueResponse = await getUserInput("Do you wish to try again? [yes/no]: ");
        if (continueResponse !== "yes") {
            console.log(`Until next time, ${playerName}!`);
            process.exit();
        }
        return;
    }

    if (enemy.life <= 0) {
        console.log(`${player.name} have slain ${enemy.name}. May they rest in peace...`);
        const continueResponse = await getUserInput("Do you wish to continue? [yes/no]: ");
        if (continueResponse !== "yes") {
            console.log(`Until next time, ${playerName}!`);
            process.exit();
        }
        return;
    }
}

const mainLoop = async () => {

    await intro();

    while (true) {
        await classSelection();
        await combatLoop();
    }
}

const wait = t => new Promise((resolve, reject) => {
    console.log("");
    console.log("");
    setTimeout(resolve, t);
});

const getUserInput = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

const randomIntFromInterval = (min, max) => {
    // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

mainLoop()