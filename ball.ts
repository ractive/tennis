class Ball {
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

    private readonly sprite = sprites.create(Ball.image);
    private readonly shadowSprite = sprites.create(Ball.shadowImage);

    constructor() {
        this.sprite.setFlag(SpriteFlag.Ghost, true);
        this.shadowSprite.setFlag(SpriteFlag.Ghost, true);
    }
}