document.getElementById('start-button').addEventListener('click', startGame)

const btn = document.getElementById('start-button');

btn.addEventListener('click', () => {
  // hide button
  btn.style.display = 'none';

  // show div
  const box = document.getElementById('game');
});


// Kaboom initialisation settings
function startGame() {
    kaboom({
        global: true,
        width: 640,
        height: 480,
        canvas: document.querySelector("#game"),
        clearColor: [0, 0, 1, 1],
    })

    const MOVE_SPEED = 140
    const JUMP_FORCE = 400
    const BIG_JUMP_FORCE = 500
    let CURRENT_JUMP_FORCE = 400
    let score = 0
    let level = 0
    const ENEMY_SPEED = 20
    const FALL_DEATH = 400


    let isJumping = true
    // Our sprites (the artwork that makes up the building blocks of the game)

    // sets the location of sprite files
    loadRoot('./assets/');
    // regular box item
    loadSprite('music-note', 'images/music-note.png');
    // enemy sprite
    loadSprite('beer', 'images/beer.png');
    loadSprite('boy', 'images/boy.png');
    loadSprite('boy2', 'images/boy2.png');
    loadSprite('girl', 'images/girl.png');
    // special box item
    loadSprite('guitar', 'images/guitar.png');
    // floor block
    loadSprite('block', 'images/brick.png');
    // surprise-box
    loadSprite('surprise-box', 'images/surprise-box.png');
    // rockstar-girl
    loadSprite('rockstar-girl', 'images/rockstar-girl.png');
    // background sprite
    loadSprite("bg", "images/bg.png");
    // limo next level sprite
    loadSprite('limo', 'images/limo.png');
    // grass
    loadSprite('grass', 'images/grass.png');
    // mic stand
    loadSprite('mic', 'images/mic.png');
    loadSprite('lose', 'images/game-over.png')

    // jump sound
    loadSound("jump", "audio/jump.wav");
    // guitar sound
    loadSound("guitar", "audio/guitar.mp3");
    // limo sound
    loadSound("limo", "audio/limo.mp3");
    // horn sound
    loadSound("horn", "audio/horn.mp3");
    // smash sound
    loadSound("smash", "audio/smash.mp3");
    // rock music
    loadSound("rock-music", "audio/rock-music.mp3");
    // headbump
    loadSound("headbump", "audio/headbump.mp3");
    // gameover sound
    loadSound("gameover", "audio/gameover.wav");
    // victory sound
    loadSound("victory", "audio/victory.mp3");
    // gasp sound
    loadSound("gasp", "audio/gasp.wav");

    scene('welcome', ({}) => {
        add([text('Welcome to Rockstar Run!\n\nPress space to continue', 15), origin('center'), pos(width() / 2, height() / 2)]);


        keyPress("space", () => {
            go("instructions", {
                score: 0,
                level: 0,
            });
        });
    });

    scene('instructions', ({}) => {
        add([text('Instructions\n\n\n\n-Use left and right arrows to move\n\n\n-Use the spacebar to jump\n\n\n\n-Press down to enter a limo\n\n\n\nAvoid the beers (bad for your health)\n\n\n\nPress space to play', 15), origin('center'), pos(width() / 2, height() / 2)]);


        keyPress("space", () => {
            go("game", {
                score: 0,
                level: 0,
            });
        });
    });

    // Game render settings
    scene("game", ({
        level,
        score
    }) => {

        layers(['bg', 'obj', 'ui'], 'obj')

        // These characters represent the sprites that can be found in legend

        // play global music


        const maps = [
            [
                '                                      ',
                '                                      ',
                '                                      ',
                '                                      ',
                '                                      ',
                '     !   @!!!                         ',
                '                                      ',
                '                                      ',
                '                    ^   ^        +    ',
                '==============================   =====',
            ],
            [
                '                                            ',
                '                                            ',
                '                                 !          ',
                '                                            ',
                '                               =            ',
                '         !!!@!!              = =            ',
                '                           = = =            ',
                '                         = = = =            ',
                '                ^   ^  = = = = =       +    ',
                '================================       =====',
            ],
            [
                "                                                                                                ",
                "                                                                                                ",
                "                                                                                                ",
                "                                                                                                ",
                "                        !                                                                       ",
                "       @                                                                                        ",
                "                                                                                                ",
                "      =====                  =                                                                  ",
                "                                  =                  !                                          ",
                "               =                                               @                                ",
                "                                      =                 !                                       ",
                "                  =              =    =                                                         ",
                "                           =     =    =                =                                        ",
                "       f                   =     =    =   ^   ^        =      g           b               +     ",
                "================     ===========================================================================",
            ],
            [
                "                                                                                             ",
                "                                                                                             ",
                "                                                                                             ",
                "                                       z                                                     ",
                "                                                                                             ",
                "                                   =!=                                                       ",
                "                                                                                             ",
                "      =@===                  =!=    ===                                                      ",
                "                                                                                             ",
                "                                                                                             ",
                "                            ==                                                               ",
                "       =                   =                                                                 ",
                "       =                                            =                                        ",
                "       =       ^        ^                       ^   =              fg                b m     ",
                "================     ====================================     ===============================",
            ]
        ]




        const levelCfg = {
            width: 20,
            height: 20,

            // this is the legend for the sprites and defines the characteristics 
            '=': [sprite('block'), solid()],
            'g': [sprite('grass'), solid()],
            '^': [sprite('beer'), solid(), 'dangerous'],
            'b': [sprite('boy'), solid(), scale(0.5), 'fan'],
            'f': [sprite('boy2'), solid(), scale(0.5), 'fan'],
            'g': [sprite('girl'), solid(), scale(0.5), 'fan'],
            '@': [sprite('surprise-box'), solid(), 'guitar-surprise'],
            '!': [sprite('surprise-box'), solid(), 'note-surprise'],
            'x': [sprite('guitar'), solid(), 'guitar', body()],
            'z': [sprite('music-note'), 'note'],
            '+': [sprite('limo'), solid(), scale(1.3), 'limo'],
            'm': [sprite('mic'), solid(), scale(1.3), 'mic'],

        }
        const music = play("rock-music", {
            volume: 0.1,
            loop: false
        })
        // defines the map/s that will be rendered for the level
        const gameLevel = addLevel(maps[level], levelCfg);


        // the displayed score in game 
        const scoreText = add([
            text("Score: " + score),
            pos(35, 25),
            layer('ui'),
            {
                value: score,
            }
        ]);

        add([text('level ' + parseInt(level + 1)), pos(40, 6)])
        // the logic that makes things jump out of boxes

        // the logic that will allow us to get bigger when we touch a guitar
        function big() {
            let timer = 0
            let isBig = false
            return {
                update() {
                    if (isBig) {
                        CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                        timer -= dt()
                        if (timer <= 0) {
                            this.smallify()
                        }
                    }
                },
                isBig() {
                    return isBig
                },
                smallify() {
                    this.scale = vec2(1)
                    CURRENT_JUMP_FORCE = JUMP_FORCE
                    timer = 0
                    isBig = false
                },
                biggify(time) {
                    this.scale = vec2(2)
                    timer = time
                    isBig = true
                }
            }
        };
        // these are the player settings. we need three of these functions for the three players in an if statement 
        const player = add([
            sprite('rockstar-girl'), solid(),
            pos(30, 0),
            body(),
            big(),
            origin('bot')
        ])


        // makes guitars move when they come out of a box
        action('guitar', (m) => {
            m.move(25, 0)
        })

        player.on("headbump", (obj) => {
            if (obj.is('note-surprise')) {
                gameLevel.spawn('z', obj.gridPos.sub(0, 1))
                destroy(obj)
                gameLevel.spawn('}', obj.gridPos.sub(0, 0))
            }
            if (obj.is('guitar-surprise')) {
                gameLevel.spawn('x', obj.gridPos.sub(0, 1))
                destroy(obj)
                gameLevel.spawn('}', obj.gridPos.sub(0, 0))
            }
            play("headbump");
        })


        // when a player hits an item
        player.collides('guitar', (m) => {
            destroy(m)
            play("guitar");
            player.biggify(6)
        })

        player.collides('note', (c) => {
            destroy(c)
            play("horn");
            scoreText.value++
            scoreText.text = scoreText.value
        })


        action('dangerous', (d) => {
            d.move(-ENEMY_SPEED, 0)
        })

        action('fan', (c) => {
            c.move(-ENEMY_SPEED, 0)
        })

        player.collides('dangerous', (d) => {
            if (isJumping) {
                destroy(d)
                play("smash");
            } else {
                go('lose', {
                    score: scoreText.value
                })
                music.pause()
                play("gameover");
            }
        })

        player.collides('fan', (f) => {
            if (isJumping) {
                destroy(f)
                play("gasp");
            } else {
                go('lose', {
                    score: scoreText.value
                })
                music.pause()
                play("gameover");
            }
        })

        // falldeath
        player.action(() => {
            camPos(player.pos)
            if (player.pos.y >= FALL_DEATH) {
                go('lose', {
                    score: scoreText.value
                })
                music.pause()
                play("gameover");
            }
        })

        // down a limo
        player.collides('limo', () => {
            keyPress('down', () => {
                if (level < maps.length - 1) {
                    go('game', {
                        level: (level + 1) % maps.length,
                        score: scoreText.value

                    })
                    music.pause()
                    play("limo");
                } else {
                    go("win", {
                        score: scoreText.value
                    })
                    music.pause()
                    play("victory");
                }
            })
        })

        player.collides("mic", () => {
            go("win", {
                score: scoreText.value
            })
            music.pause()
            play("victory");
        })

        // player controls
        keyDown('left', () => {
            player.move(-MOVE_SPEED, 0)
        })

        keyDown('right', () => {
            player.move(MOVE_SPEED, 0)
        })

        player.action(() => {
            if (player.grounded()) {
                isJumping = false
            }
        })

        keyPress('space', () => {
            if (player.grounded()) {
                isJumping = true;
                play("jump");
                player.jump(CURRENT_JUMP_FORCE);
            }
        })

    })

    // when you win this screen shows
    scene('win', ({
        score
    }) => {
        add([text('Winner!\n\nYou scored ' + score + '.\n\nPress space to play again', 15), origin('center'), pos(width() / 2, height() / 2)]);


        // restarts the game after win
        keyPress("space", () => {
            go("welcome", {
                score: 0,
                level: 0,
            });
        });
    });


    // [sprite('mic'), solid(), scale(1.3), 'mic'],

    // when you die this screen shows
    scene('lose', ({
        score
    }) => {

        // Game over image
        add([
                sprite('lose'),
                solid(),
                origin('center'),
                scale(0.2),
                pos(width() / 2,
                    height() / 2),
            ]),

            // Game over text with score
            add([
                text('You scored ' + score + '\n\nPress space to play again', 15),
                origin('center'),
                pos(320,
                    450)
            ]);

        // restarts the game after death with spacebar 
        keyPress("space", () => {
            go("game", {
                score: 0,
                level: 0,
            });
        });

    })
    // guess what this does?
    start("welcome", {
        score: 0,
        level: 0,

    });
};
