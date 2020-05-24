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
    export enum AngleUnit { Radian, Degree };
    export class Angle {
        private _rad: number;
        private _deg: number;

        constructor(value: number, unit: AngleUnit) {
            if (unit === AngleUnit.Degree) {
                this._deg = value;
                this._rad = value * Math.PI / 180;
            } else {
                this._deg = value * 180 / Math.PI;
                this._rad = value;
            }
        }

        set rad(rad: number) {
            this._deg = rad * 180 / Math.PI;
            this._rad = rad;
        }

        get rad(): number {
            return this._rad;
        }

        set deg(deg: number) {
            this._deg = deg;
            this._rad = deg * Math.PI / 180;
        }

        get deg(): number {
            return this._deg;
        }

        public static fromRad(a: number): Angle {
            return new Angle(a, AngleUnit.Radian);
        }

        public static fromDeg(a: number): Angle {
            return new Angle(a, AngleUnit.Degree);
        }
    }

    // const G = 9.807; // gravity
    const G = 45;
    
    /**
     * Get the x and y components of a vector in given angle
     */
    export function components(vector: number, angle: Angle): {x: number, y: number} {
        return { x: vector * Math.sin(angle.rad), y: vector * Math.cos(angle.rad) };
    }

    /**
     * Calculates the range (distance) on the x-axis the projectile travels before hitting the ground
     * 
     * @param h the initial height of the projectile above ground
     * @param v the total velocity of the projectile
     * @param angleDegrees the angle in which the projectile is shot in degrees
     */
    export function range(h: number, v: number, angle: Angle) {
        // https://en.wikipedia.org/wiki/Range_of_a_projectile
        return v * v / 2 / G * (1 + Math.sqrt(1 + (2 * G * h) / (v * v * Math.pow(Math.sin(angle.rad), 2)))) * Math.sin(2 * angle.rad);
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

    /**
     * Get the vertical velocity vz by the given total velocity and the angle
     */
    export function toVerticalVelocity(v: number, angle: Angle) {
        return v * Math.atan(angle.rad);
    }

    /**
     * Calculate the total speed from the horizontal and vertical speeds
     */
    export function totalSpeed(vx: number, vz: number) {
        return Math.sqrt(vx * vx + vz * vz)
    }

}