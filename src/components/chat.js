import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBbZxW2i3KgCLDBhAcTMKiW_-Qy3e_DD5c');

const ChatComponent = () => {
  async function run(message) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    let temp = messageList;
    temp.push(result.response.text());
    setMessageList(temp);
    console.log(messageList);
    setInputValue('');
  }

  const [messageList, setMessageList] = useState(["Bienvenue sur le chat, comment puis je vous aider ?"]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      let temp = messageList
      temp.push(inputValue);
      setMessageList(temp);
      console.log(messageList)
      run(inputValue)
    }
    setInputValue('  ');
  };

  return (
    <div className="bg-gray-100 p-4 border-2 border-black rounded-lg h-auto w-auto" style={{ fontSize: '10px' }}>
      <div className="chat-window overflow-y-auto h-48 w-50">
        {messageList &&
          messageList.map((item, index) =>
            index % 2 == 0 ? (
              <div key={index} className="bg-black text-left text-white p-1 mr-16 mb-1 rounded-lg">
                <div className="message-content">{item}</div>
              </div>
            ) : (
              <div key={index} className="bg-blue-600 text-left text-white p-1 ml-16 mb-1 rounded-lg">
                <div className="message-content">{item}</div>
              </div>
            )
          )}
      </div>

      <div className="chat-input mt-4 flex ">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Votre message..."
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <button onClick={() => handleSendMessage()} className="bg-gray-900 text-white px-4 py-2 rounded-lg ml-2">
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
