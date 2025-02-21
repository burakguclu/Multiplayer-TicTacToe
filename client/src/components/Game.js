import React, { useState, useEffect } from 'react'
import Board from './Board'
import { Window, MessageList, MessageInput } from 'stream-chat-react'
import Cookies from 'universal-cookie';
import "../Chat.css"

function Game({ channel, setChannel, rivalUsername }) {
    const cookies = new Cookies();
    const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2)
    const [result, setResult] = useState({ winner: "none", state: "none" })
    const [reset, setReset] = useState(false)

    // Kullanıcı isimlerini ekliyoruz
    const [playerNames, setPlayerNames] = useState({ playerX: cookies.get("username"), playerO: rivalUsername });

    // Skor durumunu ekliyoruz
    const [scores, setScores] = useState({ playerX: 0, playerO: 0 });

    channel.on("user.watching.start", (event) => {
        setPlayersJoined(event.watcher_count === 2)
    })

    const resetGame = async () => {
        setResult({ winner: "none", state: "none" });
        setReset(true);
        await channel.sendEvent({ type: "reset-game" });
        setTimeout(() => setReset(false), 0);
    }

    // Skor güncelleme fonksiyonu
    const updateScores = (winner) => {
        if (winner === "X") {
            setScores(prevScores => ({ ...prevScores, playerX: prevScores.playerX + 1 }));
        } else if (winner === "O") {
            setScores(prevScores => ({ ...prevScores, playerO: prevScores.playerO + 1 }));
        }
    }

    useEffect(() => {
        // Oyun tamamlandığında skoru güncelle
        if (result.state === "won") {
            updateScores(result.winner);
        }
    }, [result.state]); // result.state değiştiğinde çalışır

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
        {/* Skor Tablosu */}
        <div className="scoreboard">
            <h3>Scoreboard</h3>
            <p>{playerNames.playerX}: {scores.playerX}</p>
            <p>{playerNames.playerO}: {scores.playerO}</p>
        </div>
    </div>
}

export default Game