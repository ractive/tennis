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

    private readonly shadowSprite = sprites.create(Ball.shadowImage);
    private readonly sprite = sprites.create(Ball.image);
    private _height: number = 0;
    private angle: number = 0;
    public v: number = 0;
    private vz: number = 0;
    private t: number = 0;
    private freefall: boolean = true;

    constructor() {
        this.sprite.setFlag(SpriteFlag.Ghost, true);
        this.shadowSprite.setFlag(SpriteFlag.Ghost, true);

        // https://physics.stackexchange.com/questions/256468/model-formula-for-bouncing-ball
        game.onUpdate(() => {
            const now = game.runtime();
            const dt = (now - this.t) / 1000;
            const vz = this.vz;
            this.t = now;
            console.log("vz: " + vz);
            console.log("height: " + this.height);
            if (this.freefall) {
                const hNew = this.height + this.vz * dt - 0.5 * Ball.G * dt * dt;
                console.log("hNew: " + hNew);
                if (hNew < 0) {
                    this.height = 0;
                    this.freefall = false;
                } else {
                    this.vz = this.vz - Ball.G * dt;
                    this.height = hNew;
                }

            } else {
                this.vz *= -Ball.RHO;
                this.height = 0;
                this.freefall = true;
                this.v *= 0.8;

                this.calcV();
            }
            
        });
    }

    set height(h: number) {
        //this._height = Math.max(h, 2);
        this._height = h;
        this.sprite.setPosition(this.shadowSprite.x, this.shadowSprite.y - this._height);
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

    public setPosition(x: number, y: number, height: number): void {
        this.height = height;
        this.sprite.setPosition(x, y - this.height);
        this.shadowSprite.setPosition(x, y);
    }

    public move(v: number, degrees: number): void {
        this.freefall = true;
        this.v = v;
        this.angle = trig.toRadian(degrees);

        this.t = game.runtime();
        this.calcV();
    }

    public shot() {
        this.freefall = true;
        this.v *= 1.5;
        this.angle -= trig.toRadian(180);

        this.t = game.runtime();
        this.calcV();
    }

    private calcV() {
        const vc = trig.vComponents(this.v, this.angle);
        this.sprite.setVelocity(vc.vx, vc.vy);
        this.shadowSprite.setVelocity(vc.vx, vc.vy);
    }
}