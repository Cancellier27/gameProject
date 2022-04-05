import Sprite from "./classes/spriteClass.js"

const offset = {
  x: -1025,
  y: -525
}

export default function loadMap(scenario) {
  const mapImage = new Image()
  mapImage.src = scenario.src

  return new Sprite({
    position: {
      x: offset.x + scenario.position.x,
      y: offset.y + scenario.position.y
    },
    image: mapImage,
    velocity: 2
  })
}
