import {animatePlayer, battle} from "./index.js"
import Sprite from "./classes/spriteClass.js"
import attacks from "./data/attacks.js"
import Monster from "./classes/monsterClass.js"
import ourMonstersData from "./data/monsters/ourMonsters.js"
import wildMonstersData from "./data/monsters/wildMonsters.js"
import audio from "./data/audio.js"

const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./images/battleBackground.png"
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

let enemySprite
let friendSprite
let renderSprites
let battleAnimationId
let queue

// added parameters to make the monsters dynamic
function initBattle({enemy, ourMonster}) {
  document.querySelector("#userInterfaceContainer").style.display = "block"
  document.querySelector(".dialogueBox").style.display = "none"
  document.querySelector(".enemyHp").style.width = "100%"
  document.querySelector(".ourHp").style.width = "100%"
  document.querySelector(".attackOptions").replaceChildren()

  // give the right names to our pokes with levels
  document.querySelector(
    ".pokeNameEnemy"
  ).innerHTML = `${wildMonstersData[enemy].name} ${wildMonstersData[enemy].status.level}`
  document.querySelector(
    ".pokeNameFriend"
  ).innerHTML = `${ourMonstersData[ourMonster].name} ${ourMonstersData[ourMonster].status.level}`

  enemySprite = new Monster(wildMonstersData[enemy])
  friendSprite = new Monster(ourMonstersData[ourMonster])
  renderSprites = [enemySprite, friendSprite]
  queue = []

  enemySprite.showingEnemyUp()

  // shows initial message to the player.
  timeTest(enemySprite)

  // while(initialMessageTimeOut !== 0) {
  //   console.log('waiting')
  // }

  friendSprite.attacks.forEach((attack) => {
    const button = document.createElement("button")
    button.innerHTML = attack.name
    document.querySelector(".attackOptions").append(button)
  })
  console.log("aqui ja")
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedAttack = e.currentTarget.innerHTML
      if (selectedAttack === "") return

      friendSprite.attack({
        attack: attacks[selectedAttack],
        recipient: enemySprite,
        renderSprites
      })

      if (enemySprite.health <= 0) {
        queue.push(() => {
          enemySprite.faint()
          friendSprite.leveling({
            recipient: enemySprite
          })
        })
        queue.push(() => {
          // fade back to black
          gsap.to("#battleZoneContainer", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animatePlayer()
              document.querySelector("#userInterfaceContainer").style.display =
                "none"

              gsap.to("#battleZoneContainer", {
                opacity: 0
              })

              battle.initiated = false
              audio.Map.play()
            }
          })
        })
      }

      // friendSprite or enemy just attack
      const ramdomAttack =
        enemySprite.attacks[
          Math.floor(Math.random() * enemySprite.attacks.length)
        ]

      queue.push(() => {
        enemySprite.attack({
          attack: ramdomAttack,
          recipient: friendSprite,
          renderSprites
        })
        if (friendSprite.health <= 0) {
          queue.push(() => {
            friendSprite.faint()
          })

          queue.push(() => {
            // fade back to black
            gsap.to("#battleZoneContainer", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animatePlayer()
                document.querySelector(
                  "#userInterfaceContainer"
                ).style.display = "none"

                gsap.to("#battleZoneContainer", {
                  opacity: 0
                })

                battle.initiated = false
                audio.Map.play()
              }
            })
          })
        }
      })
    })

    btn.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector(".attackType").innerHTML = selectedAttack.type
      document.querySelector(".attackType").style.color = selectedAttack.color
    })
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  renderSprites.forEach((sprite) => {
    sprite.draw()
  })
}
// initBattle()
// animatePlayer()
// animateBattle()

document.querySelector(".dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else {
    e.currentTarget.style.display = "none"
  }
})

function timeTest(monster) {
  document.querySelector(".dialogueBox").style.display = "block"
  document.querySelector(".dialogueBox").innerHTML =
    "A wild " + monster.name + " has appeared!"
  const hideInitialMessage = () =>
    (document.querySelector(".dialogueBox").style.display = "none")
  setTimeout(hideInitialMessage, 4000)
}

export {initBattle, animateBattle}
