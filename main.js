const readline = require("readline")

let playerName;
let playerClass;
let enemyName = "Your Enemy";

const classArray = ["", "Warrior", "Sorcerer", "Ranger"]

const createWarrior = (name) => {
    return {
        name: name,
        life: 10,
        actions: {
            "sword slash": { damage: 2, effect: "bleed" },
            "shield bash": { damage: 2, effect: "stagger" },
        }
    }
}

const createSorcerer = (name) => {
    return {
        name: name,
        life: 6,
        actions: {
            "cast fireball": { damage: 3, effect: "burn" },
            "cast icebolt": { damage: 3, effect: "freeze" }
        }
    }
}

const createRanger = (name) => {
    return {
        name: name,
        life: 6,
        actions: {
            "set trap": { damage: 2, effect: "trap" },
            "poison arrow": { damage: 3, effect: "poison" }
        }
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
    playerName = await askQuestion("Greetings traveler! Please enter your name: ");
    console.log(`Hello ${playerName}!`);
}

const classSelection = async () => {
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
}

const enemySelection = () => {
    const enemyClass = randomIntFromInterval(1, 3)
    console.log(`Your enemy class is a ${classArray[enemyClass]}`);
    return enemyClass;
}

const calculateEnemyAttack = (enemy) => {
    const rand = randomIntFromInterval(0, 1);
    const count = 0;
    for (const attackKey in enemy.attacks) {
        if (rand == count) {
            return attackKey;
        }
    }
}

const playerAttackAction = async (player, enemy) => {
    console.log("Select your attack (type out the attack exactly): ")
    for (const attackKey in player.attacks) {
        console.log(`  [${attackKey}] damage:${player.attacks[attackKey]}`)
    }
    const playerSelection = await askQuestion();
    const playerAttack = player.actions[playerSelection];
    if (!playerAttack) {
        console.log("Invalid attack selected. You forego your turn.")
        playerAttack = { damage: 0, effect: "none" }
    }
    const playerDamage = randomIntFromInterval(0, playerAttack.damage);
    console.log(`You attack with ${playerSelection}...`);
    await wait(2000);
    if (playerDamage === 0) {
        console.log("Your attack missed!");
        return;
    }

    enemy.life -= playerDamage;
    console.log(`You hit your enemy for ${playerDamage}, bringing their life down to ${enemy.life}`);
    if (playerAttack.effect) {
        applyStatusEffect(enemy, playerAttack.effect);
        if (enemy.effect) {
            console.log(`Enemy has been affected status effect: ${enemy.effect.status}`);
        }
    }
}

const enemyAttackAction = async (enemy) => {
    const enemySelection = calculateEnemyAttack(enemy);
    const enemyAttack = enemy.attack[enemySelection];
    const enemyDamage = randomIntFromInterval(0, enemyAttack.damage);
    console.log(`Your enemy attacks with ${enemySelection}...`);
    await wait(2000);
    if (enemyDamage === 0) {
        console.log("Your enemy attack misses! You got lucky!");
        return;
    }
    player.life -= enemyDamage;
    console.log(`Your enemy hits you for ${enemyDamage}, bringing your life down to ${player.life}`);
    if (enemyAttack.effect) {
        applyStatusEffect(player, enemyAttack.effect);
        if (player.effect) {
            console.log(`You have been affected status effect: ${enemy.effect.status}`);
        }
    }
}

const applyStatusEffect = (target, status) => {

    const applyChance = randomIntFromInterval(0, 1);
    if (applyChance === 0) {
        return;
    }

    switch (status) {
        case "bleed":
            target.effect = {
                status: "bleeding",
                damage: 1,
                stunned: false,
                duration: 2
            }
            break;
        case "stagger":
            target.effect = {
                status: "staggered",
                damage: 0,
                stunned: true,
                duration: 1
            }
            break;
        case "burn":
            target.effect = {
                status: "burning",
                damage: 1,
                stunned: false,
                duration: 2
            }
            break;
        case "freeze":
            target.effect = {
                status: "frozen",
                damage: 0,
                stunned: true,
                duration: 2
            }
            break;
        case "trap":
            target.effect = {
                status: "bleeding",
                damage: 1,
                stunned: true,
                duration: 2
            }
            break;
        case "poison":
            target.effect = {
                status: "poisoned",
                damage: 2,
                stunned: false,
                duration: 2
            }
            break;
        default:
            break;
    }
}

const calculateStatusEffects = (target) => {
    if (!target.effect) return;

    if (target.effect.duration === 0) {
        delete target.effect;
        return;
    }

    if (target.effect.damage > 0) {
        target.life -= target.effect.damage;
        console.log(`${target.name} has been damaged by status: ${target.effect.status} for -${target.effect.damage}`);
        console.log(`${target.name} life total: ${target.life}`)
    }
}

const combatLoop = async () => {
    const player = getClass(classArray[playerClass], playerName);
    const enemyClass = enemySelection();
    const enemy = getClass(classArray[enemyClass], enemyName);

    await wait(2000);

    console.log(`${enemyName} is preparing to attack, what will you do?`)

    while (!(player.life < 1) && !(enemy.life < 1)) {

        calculateStatusEffects(player);
        if (player.life < 1) break;
        calculateStatusEffects(enemy);
        if (enemy.life < 1) break;

        if (player.effect && player.effect.stunned) {
            console.log("You are stunned and cannot attack!");
        } else {
            await playerAttackAction(player, enemy);
        }

        if (enemy.effect && enemy.effect.stunned) {
            console.log(`${enemy.name} is stunned and cannot attack!`);
        } else {
            enemyAttackAction(enemy, player);
        }
    }

    if (player.life <= 0) {
        console.log("You have died. Better luck next time...");
        const continueResponse = await askQuestion("Do you wish to try again? [yes/no]: ");
        if (continueResponse !== "yes") {
            console.log(`Until next time, ${playerName}!`);
            process.exit();
        }
        return;
    }

    if (enemy.life <= 0) {
        console.log(`You have slain ${enemy.name}. May they rest in peace...`);
        const continueResponse = await askQuestion("Do you wish to continue? [yes/no]: ");
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

const wait = t => new Promise((resolve, reject) => setTimeout(resolve, t));

const askQuestion = (query) => {
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