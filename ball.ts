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
    private angleRadian: number = 0;
    public _v: number = 0;
    public vz: number = 0;
    private t: number = 0;
    private freefall: boolean = true;

    constructor() {
        this.sprite.setFlag(SpriteFlag.Ghost, true);
        this.shadowSprite.setFlag(SpriteFlag.Ghost, true);
        this.z = 5;

        // Inspired by https://physics.stackexchange.com/questions/256468/model-formula-for-bouncing-ball
        game.onUpdate(() => {
            const now = game.runtime();
            const dt = (now - this.t) / 1000;
            const vz = this.vz;
            this.t = now;
            // console.log("vz: " + vz);
            // console.log("height: " + this.height);
            if (this.freefall) {
                const hNew = this.height + this.vz * dt - 0.5 * Ball.G * dt * dt;
                // console.log("hNew: " + hNew);
                if (hNew < 0) {
                    this.height = 0;
                    this.freefall = false;
                    this.leaveBounceMark();
                } else {
                    this.vz = this.vz - Ball.G * dt;
                    this.height = hNew;
                }

            } else {
                this.vz *= -Ball.RHO;
                this.height = 0;
                this.freefall = true;
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

    get x(): number {
        return this.shadowSprite.x;
    }

    get y(): number {
        return this.shadowSprite.y;
    }

    set z(newZ: number) {
        this.shadowSprite.z = newZ;
        this.sprite.z = newZ;
    }

    get z(): number {
        return this.shadowSprite.z;
    }

    set v(newV: number) {
        this._v = newV;
        const vc = trig.vComponents(this._v, this.angleRadian);
        this.sprite.setVelocity(vc.vx, vc.vy);
        this.shadowSprite.setVelocity(vc.vx, vc.vy);
    }

    get v(): number {
        return this._v;
    }

    public setPosition(x: number, y: number, height: number): void {
        this.height = height;
        this.sprite.setPosition(x, y - this.height);
        this.shadowSprite.setPosition(x, y);
    }

    public move(v: number, degrees: number): void {
        this.freefall = true;
        this.angleRadian = trig.toRadian(degrees);
        this.v = v;
        this.vz = Math.min(this.v * Math.atan(trig.toRadian(20)), 20);
        this.t = game.runtime();
    }

    public shot(): void {
        this.freefall = true;
        this.angleRadian = trig.toRadian(180);
        this.v *= 1.5;
        this.vz = Math.min(this.v * Math.atan(trig.toRadian(20)), 20);
        this.t = game.runtime();
    }
}