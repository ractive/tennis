/**
 * Projectile trajectory calculations
 * 
 * Parameter names used:
 * h: height of the projectile from the ground
 * vz: vertical velocity of the projectile
 * vx: horizontal velocity of the projectile
 * v: total velocity of the projectile
 * dt: time
 */
namespace trajectory {
    // const G = 9.807; // gravity
    const G = 45;
    
    export function vComponents(v: number, angle: number): {vx: number, vy: number} {
        const vy = v * Math.cos(angle);
        const vx = v * Math.sin(angle);
        return {vx, vy};
    }

    /**
     * Converts degrees to ratian
     * 
     * @param degrees angle in degrees 
     */
    export function toRadian(degrees: number) {
        return degrees * (Math.PI/180);
    }

    /**
     * Calculates the range (distance) on the x-axis the projectile travels before hitting the ground
     * 
     * @param h the initial height of the projectile above ground
     * @param v the total velocity of the projectile
     * @param angleDegrees the angle in which the projectile is shot in degrees
     */
    export function range(h: number, v: number, angleDegrees: number) {
        const a = toRadian(angleDegrees);
        // https://en.wikipedia.org/wiki/Range_of_a_projectile
        return v * v / 2 / G * (1 + Math.sqrt(1 + (2 * G * h) / (v * v * Math.pow(Math.sin(a), 2)))) * Math.sin(2 * a);
    }

    /**
     * Calculates the new value for the given height, vertical velocity vz after time dt
     * 
     * @param h the current height of the projectile
     */
    export function height(h: number, vz: number, dt: number) {
        return Math.max(h + vz * dt - 0.5 * G * dt * dt, 0);
    }

    /**
     * Calculates the new value for a given vertical velocity after time dt
     * @param
     */
    export function verticalVelocity(vz: number, dt: number) {
        return vz - G * dt;
    }
}