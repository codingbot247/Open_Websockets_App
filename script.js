// Define the WebSocket URL for the Coinbase Advanced Trading API
const url = 'wss://ws-feed.pro.coinbase.com';

// Create a WebSocket connection to the Coinbase Advanced Trading API
let ws;

// Function to connect to the WebSocket and subscribe to a specific channel
function connect(channelType) {
    // Check if a WebSocket connection already exists and close it if so
    if (ws) {
        ws.close();
    }

    ws = new WebSocket(url);

    // Event handler for when the WebSocket connection is opened
    ws.onopen = function(event) {
        console.log('Connection established');
        // Subscribe to the specified channel for BTC-USD
        const subscribeMessage = JSON.stringify({
            "type": "subscribe",
            "product_ids": ["BTC-USD"],
            "channels": [channelType]
        });
        // Send the subscription message
        ws.send(subscribeMessage);
        // Display the sent message
        displayMessage('Sent', subscribeMessage);
    };

    // Event handler for when a message is received from the server
    ws.onmessage = function(event) {
        // Parse the received message
        const message = JSON.parse(event.data);
        // Format the message for display
        const formattedMessage = formatMessage(message);
        // Display the formatted message in the results section
        displayMessage('Received', formattedMessage);
    };

    // Event handler for any errors that occur with the WebSocket connection
    ws.onerror = function(error) {
        // Log the error to the console
        console.error('WebSocket error:', error);
    };

    // Event handler for when the WebSocket connection is closed
    ws.onclose = function(event) {
        // Log that the WebSocket connection has been closed
        console.log('WebSocket connection closed');
        // Reset the WebSocket connection
        ws = null;
    };
}

// Function to format a message for display
function formatMessage(message) {
    let formattedMessage = '';
    // Example formatting: Add a timestamp and the message type
    formattedMessage += `Timestamp: ${new Date().toLocaleString()}\n`;
    formattedMessage += `Message Type: ${message.type}\n`;
    // Add other relevant information from the message
    if (message.product_id) {
        formattedMessage += `Product ID: ${message.product_id}\n`;
    }
    if (message.price) {
        formattedMessage += `Price: ${message.price}\n`;
    }
    // Add more fields as needed based on the message type
    return formattedMessage;
}

// Function to display a message with a heading
function displayMessage(heading, message) {
    const outputElement = document.getElementById('output');
    outputElement.textContent += `${heading}:\n${message}\n\n`;
}

// Function to disconnect from the WebSocket
function disconnect() {
    if (ws) {
        ws.close();
        console.log('WebSocket connection closed');
    }
}

// Function to clear the results panel
function clearResults() {
    document.getElementById('output').textContent = '';
}

// Add event listeners to the buttons
document.getElementById('connectTicker').addEventListener('click', () => connect('ticker'));
document.getElementById('connectMatches').addEventListener('click', () => connect('matches'));
document.getElementById('connectHeartbeat').addEventListener('click', () => connect('heartbeat'));
document.getElementById('connectStatus').addEventListener('click', () => connect('status'));
document.getElementById('connectUser').addEventListener('click', () => connect('user'));
document.getElementById('disconnect').addEventListener('click', disconnect);
document.getElementById('clear').addEventListener('click', clearResults);
