import loadMap from "./loadMap.js"
import scenarios from "./data/scenarios.js"
import Sprite from "./classes/spriteClass.js"

const playerDownImage = new Image()
playerDownImage.src = "./images/playerDown.png"

const playerUpImage = new Image()
playerUpImage.src = "./images/playerUp.png"

const playerLeftImage = new Image()
playerLeftImage.src = "./images/playerLeft.png"

const playerRightImage = new Image()
playerRightImage.src = "./images/playerRight.png"

const playerHOuse = new Sprite({
    position: {
      x: 460,
      y: 330
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


const hosue1 = loadMap(scenarios.house1, {x: -230, y: -550})
let hosue1AnimationId

export default function animateHouse1(player) {
    hosue1AnimationId = window.requestAnimationFrame(animateHouse1)
    hosue1.draw()
    playerHOuse.draw()
    // renderSprites.forEach((sprite) => {
    //   sprite.draw()
    // })
  }

  animateHouse1()