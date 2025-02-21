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

    const resetGame = async () => {
        setResult({ winner: "none", state: "none" });
        setReset(true);
        await channel.sendEvent({ type: "reset-game" });
        setTimeout(() => setReset(false), 0);
    }

    if (!playersJoined) {
        return <div>Waiting for other player to join...</div>
    }
    return <div className='gameContainer'>
        <Board result={result} setResult={setResult} reset={reset} channel={channel} />
        <Window>
            <MessageList
                disableDateSeparator
                closeReactionSelectorOnClick
                hideDeletedMessages
                messageActions={["react"]}
            />
            <MessageInput noFiles />
        </Window>
        <div className="buttonContainer">
            <button onClick={async () => {
                await channel.stopWatching()
                setChannel(null)
            }}>Leave Game</button>
            {result.state === "won" || result.state === "tie" ? (
                <button onClick={resetGame}>Reset Game</button>
            ) : null}
        </div>
    </div>
}

export default Game