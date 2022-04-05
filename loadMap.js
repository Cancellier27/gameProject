import Sprite from "./classes/spriteClass.js"

export default function loadMap(scenario, offset) {
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
