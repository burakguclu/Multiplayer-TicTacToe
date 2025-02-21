import React, { useState } from 'react'
import Board from './Board'
import { Window, MessageList, MessageInput } from 'stream-chat-react'
import "../Chat.css"

function Game({ channel, setChannel }) {

    const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2)

    const [result, setResult] = useState({ winner: "none", state: "none" })

    const [reset, setReset] = useState(false)

    channel.on("user.watching.start", (event) => {
        setPlayersJoined(event.watcher_count === 2)
    })

    const resetGame = () => {
        setResult({ winner: "none", state: "none" });
        setReset(true);
        setTimeout(() => setReset(false), 0);
    }

    if (!playersJoined) {
        return <div>Waiting for other player to join...</div>
    }
    return <div className='gameContainer'>
        <Board result={result} setResult={setResult} reset={reset} />
        <Window>
            <MessageList
                disableDateSeparator
                closeReactionSelectorOnClick
                hideDeletedMessages
                messageActions={["react"]}
            />
            <MessageInput noFiles />
        </Window>
        <button onClick={async () => {
            await channel.stopWatching()
            setChannel(null)
        }}>Leave Game</button>
        <button onClick={resetGame}>Reset Game</button>
    </div>
}

export default Game