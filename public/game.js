let gameScene = new Phaser.Scene('Game');

let config = {
    mode: Phaser.Scale.FIT,
    type: Phaser.AUTO, //Phaser will decide how to render our game (WebGL or Canvas)
    width: window.innerWidth,
    height: window.innerHeight + 5,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
};

let game = new Phaser.Game(config);
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
let click;
let button;

let clickButton;
let clickCountText;
let leftButton;
let rightButton;
let upButton;

gameScene.preload = function() {

    this.load.image('background', 'assets/bg.jpg');
    this.load.spritesheet('ground', 'assets/platform.png', { frameWidth: config.height - (98 * config.height / 100), frameHeight: config.height - (98 * config.height / 100) });
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
};

gameScene.create = function() {

    let bg = this.add.sprite(0, 0, 'background');
    bg.setOrigin(0, 0);
    bg.displayWidth = config.width;
    bg.displayHeight = config.height;

    platforms = this.physics.add.staticGroup();

    createPlatform(0, config.width, getPercentFromFrameDimension(95, config.height), 'ground');

    for (let i = getPercentFromFrameDimension(90, config.height); i <= config.height; i += 5) {
        createPlatform(0, config.width, i, 'ground');
    }

    for (let i = 20; i <= 60; i += 20)
        createPlatform(getPercentFromFrameDimension(i, config.width), getPercentFromFrameDimension(i + 10, config.width), getPercentFromFrameDimension(i, config.height), 'ground');

    player = this.physics.add.sprite(getPercentFromFrameDimension(50, config.width), getPercentFromFrameDimension(50, config.height), 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 1,
        setXY: { x: 10, y: 10, stepX: 70 }
    });

    stars.children.iterate(function(child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group({
        // key: 'bomb',
        // repeat: 3,
        // setXY: { x: 1, y: Math.floor(Math.random() * 200), stepX: 1 }
    });

    scoreText = this.add.text(getPercentFromFrameDimension(2, config.width), getPercentFromFrameDimension(2, config.height), 'score: 0', { fontSize: getPercentFromFrameDimension(3, config.width) + 'px', fill: '#FFF' });
    gameText = this.add.text(getPercentFromFrameDimension(40, config.width), getPercentFromFrameDimension(10, config.height), ' ', { fontSize: getPercentFromFrameDimension(2, config.width) + 'px', fill: '#FFF' })
        .setInteractive()
        .on('pointerdown', () => {
            console.log("pointerdown");
        })
        .on('pointerover', () => { console.log("pointerover"); })
        .on('pointerout', () => { console.log("pointerout"); });


    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

}

gameScene.update = function() {
    if (gameOver) {
        return;
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-200);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}


function collectStar(player, star) {
    star.disableBody(true, true);

    score += 1;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {

        for (let i = 0; i < score; i++) {
            var star = stars.create(x, Math.floor(Math.random() * 100), 'star');
            star.setBounce(1);
            star.setCollideWorldBounds(true);
            star.setVelocity(Phaser.Math.Between(-100, 100), 20);
            star.allowGravity = false;
        }

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        // for (let i = 0; i < 3; i++) {
        //     var bomb = bombs.create(x, Math.floor(Math.random() * 800), 'star');
        //     bomb.setBounce(1);
        //     bomb.setCollideWorldBounds(true);
        //     bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        //     bomb.allowGravity = false;
        // }

        var bomb = bombs.create(x, Math.floor(Math.random() * getPercentFromFrameDimension(70, config.height)), 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    gameText.setText('Game over. Try Again!');
}


function createPlatform(startWidth, finishWidth, height, type) {
    for (let i = startWidth; i <= finishWidth; i = i + 5) {
        platforms.create(i, height, type);
    }
}

function getPercentFromFrameDimension(percent, source) {
    percent = 100 - percent;
    return source - (percent * source / 100);
}


gameScene.restart = function() {
    this.registry.destroy();
    this.events.off();
    this.scene.restart();
    console.log("destroy");
}