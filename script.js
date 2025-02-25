// Игровые переменные
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// Элементы интерфейса
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const locationImage = document.querySelector("#location-img");
const playerImage = document.querySelector("#player-img");
const monsterImage = document.querySelector("#monster-img");

// Оружие
const weapons = [
  { name: "палка", power: 5 },
  { name: "кинжал", power: 30 },
  { name: "молоток", power: 50 },
  { name: "меч", power: 100 },
];

// Монстры
const monsters = [
  { name: "слайм", level: 2, health: 15, image: "images/slime.png" },
  { name: "зверь", level: 8, health: 60, image: "images/beast.png" },
  { name: "дракон", level: 20, health: 300, image: "images/dragon.png" },
];

// Локации
const locations = [
  {
    name: "городская площадь",
    "button text": ["Пойти в магазин", "Пойти в пещеру", "Сразиться с драконом"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Ты находишься на городской площади. Ты видишь вывеску с надписью «Магазин».',
    image: "images/town.jpg",
  },
  {
    name: "store",
    "button text": [
      "Купить 10 здоровья (10 золота)",
      "Купить оружие (30 золота)",
      "Пойти на городскую площадь",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Ты вошел в магазин",
    image: "images/shop.jpg",
  },
  {
    name: "cave",
    "button text": ["Убить слайма", "Убить зверя", "Пойти на городскую площадь"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Ты вошел в пещеру. Ты видишь монстров...",
    image: "images/cave.jpg",
  },
  {
    name: "fight",
    "button text": ["Атака", "Уклонится", "Сбежать"],
    "button functions": [attack, dodge, goTown],
    text: "Ты сражаешься с монстром",
    image: "images/cave.jpg",
  },
  {
    name: "kill monster",
    "button text": [
      "Пойти на городскую площадь",
      "Пойти на городскую площадь",
      "Пойти на городскую площадь",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'Монстр кричит "Арг!", умирая. Ты получаешь очки опыта и находишь золото.',
  },
  {
    name: "lose",
    "button text": ["НАЧАТЬ ЗАНОВО?", "НАЧАТЬ ЗАНОВО?", "НАЧАТЬ ЗАНОВО?"],
    "button functions": [restart, restart, restart],
    text: "Ты умер. &#x2620;",
  },
  {
    name: "win",
    "button text": ["НАЧАТЬ ЗАНОВО?", "НАЧАТЬ ЗАНОВО?", "НАЧАТЬ ЗАНОВО?"],
    "button functions": [restart, restart, restart],
    text: "Ты победил дракона! ТЫ ВЫИГРАЛ ИГРУ! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Пойти на городскую площадь?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Ты нашел секретную игру. Выбери число выше. Десять чисел будут выбраны случайным образом от 0 до 10. Если выбранное тобой число совпадет с одним из случайных чисел, ты выиграешь!",
  },
];

// Инициализация кнопок
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Обновление интерфейса
function update(location) {
  monsterStats.style.display = "none";
  locationImage.src = location.image || "images/town.jpg";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

// Переход в город
function goTown() {
  update(locations[0]);
}

// Переход в магазин
function goStore() {
  update(locations[1]);
}

// Переход в пещеру
function goCave() {
  update(locations[2]);
}

// Покупка здоровья
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "У тебя не достаточно денег что бы купить здоровье.";
  }
}

// Покупка оружия
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Ты получаешь " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " В твоем инвентаре есть: " + inventory;
    } else {
      text.innerText = "У тебя не достаточно денег что бы купить оружие.";
    }
  } else {
    text.innerText = "У тебя уже есть самое мощное оружие!";
    button2.innerText = "Продать оружие за 15 золота";
    button2.onclick = sellWeapon;
  }
}

// Продажа оружия
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Ты продал: " + currentWeapon + ".";
    text.innerText += " В твоем инвентаре есть: " + inventory;
  } else {
    text.innerText = "Не продавай твое единственное оружие!";
  }
}

// Начало боя с монстром
function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
  monsterImage.src = monsters[fighting].image;
  monsterImage.style.display = "block";
}

// Атака
function attack() {
  const playerImage = document.querySelector("#player-img");
  const monsterImage = document.querySelector("#monster-img");

  playerImage.classList.add("player-attack");
  setTimeout(() => playerImage.classList.remove("player-attack"), 500);

  monsterImage.classList.add("monster-attack");
  setTimeout(() => monsterImage.classList.remove("monster-attack"), 500);

  text.innerText =  monsters[fighting].name + " атакует.";
  text.innerText +=
    " Ты атакуешь его с помощью " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Ты промазал(айайай мазила).";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Твой(е) " + inventory.pop() + " сломано.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "Ты уклонился от атаки " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  monsterImage.style.display = "none";
  update(locations[4]);
}

function lose() {
  const loseSound = document.querySelector("#lose-sound");
  loseSound.play();
  update(locations[5]);
}

function winGame() {
  const winSound = document.querySelector("#win-sound");
  winSound.play();
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["палка"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  monsterImage.style.display = "none"; 
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Ты выбрал " + guess + ". Вот набор чисел:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Верно! Ты выиграл 20 золота!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Не правильно! Ты теряешь 10 здоровья!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
