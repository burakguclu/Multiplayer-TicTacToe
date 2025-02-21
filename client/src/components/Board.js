import {React, useState} from 'react'
import Square from './Square'

function Board() {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""])

    return <div className='board'>
        <div className='row'>
            <Square val={board[0]} />
            <Square val={board[1]}/>
            <Square val={board[2]}/>
        </div>
        <div className='row'>
            <Square val={board[3]}/>
            <Square val={board[4]}/>
            <Square val={board[5]}/>
        </div>
        <div className='row'>
            <Square val={board[6]}/>
            <Square val={board[7]}/>
            <Square val={board[8]}/>
        </div>
    </div>
}

export default Board