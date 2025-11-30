import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, ShoppingCart } from 'react-feather';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import JwtApi from '../api/JwtApi';
import toast from 'react-hot-toast';
import { useAddToCartApiMutation } from '../features/cart/cartApiSlice';

const ChatBot = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hi! I\'m your Foodie Assistant. 🍕 How can I help you find something delicious today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [addToCartApi] = useAddToCartApiMutation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleAddToCart = async (product) => {
        await addToCartApi({ productId: product._id, quantity: 1 }).unwrap();
        toast.success(`Added ${product.title} to cart! 🛒`);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Format history for Gemini
            const history = messages
                .filter(m => m.role !== 'system')
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }] // Gemini expects text even if we render cards
                }));

            const res = await JwtApi.post('chat', {
                message: userMessage.content,
                history: history
            });

            // Handle structured response
            const botMessage = {
                role: 'model',
                content: res.text || res.reply, // Fallback for old/error responses
                products: res.products || []
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 ease-in-out h-[500px]">
                    {/* Header */}
                    <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Foodie Assistant</h3>
                                <p className="text-xs text-red-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-red-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>

                                {/* Product Cards */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-2 space-y-2 w-[85%]">
                                        {msg.products.map((product) => (
                                            <div key={product._id} className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.imgUrl}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 text-sm truncate">{product.title}</h4>
                                                    <p className="text-red-600 font-bold text-xs">₹{product.price}</p>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="mt-1 flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md hover:bg-red-100 transition-colors"
                                                    >
                                                        <ShoppingCart size={12} />
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for recommendations..."
                                className="flex-1 bg-gray-100 text-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative"
                >
                    <MessageCircle size={28} />
                    <span className="absolute right-0 top-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </button>
            )}
        </div>
    );
};

export default ChatBot;
