
let gameRadioInputs = document.querySelectorAll('.controller input')
let maindiv = document.querySelector('.main');
let gametable = document.querySelector('.main .game-table #bingoTable');
let rightbar = document.querySelector('.rightBar');
let lastGameSize = 0;

function generateBingo(gamesize) {
    lastGameSize = gamesize;
    let array = []
    gametable.innerText = "";
    let rows = columns = gamesize;
    let unit = "vh";
    if (window.innerWidth < window.innerHeight)
        unit = "vw";
    gametable.style.height = gamesize * 10 + unit;
    gametable.style.width = gamesize * 10 + unit;

    for (var r = 1; r <= rows; r++) {
        let tr = document.createElement('tr');
        tr.className = "tr-item";
        for (var c = 1; c <= columns; c++) {
            // get Unique number loop in while till then
            let number = 0
            while (true) {
                number = (Math.floor(Math.random() * gamesize * gamesize) + 1);
                if (array.indexOf(number) === -1) {
                    array.push(number);
                    break;
                }
            }
            // Now create tiddies (Td) and push to Tr
            let td = document.createElement('td');
            td.className = "td-item";

            // create label, check box & check bg green
            let label = document.createElement('label');
            label.className = "label-bg";
            let line = document.createElement('span')
            line.className = "line";
            let line2 = document.createElement('span')
            line2.className = "line2";
            let line3 = document.createElement('span')
            line3.className = "line3";
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";

            let checkboxbg = document.createElement('div');
            checkboxbg.className = "check-bg";

            label.innerText = number.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
            label.append(checkbox, checkboxbg, line, line2, line3);
            td.appendChild(label);

            tr.appendChild(td)
        }
        gametable.appendChild(tr)
    }
}

function ReloadTable() {
    generateBingo(lastGameSize);
}

gameRadioInputs.forEach(singleRadio => {
    singleRadio.addEventListener('click', () => {
        generateBingo(singleRadio.value)
    });

    if (singleRadio.checked) {
        generateBingo(singleRadio.value);

        window.addEventListener('resize', function (event) {
            let unit = "vh";
            if (window.innerWidth < window.innerHeight)
                unit = "vw";
            gametable.style.height = singleRadio.value * 10 + unit;
            gametable.style.width = singleRadio.value * 10 + unit;

            let offsets = gametable.getBoundingClientRect();
            let top = offsets.top;
            // rightbar.style.top = top + 'px';
        }, true);
    }
})