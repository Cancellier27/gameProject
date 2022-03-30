class Monster extends Sprite {
    constructor({
      isEnemy = false,
      name,
      position,
      velocity = 2,
      image,
      frames = {max: 1, hold: 20},
      sprites,
      animate = false,
      rotation = 0,
      attacks,
      status
    }) {
      super({
        position,
        velocity,
        image,
        frames,
        sprites,
        animate,
        rotation
      })
      this.health = status.health
      this.isEnemy = isEnemy
      this.name = name
      this.attacks = attacks
      this.experience = status.experience
      this.expEarned = status.expEarned
      this.level = status.level
    }
  
    faint() {
      document.querySelector(".dialogueBox").innerHTML = this.name + " fainted!"
      gsap.to(this.position, {
        y: this.position.y + 20
      })
      gsap.to(this, {
        opacity: 0
      })
      audio.battle.stop()
      audio.victory.play()
    }

    leveling({recipient}) {
        this.experience += recipient.expEarned
        if (this.experience >= 100) {
            this.level++
            this.experience = 0
        }

        monstersData.Emby.status = {
            ...monstersData.Emby.status,
            experience: this.experience,
            level: this.level
        }
        console.log(this.expEarned)
        console.log(this.health)
    }
  
    attack({attack, recipient, renderSprites}) {
      document.querySelector(".dialogueBox").style.display = "block"
      document.querySelector(".dialogueBox").innerHTML =
        this.name + " used " + attack.name
  
      let healthBar = ".enemyHp"
      if (this.isEnemy) healthBar = ".ourHp"
  
      let rotation = 1
      if (this.isEnemy) rotation = -2.2
  
      recipient.health -= attack.damage
  
      switch (attack.name) {
        case "Fireball":
          audio.initFireball.play()
          const fireballImage = new Image()
          fireballImage.src = "./images/fireball.png"
          const fireball = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y
            },
            image: fireballImage,
            frames: {
              max: 4,
              hold: 10
            },
            animate: true,
            rotation
          })
  
          renderSprites.splice(1, 0, fireball)
  
          gsap.to(fireball.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            duration: 0.7,
            onComplete: () => {
              audio.fireballHit.play()
              gsap.to(healthBar, {
                width: recipient.health + "%"
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              })
              gsap.to(recipient, {
                opacity: 0,
                yoyo: true,
                repeat: 5,
                duration: 0.2
              })
              renderSprites.splice(1, 1)
            }
          })
  
          break
  
        case "Tackle":
          const tl = gsap.timeline()
          let movementDistance = 20
          if (this.isEnemy) movementDistance = -20
  
          tl.to(this.position, {
            x: this.position.x - movementDistance
          })
            .to(this.position, {
              x: this.position.x + movementDistance * 2,
              duration: 0.1,
              onComplete: () => {
                audio.tackleHit.play()
                gsap.to(healthBar, {
                  width: recipient.health + "%"
                })
                gsap.to(recipient.position, {
                  x: recipient.position.x + 10,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08
                })
                gsap.to(recipient, {
                  opacity: 0,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.2
                })
              }
            })
            .to(this.position, {
              x: this.position.x
            })
          break
      }
    }
  }