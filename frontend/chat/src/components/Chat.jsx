import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import InputBox from '../components/InputBox';
import './styles.css';
import { useLocation } from 'react-router-dom';
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const[isLoading, setIsLoading] = useState(false);
    const addMessage = (text, sender, audio = null) => {
        setMessages(prevMessages => [...prevMessages, { text, sender, audio }]);
    };
    const location = useLocation();
    const heroName = location.state.heroName;
    const lang=location.state.lang;
    const handleSendMessage = async (message) => {
        // Add the user's message to the chat
      
        addMessage(message, 'User');
        setIsLoading(true);
        try {
            // Send the message to the backend and get the bot's response
            const response = await fetch('/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message,event : heroName,lang:lang }),
            });
            const json = await response.json();
            console.log('Server response:', json); // Debugging line

            if (response.ok) {
                // Add the bot's response and audio to the chat
                addMessage(json.msg, `${heroName}`, json.audio);

                // Play the audio if it exists
                if (json.audio) {
                    const audio = new Audio(`data:audio/mpeg;base64,${json.audio}`);
                    audio.play()
                        .catch(error => {
                            console.error('Audio playback error:', error);
                        });
                }
            } else {
                console.error(json.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setIsLoading(false)
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <ChatWindow messages={messages} />
            </div>
            <div>
                <InputBox onSend={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default Chat;
