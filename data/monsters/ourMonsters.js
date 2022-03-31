import attacks from "../attacks.js"

const ourMonstersData = {
  Emby_1: {
    id: 0,
    selected: true,
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: "./images/embySprite.png"
    },
    frames: {
      max: 4,
      hold: 50
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
    status: {
      level: 1,
      expEarned: 20,
      experience: 0,
      health: 100
    }
  },
  Emby_2: {
      id: 1,
    selected: false,
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: "./images/embySprite.png"
    },
    frames: {
      max: 4,
      hold: 50
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
    status: {
      level: 5,
      expEarned: 20,
      experience: 0,
      health: 100
    }
  }
}

export {ourMonstersData as default}
