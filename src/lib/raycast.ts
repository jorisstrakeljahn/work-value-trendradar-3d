import { Raycaster, Vector2 } from 'three'
import type { Camera, Object3D } from 'three'

/**
 * Performs a raycast to find objects under the mouse cursor
 */
export function performRaycast(
  event: MouseEvent,
  camera: Camera,
  objects: Object3D[],
  width: number,
  height: number
): Object3D[] {
  const raycaster = new Raycaster()
  const mouse = new Vector2()

  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  return raycaster
    .intersectObjects(objects, true)
    .map(intersection => intersection.object)
}
