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

const boundaries = []
const offset = {
  x: -1025,
  y: -525
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
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
    if (symbol === 1025) {
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

const mapImage = new Image()
mapImage.src = "./images/Pokemon_MAP_1.png"

const foregroundImage = new Image()
foregroundImage.src = "./images/foregroungObjects.png"

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

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: mapImage,
  velocity: 2
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage,
  velocity: 2
})

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

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangleCollisions({rectangle1, rectangle2}) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

const battle = {
  initiated: false
}

function animatePlayer() {
  document.querySelector("#userInterfaceContainer").style.display =
  "none"

  const animationId = window.requestAnimationFrame(animatePlayer)

  background.draw()

  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw()
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
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))
      if (
        rectangleCollisions({
          rectangle1: player,
          rectangle2: battleZone
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("activate battle")
        window.cancelAnimationFrame(animationId)

        audio.Map.stop()
        audio.initBattle.play()
        audio.battle.play()
        
        battle.initiated = true
        gsap.to("#battleZoneContainer", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#battleZoneContainer", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                // activate a new animation loop
                initBattle()
                animateBattle()
                gsap.to("#battleZoneContainer", {
                  opacity: 0,
                  duration: 0.4
                })
              }
            })
          }
        })
        break
      }
    }
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
addEventListener('click', () => {
  if (!clicked){
    audio.Map.play()
    clicked = true
  }
})
