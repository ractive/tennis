namespace trig {
    export function angleBetween(sprite1: Sprite, sprite2: Sprite): number {
        const dx: number = sprite2.x - sprite1.x;
        const dy: number = sprite2.y - sprite1.y;
        const a = Math.atan2(dx, dy);
        return a;
    }

    export function vComponents(v: number, angle: number): {vx: number, vy: number} {
        const vy = v * Math.cos(angle);
        const vx = v * Math.sin(angle);
        return {vx, vy};
    }

    export function toRadian(degrees: number) {
        return degrees * (Math.PI/180);
    }

    export function toDegrees(rad: number) {
        return rad * (180/Math.PI);
    }
}