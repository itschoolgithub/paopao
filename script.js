document.addEventListener('DOMContentLoaded', function () {
    const gameField = document.querySelector(".game-field");
    let cards = [];
    let activeCard = null;

    generateGameField();
    drawGameField();

    function generateGameField() {
        let temp = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 18; j++) {
                temp.push({
                    type: j,
                    order: Math.random()
                });
            }
        }

        temp.sort(function (card1, card2) {
            return card1.order - card2.order;
        });

        for (let y = 0; y < 9; y++) {
            cards.push([]);
            for (let x = 0; x < 16; x++) {
                cards[y].push(temp[16 * y + x].type);
            }
        }
        console.log(cards);
    }

    function drawGameField() {
        let html = '';
        cards.forEach(function (row, y) {
            row.forEach(function (card, x) {
                html += `<img
                    class="game-cell"
                    data-type="${card}" data-x="${x}" data-y="${y}" 
                    src="img/card-${card+1}.jpg"
                >`;
            });
        });
        gameField.innerHTML = html;
    }

    gameField.addEventListener('click', function (event) {
        if (event.target.classList.contains('game-cell') && !event.target.classList.contains('game-cell-hide')) {
            if (activeCard) {
                activeCard.classList.remove('game-cell-active');
                check(activeCard, event.target);
                activeCard = null;
            } else {
                activeCard = event.target;
                activeCard.classList.add('game-cell-active');
            }
        }
    });

    function check(card1, card2) {
        if (card1 == card2) {
            return;
        }

        if (card1.dataset.type != card2.dataset.type) {
            return;
        }

        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        let queue = [
            {
                x: +card1.dataset.x,
                y: +card1.dataset.y,
                direction: null,
                lines: 0,
                path: []
            }
        ];

        while (queue.length > 0) {
            let current = queue.shift();
            for (let i = 0; i < 4; i++) {
                let temp = JSON.parse(JSON.stringify(current));
                let x = temp.x + directions[i][0];
                let y = temp.y + directions[i][1];
                temp.lines = 
                    (temp.direction !== null && temp.direction[0] == directions[i][0] &&
                    temp.direction[1] == directions[i][1])
                    ? temp.lines : temp.lines + 1;
                if (
                    (x >= -1 && x <= 16 && y >= -1 && y <= 9)
                    && (
                        typeof cards[y] == 'undefined'
                        || (
                            typeof cards[y] != 'undefined' && typeof cards[y][x] == 'undefined'
                        )
                        || cards[y][x] == null
                    )
                    && (
                        (
                            typeof temp.path[y] == 'undefined'
                            || temp.path[y] == null
                            || typeof temp.path[y][x] == 'undefined'
                            || temp.path[y][x] == null
                        )
                        && temp.lines <= 3
                    )
                ) {
                    if (typeof temp.path[y] == 'undefined' || temp.path[y] == null) {
                        temp.path[y] = [];
                    }
                    temp.path[y][x] = true;
                    queue.push({
                        x: x,
                        y: y,
                        direction: directions[i],
                        lines: temp.lines,
                        path: temp.path
                    });
                } else if (x == card2.dataset.x && y == card2.dataset.y && temp.lines <= 3) {
                    console.log('удаляем карточку', temp);
                    removeCard(card1, card2);
                    break;
                }
            }
        }
    }

    function removeCard(card1, card2) {
            cards[card1.dataset.y][card1.dataset.x] = null;
            cards[card2.dataset.y][card2.dataset.x] = null;
            card1.classList.add('game-cell-hide');
            card2.classList.add('game-cell-hide');
    }
});