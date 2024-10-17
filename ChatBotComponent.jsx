import React, { useState } from 'react';
import { getClients, getClientWithName, getAddressForClientByName } from '../api';
import './ChatBotComponent.css'; // Importing the CSS file for styling

const ChatBotComponent = () => {
  const [gridData, setGridData] = useState([]); // Manage grid/form data
  const [chatData, setChatData] = useState(null); // Manage client data
  const [addressData, setAddressData] = useState([]); // Manage address data
  const [userInput, setUserInput] = useState(''); // Manage user input

  // Flow structure
  const flow = {
    start: {
      message: "Welcome! How can I assist you today?",
      options: [
        { text: "Get me list of clients", next: "showClients" },
        { text: "Get me a client data", next: "getClientData" },
        { text: "Get address for a client with name", next: "getAddressByName" }
      ]
    }
  };

  const handleShowClients = async () => {
    const response = await getClients();
    setGridData(response); // Set the grid data with fetched clients
  };

  const handleGetClientData = async () => {
    const name = prompt("Enter client name:");
    if (name) {
      const response = await getClientWithName(name);
      setChatData(response); // Set the chat data
    }
  };

  const handleGetAddressByName = async () => {
    const name = prompt("Enter client name for address:");
    if (name) {
      const response = await getAddressForClientByName(name);
      if (response) {
        // Create an object that includes the client name with the address
        setAddressData([{ name, address: response }]); // Set address data
      } else {
        setAddressData([]); // Clear address data if no response
      }
    }
  };

  const handleClientSelect = async (client) => {
    const response = await getAddressForClientByName(client.name);
    setAddressData(response ? [{ name: client.name, address: response }] : []); // Set address data for the selected client
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    // Here you can add logic to send the user message to the chatbot or API
    if (userInput) {
      console.log("User message:", userInput);
      setUserInput(''); // Clear the input after sending
    }
  };

return (
    <div className="chatbot-container">
      <div className="chatbot">
        <div className="chatbot-message">
          <p>{flow.start.message}</p>
        </div>
        <div className="options">
          <button className="option-button" onClick={handleShowClients}>
            {flow.start.options[0].text}
          </button>
          <button className="option-button" onClick={handleGetClientData}>
            {flow.start.options[1].text}
          </button>
          <button className="option-button" onClick={handleGetAddressByName}>
            {flow.start.options[2].text}
          </button>
        </div>
      </div>
      <div id="responseArea">
        {gridData.length > 0 && (
          <div>
            <h3>Clients List:</h3>
            <ul>
              {gridData.map(client => (
                <li key={client.id} onClick={() => handleClientSelect(client)}>
                  {client.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {chatData && (
          <div className="client-details">
            <h3>Client Details</h3>
            <p><strong>First Name:</strong> {chatData.name}</p>
            <p><strong>Email:</strong> {chatData.email}</p>
          </div>
        )}
        {addressData.length > 0 && (
          <div>
            <h3>Addresses:</h3>
            <ul>
              {addressData.map((data, index) => (
                <li key={index}>
                  <strong>Name:</strong> {data.name}<br />
                  <strong>Address:</strong> {`${data.address.street}, ${data.address.city}, ${data.address.zipcode}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        {gridData.length === 0 && !chatData && addressData.length === 0 && (
          <p>No data to display</p>
        )}
      </div>
      <div className="message-box">
        <input 
          type="text" 
          value={userInput} 
          onChange={handleInputChange} 
          placeholder="Type your message here..." 
          className="input-message"
        />
        <button onClick={handleSendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default ChatBotComponent;
