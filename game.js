// Kaboom initialisation settings

kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 1, 1],
})

const MOVE_SPEED = 140
const CURRENT_JUMP_FORCE = 360

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

// Game render settings
scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    // These characters represent the sprites that can be found in legend
    const map = [
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '          x                           ',
        '                             @        ',
        '                                      ',
        '                                      ',
        '                   z                  ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                         ^  ^         ',
        '======================================',
    ]


    const levelCfg = {
        width: 20,
        height: 20,

        // this is the legend for the sprites and defines the characteristics 
        '=': [sprite('block'), solid()],
        '^': [sprite('beer'), solid(), 'dangerous'],
        '@': [sprite('surprise-box', solid())],
        'x': [sprite('guitar', solid())],
        'z': [sprite('music-note', solid())],
        // 'y': [sprite('rock', solid())],


    }
    // defines the map/s that will be rendered for the level
    const gameLevel = addLevel(map, levelCfg)

    // these are the player settings. we need three of these functions for the three players in an if statement 
    const player = add([
        sprite('rockstar-girl'), solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ])

    // the displayed score in game 
    const scoreText = add([
        text('I will be the score'),
        pos(30, 6),
        layer('ui'),
        {
            value: 'test',
        }
    ])

    add([text('level' + 'test', pos(4, 6))])

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })


})


// guess what this does?
start('game')