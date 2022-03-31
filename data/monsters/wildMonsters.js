import attacks from "../attacks.js"

const wildMonstersData = {
  Emby_1: {
    id: 0,
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: "./images/embySprite.png"
    },
    frames: {
      max: 4,
      hold: 50
    },
    animate: true,
    isEnemy: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
    status: {
      level: 1,
      expEarned: 20,
      experience: 0,
      health: 100
    }
  },
  Draggle_1: {
    id: 1,
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: "./images/draggleSprite.png"
    },
    frames: {
      max: 4,
      hold: 50
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Fireball],
    status: {
      level: 1,
      expEarned: 50,
      experience: 0,
      health: 100
    }
  },
  Draggle_2: {
    id: 2,
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: "./images/draggleSprite.png"
    },
    frames: {
      max: 4,
      hold: 50
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Fireball],
    status: {
      level: 3,
      expEarned: 50,
      experience: 0,
      health: 100
    }
  }
}

export {wildMonstersData as default}
