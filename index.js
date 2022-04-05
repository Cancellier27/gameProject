import Boundary from "./classes/boundaryClass.js"
import Sprite from "./classes/spriteClass.js"
import collisions from "./data/collisions.js"
import battleZonesData from "./data/battleZones.js"
import doorData from "./data/door.js"
import {animateBattle} from "./battleScene.js"
import audio from "./data/audio.js"
import loadMap from "./loadMap.js"
import scenarios from "./data/scenarios.js"
import battleZoneCollision from './battleZoneCollision.js'
import rectangleCollisions from './rectangleCollisions.js'

const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

// dimensions of the screen
canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70))
}

const doorsMap = []
for (let i = 0; i < doorData.length; i += 70) {
  doorsMap.push(doorData.slice(i, i + 70))
}

const boundaries = []
const offset = {
  x: -1025,
  y: -525
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol > 1) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
    }
  })
})

const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol > 1) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
    }
  })
})

const doors = []
doorsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol > 1) {
      doors.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
    }
  })
})


const playerDownImage = new Image()
playerDownImage.src = "./images/playerDown.png"

const playerUpImage = new Image()
playerUpImage.src = "./images/playerUp.png"

const playerLeftImage = new Image()
playerLeftImage.src = "./images/playerLeft.png"

const playerRightImage = new Image()
playerRightImage.src = "./images/playerRight.png"

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 8,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  velocity: 2,
  frames: {
    max: 4,
    hold: 20
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage
  }
})

const background = loadMap(scenarios.mainMap)
const foreground = loadMap(scenarios.foreground)

const keys = {
  ArrowUp: {
    pressed: false
  },
  ArrowDown: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

const movables = [
  background,
  ...boundaries,
  foreground,
  ...battleZones,
  ...doors
]



const battle = {
  initiated: false
}

function animatePlayer() {
  document.querySelector("#userInterfaceContainer").style.display = "none"

  const animationId = window.requestAnimationFrame(animatePlayer)

  background.draw()

  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw()
  })
  doors.forEach((door) => {
    door.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true
  player.animate = false
  if (battle.initiated) return

  if (
    keys.ArrowUp.pressed ||
    keys.ArrowDown.pressed ||
    keys.ArrowLeft.pressed ||
    keys.ArrowRight.pressed
  ) {
    battleZoneCollision(battleZones, player, audio, animateBattle, animationId, battle)
  }

  if (keys.ArrowUp.pressed && lastKey === "Up") {
    player.animate = true
    player.image = player.sprites.up

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangleCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + player.velocity
            }
          }
        })
      ) {
        console.log("colliding")
        moving = false
        break
      }
    }

    for (let i = 0; i < doors.length; i++) {
      // console.log(doors[i])
      const door = doors[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          door.position.x + door.width
        ) -
          Math.max(player.position.x, door.position.x)) *
        (Math.min(
          player.position.y + player.height,
          door.position.y + door.height
        ) -
          Math.max(player.position.y, door.position.y))
      if (
        rectangleCollisions({
          rectangle1: player,
          rectangle2: door
        }) &&
        overlappingArea > (player.width * player.height) / 3 &&
        Math.random() < 1
      ) {
        console.log("entrou")
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += player.velocity
      })
  } else if (keys.ArrowLeft.pressed && lastKey === "Left") {
    player.animate = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangleCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + player.velocity,
              y: boundary.position.y
            }
          }
        })
      ) {
        console.log("colliding")
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += player.velocity
      })
  } else if (keys.ArrowRight.pressed && lastKey === "Right") {
    player.animate = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangleCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - player.velocity,
              y: boundary.position.y
            }
          }
        })
      ) {
        console.log("colliding")
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= player.velocity
      })
  } else if (keys.ArrowDown.pressed && lastKey === "Down") {
    player.animate = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangleCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - player.velocity
            }
          }
        })
      ) {
        console.log("colliding")
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= player.velocity
      })
  }
}

let lastKey = ""
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = true
      lastKey = "Up"
      break
    case "ArrowDown":
      keys.ArrowDown.pressed = true
      lastKey = "Down"
      break
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true
      lastKey = "Left"
      break
    case "ArrowRight":
      keys.ArrowRight.pressed = true
      lastKey = "Right"
      break
  }
})

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = false
      break
    case "ArrowDown":
      keys.ArrowDown.pressed = false
      break
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false
      break
    case "ArrowRight":
      keys.ArrowRight.pressed = false
      break
  }
})

let clicked = false
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})

export {animatePlayer, c, battle}
