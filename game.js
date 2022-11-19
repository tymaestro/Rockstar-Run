// Kaboom initialisation settings

kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 1, 1],
})

const MOVE_SPEED = 140
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 700
let CURRENT_JUMP_FORCE = 360
let score = 0
let level = 0
const ENEMY_SPEED = 20
const FALL_DEATH = 400

let isJumping = true
// Our sprites (the artwork that makes up the building blocks of the game)

// sets the location of sprite files
loadRoot('./')
// regular box item
loadSprite('music-note', 'music-note.png')
// enemy sprite
loadSprite('beer', 'beer.png')
// special box item
loadSprite('guitar', 'guitar.png')
// floor block
loadSprite('block', 'block.png')
// surprise-box
loadSprite('surprise-box', 'surprise-box.png')
// rock
// loadSprite('rock', 'rock.png')
loadSprite('rockstar-girl', 'rockstar-girl.png')
// background sprite
loadSprite("bg", "bg.png");
// jump sound effect
// loadSprite("jump-sound", "jump-sound.mp3");

// temporary pipes
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')



// Game render settings
scene("game", ({
    level,
    score
}) => {

    layers(['bg', 'obj', 'ui'], 'obj')

    // These characters represent the sprites that can be found in legend
    const maps = [
        [
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                             @        ',
            '                                      ',
            '            !                         ',
            '                   z                  ',
            '                                      ',
            '       @                              ',
            '                                  -+  ',
            '                         ^  ^     ()   ',
            '======================================',
        ],
        [
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                             @        ',
            '                                      ',
            '            !                         ',
            '                   z                  ',
            '                                      ',
            '       @                              ',
            '                                  -+  ',
            '                         ^  ^     ()   ',
            '======================================',
        ]
    ]

    add([
        sprite("bg", {
            width: width(),
            height: height()
        })
    ]);


    const levelCfg = {
        width: 20,
        height: 20,

        // this is the legend for the sprites and defines the characteristics 
        '=': [sprite('block'), solid()],
        '^': [sprite('beer'), solid(), 'dangerous'],
        '@': [sprite('surprise-box'), solid(), 'guitar-surprise'],
        '!': [sprite('surprise-box'), solid(), 'note-surprise'],
        'x': [sprite('guitar'), solid(), 'guitar', body()],
        'z': [sprite('music-note'), 'note'],
        // 'y': [sprite('rock', solid())],

        // temp pipes
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],


    }
    // defines the map/s that will be rendered for the level
    const gameLevel = addLevel(maps[level], levelCfg)


    // the displayed score in game 
    const scoreText = add([
        text(score),
        pos(30, 200),
        layer('ui'),
        {
            value: score,
        }
    ])

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
    }
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
    })

    // when a player hits an item
    player.collides('guitar', (m) => {
        destroy(m)
        player.biggify(6)
    })

    player.collides('note', (c) => {
        destroy(c)
        scoreText.value++
        scoreText.text = scoreText.value
    })


    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0)
    })

    player.collides('dangerous', (d) => {
        if (isJumping) {
            destroy(d)
        } else {
            go('lose', {
                score: scoreText.value
            })
        }
    })
    // falldeath
    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', {
                score: scoreText.value
            })
        }
    })

    // down a pipe
    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreText.value
            })
        })
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

            player.jump(CURRENT_JUMP_FORCE);
        }
    })

})

// when you die this screen shows
scene('lose', ({
    score
}) => {
    add([text('You scored ' + score + ' Press space to play again', 15), origin('center'), pos(width() / 2, height() / 2)]);


    // restarts the game after death with spacebar 
    keyPress("space", () => {
        go("game", {
            score: 0,
            level: 0,
        });
    });
});

// guess what this does?
start("game", {
    score: 0,
    level: 0,
});