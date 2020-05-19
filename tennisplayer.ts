interface TennisPlayer {
    up(): void;
    down(): void;
    left(): void;
    right(): void;
    serve(): void;
    backhand(): void;
    forehand(): void;
    placeOnTile(x: number, y: number): void;
}

class BasePlayer {
    protected readonly sprite: Sprite;
    protected readonly baseImage: Image;

    constructor(image: Image) {
        this.baseImage = image;
        this.sprite = sprites.create(image);

        game.onUpdate(function () {
            if (!(controller.anyButton.isPressed())) {
                animation.stopAnimation(animation.AnimationTypes.All, this.sprite);
                this.sprite.setImage(this.baseImage);
            }
        });
    }

    get x(): number {
        return this.sprite.x;
    }

    get y(): number {
        return this.sprite.y;
    }

    public placeOnTile(x: number, y: number): void {
        tiles.placeOnTile(this.sprite, tiles.getTileLocation(x, y));
    }
}