import { useState } from 'react';
import './App.css';
import Login from "./components/Login";
import SignUp from './components/SignUp';
import { StreamChat } from 'stream-chat'
import Cookies from 'universal-cookie'

function App() {
  const api_key = process.env.REACT_APP_API_KEY
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  }

  if (token) {
    client.connectUser(
      {
        id: cookies.get("userId"),
        name: cookies.get("username"),
        firstName: cookies.get("firstName"),
        lastName: cookies.get("lastName"),
        hashedPassword: cookies.get("hashedPassword")
      },
      token
    )
      .then((user) => {
        setIsAuth(true)
      })
  }

  return (
    <div className="App">
      {isAuth ? (<button onClick={logOut}>Log Out</button>) : (
        <>
      <SignUp setIsAuth={setIsAuth}/>
      <Login setIsAuth={setIsAuth}/>
      </>
      )}
    </div>
  );
}

export default App;
