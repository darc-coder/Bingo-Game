let myusername = localStorage.getItem('bingousername');
let leftTopBox = document.querySelector('.leftTopBox');

// if myusername is empty redirect back to home asking for name
if (myusername == '' || myusername == ' ')
    window.location.href = '/';

else {
    const socket = io('/');

    socket.on('connect', () => {
        console.log("connected to server")
    })

    socket.on('game-number', number => {
        console.log('Received from server:', number);

        leftTopBox.removeChild(leftTopBox.querySelector('.value'));
        let lefttopval = document.createElement('div');
        lefttopval.className = 'value';
        lefttopval.innerText = number;

        leftTopBox.appendChild(lefttopval);

        let rows = Array.from(gametable.rows);
        rows.forEach(row => {
            cells = Array.from(row.cells);
            cells.forEach(cell => {
                if (parseInt(cell.innerText) == number) {
                    cell.classList.add('active');
                    cell.querySelector('input').disabled = false;
                }

                else {
                    cell.classList.remove('active');
                    cell.querySelector('input').disabled = true;
                }
            })
        })
    })

    socket.emit('username', myusername, socket.id);

    function markedBingo(e) {
        if (activatedforclick.shift()) {
            e.currentTarget.classList.remove('active');
            e.currentTarget.classList.add('selected');
            socket.emit('bingoKey', socket.id);
        }
    }
}