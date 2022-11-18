// Kaboom initialisation settings

kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 1, 1],
})

// Our sprites (the artwork that makes up the building blocks of the game)

// sets the location of sprite files
loadRoot('./')
// regular box item
loadSprite('music-note', 'music-note.png')
// enemy sprite
loadSprite('beer', 'beer.png')
// special box item
loadSprite('guitar', 'guitar.png')