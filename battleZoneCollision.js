import { initBattle } from "./battleScene.js"
import rectangleCollisions from './rectangleCollisions.js'
import wildMonstersData from "./data/monsters/wildMonsters.js"
import ourMonstersData from "./data/monsters/ourMonsters.js"

export default function battleZoneCollision(battleZones, player, audio, animateBattle, animationId, battle) {
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
          Math.random() < 0.1
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
                  let ourMonsterName
                  for (const [key, value] of Object.entries(ourMonstersData)) {
                    if (value.selected) {
                      ourMonsterName = `${key}`
                    }
                  }
    
                  let wildMonsterName
                  let ramdomMonsterId = Math.floor(
                    Math.random() * Object.keys(wildMonstersData).length
                  )
                  for (const [key, value] of Object.entries(wildMonstersData)) {
                    if (value.id === ramdomMonsterId) {
                      wildMonsterName = `${key}`
                    }
                  }
    
                  // activate a new animation loop
                  initBattle({enemy: wildMonsterName, ourMonster: ourMonsterName})
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