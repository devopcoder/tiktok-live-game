let hp = 1000;
const hpText = document.getElementById("hp-text");
const hpBar = document.getElementById("hp-bar");
const log = document.getElementById("log");

const giftSound = new Audio("sounds/gift.mp3");
const damageSound = new Audio("sounds/damage.mp3");
const healSound = new Audio("sounds/heal.mp3");

function updateHP(change, source) {
  hp += change;
  if (hp > 1000) hp = 1000;
  if (hp < 0) hp = 0;

  hpBar.style.width = `${(hp / 1000) * 100}%`;
  hpText.textContent = `HP: ${hp}`;

  const li = document.createElement("li");
  li.textContent = `${source}: ${change > 0 ? "+" : ""}${change} HP`;
  log.prepend(li);

  if (change > 0) {
    healSound.play();
  } else {
    damageSound.play();
  }
}

const socket = io("http://localhost:3000");

socket.on("giftEvent", (data) => {
  updateHP(data.change, `${data.type.toUpperCase()}: ${data.name}`);
});
