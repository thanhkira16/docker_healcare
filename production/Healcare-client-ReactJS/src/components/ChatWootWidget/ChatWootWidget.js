import React, { useEffect, useState, useRef } from "react";
import "./ChatWootWidget.scss";
import { FormattedMessage, useIntl } from "react-intl";

const ChatWootWidget = () => {
    const intl = useIntl();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const GEMINI_API_KEY = "AIzaSyDjZc3AslY6BZX5RWR6JrN82-Q7q7nxFjw";

    const initialMessages = [
        {
            role: "assistant",
            content: intl.formatMessage({ id: "chatwoot.welcome_message" })
        }
    ];

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    useEffect(() => {
        // Initialize chat with welcome message if no messages exist
        if (messages.length === 0) {
            setMessages(initialMessages);
        }

        // Import Google Fonts for the chat
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        // Expose toggle function globally
        window.toggleMedicalChat = toggleChat;

        // Cleanup function
        return () => {
            if (link.parentNode) link.parentNode.removeChild(link);
            if (window.toggleMedicalChat) delete window.toggleMedicalChat;
        };
    }, []);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessageToGemini = async (userInput) => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Bạn là trợ lý y tế AI, luôn trả lời bằng tiếng Việt, cung cấp thông tin về sức khỏe và y tế. Nhớ rằng bạn không phải bác sĩ và thông tin chỉ mang tính tham khảo. Hãy trả lời câu hỏi sau: ${userInput}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024
                    }
                })
            });

            const data = await response.json();
            let assistantMessage = "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.";

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                assistantMessage = data.candidates[0].content.parts[0].text;
            }

            setMessages(prevMessages => [...prevMessages, { role: "assistant", content: assistantMessage }]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages(prevMessages => [...prevMessages, {
                role: "assistant",
                content: intl.formatMessage({ id: "chatwoot.error_message" })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        // Add user message to chat
        const userMessage = { role: "user", content: inputText };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputText("");

        // Get response from Gemini
        await sendMessageToGemini(inputText);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isChatOpen) {
        return (
            <div className="medical-chatbot-container">
                <button
                    className="chat-toggle medical-toggle-btn"
                    onClick={toggleChat}
                    title={intl.formatMessage({ id: "chatwoot.medical_chat_button" })}
                >
                    <span className="medical-icon">🩺</span>
                </button>
            </div>
        );
    }

    return (
        <div className="medical-chatbot-container">
            <div className="chat-window">
                <div className="chat-header">
                    <div className="avatar medical-avatar">
                        <div>🏥</div>
                    </div>
                    <div className="header-info">
                        <div className="title"><FormattedMessage id="chatwoot.assistant_title" /></div>
                        <div className="subtitle"><FormattedMessage id="chatwoot.assistant_subtitle" /></div>
                    </div>
                    <button
                        className="close-btn medical-close-btn"
                        onClick={toggleChat}
                        aria-label={intl.formatMessage({ id: "chatwoot.close_button" })}
                    >
                        ✕
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            <div className="message-content">
                                {message.content.split("\n").map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < message.content.split("\n").length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={intl.formatMessage({ id: "chatwoot.input_placeholder" })}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputText.trim()}
                    >
                        ➤
                    </button>
                </div>

                <div className="chat-footer">
                    <FormattedMessage id="chatwoot.footer_text" />
                </div>
            </div>
        </div>
    );
};

export default ChatWootWidget;