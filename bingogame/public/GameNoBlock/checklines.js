function CheckLines() {
    let totalCrossedCount = 0;
    // Row Wise checking
    let rows = Array.from(gametable.rows)
    rows.forEach(row => {
        let cells = Array.from(row.cells)
        let allTickedHorizontal = []

        // checking if all the rows are checked. then add to allTickedHorizontal array
        cells.forEach(cell => {
            if (cell.querySelector('input').checked) {
                allTickedHorizontal.push(true)
            }
            else {
                allTickedHorizontal.push(false)
            }
        })

        // from allTickedHorizontal array check if all are true and draw a single Horizontal White line
        cells.forEach(cell => {
            if (allTickedHorizontal.every(truthy => truthy))
                cell.querySelector('.line').classList.add('active');
            else
                cell.querySelector('.line').classList.remove('active');
        })

        // counting total crossed in horizontal
        if (allTickedHorizontal.every(truthy => truthy))
            totalCrossedCount += 1;
    })

    // column wise checking
    columns = []
    for (let i = 1; i <= gametable.rows[0].cells.length; i++) {
        allTickedVertical = []
        let column = gametable.querySelectorAll(`td:nth-child(${i})`);
        columns.push(column);

        column.forEach(cell => {
            if (cell.querySelector('input').checked) {
                allTickedVertical.push(true)
            }
            else {
                allTickedVertical.push(false)
            }
        })

        // from allTickedHorizontal array check if all are true and draw a single Vertical White line
        column.forEach(cell => {
            if (allTickedVertical.every(truthy => truthy))
                cell.querySelector('.line2').classList.add('active');
            else
                cell.querySelector('.line2').classList.remove('active');
        })

        // counting total crossed in vertical
        if (allTickedVertical.every(truthy => truthy))
            totalCrossedCount += 1;
    }
    // end of horizontal and vertical

    // check diagonals from top left and bottom left
    let allTickedMainDiag = []
    let allTickedAntiDiag = []
    for (let i = 0; i < columns.length; i++) {
        let j = columns.length - i - 1;
        // main diagonal
        if (columns[i][i].querySelector('input').checked)
            allTickedMainDiag.push(true)
        else
            allTickedMainDiag.push(false)
        // anti diagonal
        if (columns[i][j].querySelector('input').checked)
            allTickedAntiDiag.push(true)
        else
            allTickedAntiDiag.push(false)
    }

    for (let i = 0; i < columns.length; i++) {
        let j = columns.length - i - 1;
        let markedRight = false;

        if (i === j)
            columns[i][j]

        if (allTickedMainDiag.every(truthy => truthy)) {
            markedRight = true;
            columns[i][i].querySelector('.line3').classList = ['line3 active rotate-right'];
        }
        else
            columns[i][i].querySelector('.line3').classList = ['line3'];

        if (allTickedAntiDiag.every(truthy => truthy))
            columns[i][j].querySelector('.line3').classList = ['line3 active rotate-left'];
        else {
            if (!markedRight)
                columns[i][j].querySelector('.line3').classList = ['line3'];
            else {
                if (i != j)
                    columns[i][j].querySelector('.line3').classList.remove('active');
                columns[i][j].querySelector('.line3').classList.remove('rotate-left');
            }
        }
    }

    // count Main diagonal and Anti diagonal
    if (allTickedMainDiag.every(truthy => truthy))
        totalCrossedCount += 1
    if (allTickedAntiDiag.every(truthy => truthy))
        totalCrossedCount += 1

    checkAndMarkBingo(totalCrossedCount);
}

setInterval(() => {
    CheckLines();
}, 1000);

let bingoLetters = document.querySelectorAll('.rightBar .letter');
let previousCount = 0;
let activatedforclick = [];

function checkAndMarkBingo(totalCrossCount) {
    if (totalCrossCount > previousCount) {
        previousCount = totalCrossCount;
        bingoLetters.forEach((ele, index) => {
            if (previousCount - index > 0) {
                activatedforclick.push(true);

                if (!ele.classList.contains('selected'))
                    ele.classList.add('active')
            }
        });
    }
    else {
        bingoLetters.forEach((ele, index) => {
            if (totalCrossCount - index > 0)
                a = 0
            else
                ele.classList.remove('active')
        });
    }
}