document.addEventListener('DOMContentLoaded', function () {
    const gameFieldHtml = document.querySelector(".game-field");
    let gameField = [];
    let pokemons = [];
    let activeCell = null;

    generateGameField();
    drawGameField();

    function generateGameField() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 16; j++) {
                gameField.push({
                    type: i,
                    order: Math.random()
                });
            }
        }

        gameField.sort(function (pokemon1, pokemon2) {
            return pokemon1.order - pokemon2.order;
        });

        for (let i = 0; i < 9; i++) {
            pokemons.push([]);
            for (let j = 0; j < 16; j++) {
                pokemons[i].push(gameField[9 * i + j].type);
            }
        }
    }

    function drawGameField() {
        let html = '';
        pokemons.forEach(function (row, i) {
            row.forEach(function (pokemon, j) {
                html += `<img
                    class="game-cell"
                    data-x="${i}" data-y="${j}"
                    src="img/pokemon-${pokemon+1}.jpg"
                >`;
            });
        });
        gameFieldHtml.innerHTML = html;
    }

    gameFieldHtml.addEventListener('click', function (event) {
        if (event.target.classList.contains('game-cell')) {
            if (activeCell) {
                document.querySelector('.game-cell-active').classList.remove('game-cell-active');
                activeCell = null;
                check(event.target);
            } else {
                event.target.classList.add('game-cell-active');
                activeCell = {
                    x: event.target.dataset.x,
                    y: event.target.dataset.y,
                };
            }
        }
    });

    function check(target) {
    }
});