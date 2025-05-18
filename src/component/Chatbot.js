import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [step, setStep] = useState('greet');
  const [payload, setPayload] = useState({});
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Welcome to Museum Express! I can help you book exhibition tickets, find information about current exhibitions, or manage your existing bookings. How may I assist you today?' }]);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (sender, text) => {
    setMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  const handleInputChange = (key, value) => {
    setPayload({ ...payload, [key]: value });
  };

  const handleConfirmBooking = () => {
    // Generate a random ticket ID
    const ticketId = 'MUS-' + Math.floor(100000 + Math.random() * 900000);
    
    addMessage('bot', `Booking confirmed! Here's your summary:\n- Ticket ID: ${ticketId}\n- Museum: ${payload.city} Art Museum\n- Exhibition: ${payload.site}\n- Date: ${payload.date}\n- Adults: ${payload.adults}\n- Children: ${payload.children}${payload.slot ? '\n- Guided Tour: ' + payload.slot : ''}\n\nPlease save your Ticket ID for future reference.`);
    console.log('Booking Payload:', {...payload, ticketId});
    setStep('greet');
    setPayload({});
  };

  const handleConfirmCancel = () => {
    addMessage('bot', `Ticket with ID ${payload.ticketId} has been cancelled! A confirmation email will be sent shortly.`);
    console.log('Cancel Payload:', payload);
    setStep('greet');
    setPayload({});
  };

  const detectIntent = (input) => {
    const text = input.toLowerCase();
    
    // Book intent detection
    if (text.includes('book') || 
        text.includes('reserve') || 
        text.includes('get ticket') || 
        text.includes('buy ticket') ||
        text.includes('purchase')) {
      return 'book';
    }
    
    // Cancel intent detection
    if (text.includes('cancel') || 
        text.includes('refund') || 
        text.includes('delete booking') ||
        text.includes('return ticket')) {
      return 'cancel';
    }
    
    // Show sites intent detection
    if (text.includes('show') || 
        text.includes('list') || 
        text.includes('display') ||
        text.includes('what exhibition') ||
        text.includes('current exhibition') ||
        text.includes('available exhibition') ||
        text.includes('see exhibition')) {
      return 'show';
    }
    
    // Greeting detection
    if (text.includes('hello') || 
        text.includes('hi') || 
        text.includes('hey') ||
        text.includes('greetings') ||
        text.match(/^(hi|hello|hey)[\s!]*$/)) {
      return 'greeting';
    }
    
    return null;
  };

  const extractCity = (input) => {
    // Museum cities
    const museumCities = ['new york', 'london', 'paris', 'tokyo', 'rome', 'berlin', 'madrid', 'amsterdam', 'florence', 'vienna'];
    const text = input.toLowerCase();
    
    for (const city of museumCities) {
      if (text.includes(city)) {
        return city;
      }
    }
    
    return null;
  };

  const simulateThinking = async (callback, delay = 1000) => {
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsThinking(false);
    callback();
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    addMessage('user', userInput);
    const currentInput = userInput;
    setUserInput('');

    simulateThinking(() => processUserInput(currentInput));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const processUserInput = (input) => {
    switch (step) {
      case 'greet': {
        const intent = detectIntent(input);
        const city = extractCity(input);
        
        if (intent === 'greeting') {
          addMessage('bot', 'Hello! I\'m your museum assistant. I can help you book exhibition tickets, find information about current exhibitions, or manage your existing bookings. How can I assist you today?');
          return;
        }
        
        if (intent === 'book') {
          if (city) {
            handleInputChange('city', city);
            addMessage('bot', `I see you're interested in the ${city.charAt(0).toUpperCase() + city.slice(1)} Art Museum. Which exhibition would you like to visit?`);
            setStep('selectSite');
          } else {
            addMessage('bot', 'I understand you want to book museum tickets. Please enter the city where you\'d like to visit a museum:');
            setStep('cityInput');
          }
        } else if (intent === 'cancel') {
          addMessage('bot', 'I understand you want to cancel a museum ticket. Please enter your Ticket ID (format: MUS-XXXXXX):');
          setStep('ticketInput');
        } else if (intent === 'show') {
          if (city) {
            handleInputChange('city', city);
            addMessage('bot', `Current exhibitions at ${city.charAt(0).toUpperCase() + city.slice(1)} Art Museum:\n1. Modern Masters\n2. Renaissance Treasures\n3. Contemporary Sculptures\n4. Impressionist Collection\n5. Ancient Artifacts`);
            setStep('greet');
          } else {
            addMessage('bot', 'I understand you want to see current exhibitions. Please enter the city:');
            setStep('siteCityInput');
          }
        } else {
          addMessage('bot', 'I can help you book museum tickets, cancel existing bookings, or show current exhibitions. What would you like to do?');
        }
        break;
      }

      case 'cityInput':
        handleInputChange('city', input);
        addMessage('bot', `Current exhibitions at ${input.charAt(0).toUpperCase() + input.slice(1)} Art Museum:\n1. Modern Masters\n2. Renaissance Treasures\n3. Contemporary Sculptures\n4. Impressionist Collection\n5. Ancient Artifacts\n\nPlease select one by name or number:`);
        setStep('selectSite');
        break;

      case 'selectSite':
        handleInputChange('site', input);
        addMessage('bot', 'When would you like to visit? Please enter a date (YYYY-MM-DD):');
        setStep('dateInput');
        break;

      case 'dateInput':
        handleInputChange('date', input);
        addMessage('bot', 'How many adult tickets do you need?');
        setStep('adultsInput');
        break;

      case 'adultsInput':
        handleInputChange('adults', input);
        addMessage('bot', 'How many child tickets do you need? (Ages 6-12 receive discounted admission. Children under 6 are free.)');
        setStep('childrenInput');
        break;

      case 'childrenInput':
        handleInputChange('children', input);
        addMessage('bot', 'Would you like to add a guided tour? Our expert guides provide 45-minute tours throughout the day. (yes/no)');
        setStep('showBooking');
        break;

      case 'showBooking':
        if (input.toLowerCase() === 'yes' || input.toLowerCase().includes('yes')) {
          addMessage('bot', 'Available tour times: 10:30 AM, 1:00 PM, 2:30 PM, 4:00 PM. Please select one:');
          setStep('slotInput');
        } else {
          handleConfirmBooking();
        }
        break;

      case 'slotInput':
        handleInputChange('slot', input);
        handleConfirmBooking();
        break;

      case 'ticketInput':
        handleInputChange('ticketId', input);
        handleConfirmCancel();
        break;

      case 'siteCityInput':
        handleInputChange('city', input);
        addMessage('bot', `Current exhibitions at ${input.charAt(0).toUpperCase() + input.slice(1)} Art Museum:\n1. Modern Masters\n2. Renaissance Treasures\n3. Contemporary Sculptures\n4. Impressionist Collection\n5. Ancient Artifacts`);
        setStep('greet');
        break;

      default:
        break;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col h-96 border border-gray-200">
        <div className="bg-indigo-800 text-white p-3 rounded-t-lg flex items-center">
          <div className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Museum Guide</h2>
            <p className="text-xs text-indigo-100">Book tickets & explore exhibitions</p>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
              <div 
                className={`p-2 rounded-lg max-w-xs text-xs ${
                  msg.sender === 'bot' 
                    ? 'bg-indigo-50 text-gray-800 border border-indigo-100' 
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-indigo-50 p-2 rounded-lg flex items-center space-x-1 border border-indigo-100">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t border-gray-200 bg-slate-500">
          <div className="flex gap-4">
            <input 
              type="text" 
              className="border border-black rounded-full p-2 flex-grow text-xs" 
              placeholder="Ask about exhibitions, tickets, or tours..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-150"
            >
              <span>Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;