import { useState } from "react";

const App = () => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    'Who won the latest nobel peace prize?',
    'What is the purpose of life?',
    'What is the size of known universe?',
    'Which is the longest living animal?'
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error: Please ask a question!");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);
      
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role : "user",
        parts : value
      },
      {
        role : "model",
        parts : data
      }
        
      ]);

      setValue("");
  
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try later');
    }
  };

  const handleClear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="app">
        <p>What do you want to know?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
        </p>

      <div className="input-container">
        <input
          value={value}
          placeholder="When is Eid?"
          onChange={(e) => setValue(e.target.value)}
        />
        { !error && <button onClick={getResponse}>Ask Me</button> }
        { error && <button onClick={handleClear}>Clear</button> }
      </div>

      {error && <p>{error}</p>}

      <div className="search-result">
        {chatHistory.map((chatItem, index) => <div key={index}>
          <p className="answer">{chatItem.role} : {chatItem.parts}</p>
        </div>)}
      </div>      
    </div>
  )
}

export default App;
