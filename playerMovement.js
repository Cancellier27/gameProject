import rectangleCollisions from "./rectangleCollisions.js"
import { keys } from "./index.js"

// const keys = {
//   ArrowUp: {
//     pressed: false
//   },
//   ArrowDown: {
//     pressed: false
//   },
//   ArrowLeft: {
//     pressed: false
//   },
//   ArrowRight: {
//     pressed: false
//   }
// }

export default function animatePlayerMovement(player, boundaries, movables, moving) {
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
        return keys
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