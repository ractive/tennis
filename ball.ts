class Ball {
    private static readonly G = 45; // "gravity";
    private static readonly RHO = 0.7; // coefficient of restitution
    private static readonly TAU = 0.1; // contact time for bounce
    private static readonly HSTOP = 2; // stop when bounce is less than 1


    private static readonly image: Image = img`
        . f f f f . 
        f d 5 5 d f 
        f 5 d d 5 f 
        f 5 5 5 5 f 
        f 5 d d 5 f 
        . f f f f . 
    `;
    private static readonly shadowImage: Image = img`
        . f f f f . 
        f f f f f f 
        . f f f f . 
    `;
    private static readonly bounceImage: Image = img`
        . b . b .
        b . b . b
        . b . b .
    `;

    private readonly shadowSprite = sprites.create(Ball.shadowImage);
    private readonly sprite = sprites.create(Ball.image);
    private _height: number = 0;
    private angle: trajectory.Angle = trajectory.Angle.fromDeg(0);
    public _v: number = 0;
    /**
     * vz is the vertical speed of the ball
     */
    public vz: number = 0;
    private t: number = 0;

    constructor() {
        this.sprite.setFlag(SpriteFlag.Ghost, true);
        this.shadowSprite.setFlag(SpriteFlag.Ghost, true);
        this.z = 5;

        // https://www.omnicalculator.com/physics/trajectory-projectile-motion
        // https://www.omnicalculator.com/physics/projectile-motion
        game.onUpdate(() => {
            const now = game.runtime();
            const dt = (now - this.t) / 1000;
            const vz = this.vz;
            this.t = now;

            // calucate the new height of the ball
            this.height = trajectory.height(this.height, this.vz, dt);
            // calculate new vertical velocity
            this.vz = trajectory.verticalVelocity(this.vz, dt);
            if (this.height === 0) {
                // ball hits ground and bounces
                this.leaveBounceMark();
                // vertical velocity changes direction (-1) and is damped (RHO) by bounce
                this.vz *= Ball.RHO * -1;
                // horizontal velocity also is decreased because of the damping on the ground
                this.v *= 0.8;
            }
        });
    }

    public leaveBounceMark() {
        const bounceSprite = sprites.create(Ball.bounceImage);
        bounceSprite.setPosition(this.x, this.y);
        bounceSprite.setFlag(SpriteFlag.Ghost, true);
        bounceSprite.lifespan = 400;
        bounceSprite.z = this.z - 1;
    }

    set height(height: number) {
        this._height = height;
        this.sprite.setPosition(this.shadowSprite.x, this.shadowSprite.y - this._height - 2);
    }

    get height(): number {
        return this._height;
    }

    set x(x: number) {
        this.sprite.setPosition(x, this.sprite.y - this.height);
        this.shadowSprite.setPosition(x, this.shadowSprite.y);
    }

    get x(): number {
        return this.shadowSprite.x;
    }

    set y(y: number) {
        this.sprite.setPosition(this.sprite.x, y - this.height);
        this.shadowSprite.setPosition(this.shadowSprite.x, y);
    }

    get y(): number {
        return this.shadowSprite.y;
    }

    set z(z: number) {
        this.shadowSprite.z = z;
        this.sprite.z = z;
    }

    get z(): number {
        return this.shadowSprite.z;
    }

    set v(v: number) {
        this._v = v;
        const vc = trajectory.components(this._v, this.angle);
        this.sprite.setVelocity(vc.x, vc.y);
        this.shadowSprite.setVelocity(vc.x, vc.y);
    }

    /**
     * v is the horizontal speed in the direction of the ball
     */
    get v(): number {
        return this._v;
    }

    public shoot(x: number, y: number, h: number, angle: trajectory.Angle, v: number) {
        this.angle = angle;
        const trajectoryAngle = trajectory.Angle.fromDeg(20);
        this.height = h;
        this.x = x;
        this.y = y;
        this.v = v;
        this.vz = v * Math.tan(trajectoryAngle.rad);

        const d = trajectory.range(h, trajectory.totalSpeed(v, this.vz), trajectoryAngle);

        //this.vz = Math.min(this.vz, 20);
        
        const p = trajectory.components(d, this.angle);
        const m = sprites.create(img`
            2 2
            2 2
        `);
        m.setPosition(x + p.x, y + p.y);
        m.lifespan = 3000;
        this.t = game.runtime();
    }

    public shot(): void {
        this.angle.deg = 180;
        this.v = this.v;
        this.vz = Math.min(trajectory.toVerticalVelocity(this.v, trajectory.Angle.fromDeg(15)), 20);
        this.t = game.runtime();
    }
}