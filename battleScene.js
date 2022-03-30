const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./images/battleBackground.png"
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

let draggle
let emby
let renderSprites
let battleAnimationId
let queue

function initBattle() {
  document.querySelector("#userInterfaceContainer").style.display = "block"
  document.querySelector(".dialogueBox").style.display = "none"
  document.querySelector(".enemyHp").style.width = "100%"
  document.querySelector(".ourHp").style.width = "100%"
  document.querySelector(".attackOptions").replaceChildren()

  draggle = new Monster(monstersData.Draggle)
  emby = new Monster(monstersData.Emby)
  renderSprites = [draggle, emby]
  queue = []

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button")
    button.innerHTML = attack.name
    document.querySelector(".attackOptions").append(button)
  })

  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedAttack = e.currentTarget.innerHTML
      if (selectedAttack === "") return

      emby.attack({
        attack: attacks[selectedAttack],
        recipient: draggle,
        renderSprites
      })

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint()
          emby.leveling({
            recipient: draggle
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

      // emby or enemy just attack
      const ramdomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

      queue.push(() => {
        draggle.attack({
          attack: ramdomAttack,
          recipient: emby,
          renderSprites
        })
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint()
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
animatePlayer()
// animateBattle()

document.querySelector(".dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else {
    e.currentTarget.style.display = "none"
  }
})
