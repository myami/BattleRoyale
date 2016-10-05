'use strict';

module.exports = class Sphere {
  /**
   *
   * @param {number} x
   * @param {number} y Coordinate Y
   * @param {number} z Coordinate Z
   * @param {number} opt_radius Radius of the Sphere
   */
  constructor(x, y, z, opt_radius) {
      /**
       * X coordinate Center of the Sphere
       * @type {number}
       */
      this.x = x;
      /**
       * Y coordinate Center of the Sphere
       * @type {number}
       */
      this.y = y;
      /**
       * Z coordinate Center of the Sphere
       * @type {number}
       */
      this.z = z;
      /**
       * Radius of the Sphere
       * @type {number}
       */
      this.radius = opt_radius || 1;
  }
    /**
 * Checks if a position is inside a sphere
 * @param  {Vector3} position      point to check
 * @return {boolean}               True if point is inside the sphere false if not
 */
containsPosition(position) {
    return (Math.pow((position.x - this.x), 2) +
    Math.pow((position.y - this.y), 2) +
    Math.pow((position.z - this.z), 2) < Math.pow(this.radius, 2));
}

}
