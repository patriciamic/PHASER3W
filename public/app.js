var config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.EXACT_FIT,
        parent: 'gameArea',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);


console.log("innerwidth " + window.innerWidth + "window.device: " + window.devicePixelRatio);
var tiganie = false;

function updateClickCountText(clickCount) {
    this.clickCountText.setText(`Button has been clicked ${clickCount} times.`);
}


function preload() {
    this.load.crossOrigin = true;
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}


function create() {


    this.add.image(config.scale.width - (50 * config.scale.width / 100), config.scale.height - (50 * config.scale.height / 100), 'sky');

    goFullScreen();
    platforms = this.physics.add.staticGroup();

    console.log(config.scale.width);
    console.log(config.scale.width);
    platforms.create(config.scale.width - (80 * config.scale.width / 100), config.scale.height - (20 * config.scale.height / 100), 'ground').width = 1000;
    platforms.create(config.scale.width - (50 * config.scale.width / 100), config.scale.height - (50 * config.scale.height / 100), 'ground');


    for (let i = 0; i <= config.scale.width; i = i + 100) {
        platforms.create(i, config.scale.height, 'ground');
    }


    player = this.physics.add.sprite(100, 400, 'dude');

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
        setXY: { x: 100, y: 500, stepX: 70 }
    });

    stars.children.iterate(function(child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group({
        // key: 'bomb',
        // repeat: 5000,
        // setXY: { x: 1, y: Math.floor(Math.random() * 200), stepX: 1 }
    });

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    gameText = this.add.text(16, 16, '', { fontSize: '50px', fill: '#FF0' });
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    //this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.clickButton = this.add.text(100, 100, 'Click me!' + config.scale.width, { fill: '#0f0' }).setInteractive();

    onResize();
}

function update() {
    if (gameOver) {
        return;
    }
    //console.log(tiganie);
    if (tiganie) {
        player.setVelocityX(10);
        player.anims.play('right', true);
    } else
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
        player.setVelocityY(-370);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        // stars.children.iterate(function(child) {

        //     child.enableBody(true, child.x, 0, true, true);

        // });


        for (let i = 0; i < 100; i++) {
            var star = stars.create(x, Math.floor(Math.random() * 800), 'star');
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


    }
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');
    gameOver = true;

    scoreText.setText('Game Over');
}

//--------------------------de aici



// function to scale up the game to full screen
function goFullScreen() {
    // setting a background color
    // this.stage.backgroundColor = "#555555";
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    // using RESIZE scale mode
    game.scale.scaleMode = Phaser.Scale.RESIZE;
    game.scale.setScreenSize(true);
}

// function to be called when the game has been created
// function onCreate() {
//     // waiting for a key pressed
//     game.input.keyboard.addCallbacks(this, onDown);
//     // going full screen with the function defined at line 32
//     goFullScreen();
//     // adding the two groups to the game
//     fixedGroup = game.add.group();
//     movingGroup = game.add.group();
//     // drawing the level 
//     drawLevel();
//     // once the level has been created, we wait for the player to touch or click, then we call
//     // beginSwipe function
//     game.input.onDown.add(beginSwipe, this);
//     // placing a text on the horizontal center and bottom of the stage
//     levelText = game.add.text(game.width / 2, game.height, "Level 1", {
//         font: "bold 24px Arial",
//         fill: "#ffffff"
//     });
//     // changing anchor so I don't have to calculate an offset based on text height
//     levelText.anchor.y = 1;
//     // placing a text on the horizontal center and top of the stage
//     titleText = game.add.text(game.width / 2, 0, "BWBan", {
//         font: "bold 24px Arial",
//         fill: "#ffffff"
//     });
//     // normall, onResize is called each time the browser is resized, anyway I am calling it the first time
//     // to place all responsive elements in their right positions.
//     onResize();
// }

function onResize() {
    // this function is called each time the browser is resized, and re-positions
    // game elements to keep them in their right position according to game size
    levelText.x = Math.round((game.width - levelText.width) / 2);
    levelText.y = game.height;
    titleText.x = Math.round((game.width - titleText.width) / 2);
    fixedGroup.x = Math.round((game.width - 320) / 2);
    fixedGroup.y = Math.round((game.height - 320) / 2);
    movingGroup.x = Math.round((game.width - 320) / 2);
    movingGroup.y = Math.round((game.height - 320) / 2);
}

// function drawLevel() {
//     // empty crates array. Don't use crates = [] or it could mess with pointers
//     crates.length = 0;
//     // variable used for tile creation
//     var tile
//         // looping trough all level rows
//     for (var i = 0; i < level.length; i++) {
//         // creation of 2nd dimension of crates array
//         crates[i] = [];
//         // looping through all level columns
//         for (var j = 0; j < level[i].length; j++) {
//             // by default, there are no crates at current level position, so we set to null its
//             // array entry
//             crates[i][j] = null;
//             // what do we have at row j, col i?
//             switch (level[i][j]) {
//                 case PLAYER:
//                 case PLAYER + SPOT:
//                     // player creation
//                     player = game.add.sprite(40 * j, 40 * i, "tiles");
//                     // assigning the player the proper frame
//                     player.frame = level[i][j];
//                     // creation of two custom attributes to store player x and y position
//                     player.posX = j;
//                     player.posY = i;
//                     // adding the player to movingGroup
//                     movingGroup.add(player);
//                     // since the player is on the floor, I am also creating the floor tile
//                     tile = game.add.sprite(40 * j, 40 * i, "tiles");
//                     tile.frame = level[i][j] - PLAYER;
//                     // floor does not move so I am adding it to fixedGroup
//                     fixedGroup.add(tile);
//                     break;
//                 case CRATE:
//                 case CRATE + SPOT:
//                     // crate creation, both as a sprite and as a crates array item
//                     crates[i][j] = game.add.sprite(40 * j, 40 * i, "tiles");
//                     // assigning the crate the proper frame
//                     crates[i][j].frame = level[i][j];
//                     // adding the crate to movingGroup
//                     movingGroup.add(crates[i][j]);
//                     // since the create is on the floor, I am also creating the floor tile
//                     tile = game.add.sprite(40 * j, 40 * i, "tiles");
//                     tile.frame = level[i][j] - CRATE;
//                     // floor does not move so I am adding it to fixedGroup
//                     fixedGroup.add(tile);
//                     break;
//                 default:
//                     // creation of a simple tile
//                     tile = game.add.sprite(40 * j, 40 * i, "tiles");
//                     tile.frame = level[i][j];
//                     fixedGroup.add(tile);
//             }
//         }
//     }
// }

// function to be executed once a key is down
// function onDown(e) {
//     // if the player is not moving...
//     if (!playerMoving) {
//         switch (e.keyCode) {
//             // left
//             case 37:
//                 move(-1, 0);
//                 break;
//                 // up
//             case 38:
//                 move(0, -1);
//                 break;
//                 // right
//             case 39:
//                 move(1, 0);
//                 break;
//                 // down
//             case 40:
//                 move(0, 1);
//                 break;
//                 // undo
//             case 85:
//                 // if there's something to undo...
//                 if (undoArray.length > 0) {
//                     // then undo! and remove the latest move from undoArray
//                     var undoLevel = undoArray.pop();
//                     fixedGroup.destroy();
//                     movingGroup.destroy();
//                     level = [];
//                     level = copyArray(undoLevel);
//                     drawLevel();
//                 }
//                 break;
//         }
//     }
// }

// when the player begins to swipe we only save mouse/finger coordinates, remove the touch/click
// input listener and add a new listener to be fired when the mouse/finger has been released,
// then we call endSwipe function
// function beginSwipe() {
//     startX = game.input.worldX;
//     startY = game.input.worldY;
//     game.input.onDown.remove(beginSwipe);
//     game.input.onUp.add(endSwipe);
// }

// function to be called when the player releases the mouse/finger
// function endSwipe() {
//     // saving mouse/finger coordinates
//     endX = game.input.worldX;
//     endY = game.input.worldY;
//     // determining x and y distance travelled by mouse/finger from the start
//     // of the swipe until the end
//     var distX = startX - endX;
//     var distY = startY - endY;
//     // in order to have an horizontal swipe, we need that x distance is at least twice the y distance
//     // and the amount of horizontal distance is at least 10 pixels
//     if (Math.abs(distX) > Math.abs(distY) * 2 && Math.abs(distX) > 10) {
//         // moving left, calling move function with horizontal and vertical tiles to move as arguments
//         if (distX > 0) {
//             move(-1, 0);
//         }
//         // moving right, calling move function with horizontal and vertical tiles to move as arguments
//         else {
//             move(1, 0);
//         }
//     }
//     // in order to have a vertical swipe, we need that y distance is at least twice the x distance
//     // and the amount of vertical distance is at least 10 pixels
//     if (Math.abs(distY) > Math.abs(distX) * 2 && Math.abs(distY) > 10) {
//         // moving up, calling move function with horizontal and vertical tiles to move as arguments
//         if (distY > 0) {
//             move(0, -1);
//         }
//         // moving down, calling move function with horizontal and vertical tiles to move as arguments
//         else {
//             move(0, 1);
//         }
//     }
//     // stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
//     game.input.onDown.add(beginSwipe);
//     game.input.onUp.remove(endSwipe);
// }

// function to move the player
// function move(deltaX, deltaY) {
//     // if destination tile is walkable...
//     if (isWalkable(player.posX + deltaX, player.posY + deltaY)) {
//         // push current situation in the undo array
//         undoArray.push(copyArray(level));
//         // then move the player and exit the function
//         movePlayer(deltaX, deltaY);
//         return;
//     }
//     // if the destination tile is a crate... 
//     if (isCrate(player.posX + deltaX, player.posY + deltaY)) {
//         // ...if  after the create there's a walkable tils...
//         if (isWalkable(player.posX + 2 * deltaX, player.posY + 2 * deltaY)) {
//             // push current situation in the undo array
//             undoArray.push(copyArray(level));
//             // move the crate
//             moveCrate(deltaX, deltaY);
//             // move the player	
//             movePlayer(deltaX, deltaY);
//         }
//     }
// }

// a tile is walkable when it's an empty tile or a spot tile
// function isWalkable(posX, posY) {
//     return level[posY][posX] == EMPTY || level[posY][posX] == SPOT;
// }

// a tile is a crate when it's a... guess what? crate, or it's a crate on its spot
// function isCrate(posX, posY) {
//     return level[posY][posX] == CRATE || level[posY][posX] == CRATE + SPOT;
// }

// function to move the player
// function movePlayer(deltaX, deltaY) {
//     // now the player is moving
//     playerMoving = true;
//     // moving with a 1/10s tween
//     var playerTween = game.add.tween(player);
//     playerTween.to({
//         x: player.x + deltaX * tileSize,
//         y: player.y + deltaY * tileSize
//     }, 100, Phaser.Easing.Linear.None, true);
//     // setting a tween callback 
//     playerTween.onComplete.add(function() {
//         // now the player is not moving anymore
//         playerMoving = false;
//     }, this);
//     // updating player old position in level array   
//     level[player.posY][player.posX] -= PLAYER;
//     // updating player custom posX and posY attributes
//     player.posX += deltaX;
//     player.posY += deltaY;
//     // updating player new position in level array 
//     level[player.posY][player.posX] += PLAYER;
//     // changing player frame accordingly  
//     player.frame = level[player.posY][player.posX];
// }

// function to move the crate
// function moveCrate(deltaX, deltaY) {
//     // moving with a 1/10s tween
//     var crateTween = game.add.tween(crates[player.posY + deltaY][player.posX + deltaX]);
//     crateTween.to({
//         x: crates[player.posY + deltaY][player.posX + deltaX].x + deltaX * tileSize,
//         y: crates[player.posY + deltaY][player.posX + deltaX].y + deltaY * tileSize,
//     }, 100, Phaser.Easing.Linear.None, true);
//     // updating crates array   
//     crates[player.posY + 2 * deltaY][player.posX + 2 * deltaX] = crates[player.posY + deltaY][player.posX + deltaX];
//     crates[player.posY + deltaY][player.posX + deltaX] = null;
//     // updating crate old position in level array  
//     level[player.posY + deltaY][player.posX + deltaX] -= CRATE;
//     // updating crate new position in level array  
//     level[player.posY + 2 * deltaY][player.posX + 2 * deltaX] += CRATE;
//     // changing crate frame accordingly  
//     crates[player.posY + 2 * deltaY][player.posX + 2 * deltaX].frame = level[player.posY + 2 * deltaY][player.posX + 2 * deltaX];
// }

// need a recursive function to copy arrays, no need to reinvent the wheel so I got it here
// http://stackoverflow.com/questions/10941695/copy-an-arbitrary-n-dimensional-array-in-javascript 
// function copyArray(a) {
//     var newArray = a.slice(0);
//     for (var i = newArray.length; i > 0; i--) {
//         if (newArray[i] instanceof Array) {
//             newArray[i] = copyArray(newArray[i]);
//         }
//     }
//     return newArray;
// }
// }