import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { useLanguage } from './language-provider'
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Minimize2, 
  Maximize2,
  Minimize,
  Bot,
  User
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  language?: string
}

export function Chatbot() {
  const { translate, currentLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AgriAI assistant. How can I help you with your farming today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [currentLanguage])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Agriculture-specific responses
    if (input.includes('crop') || input.includes('plant')) {
      return "Based on your location and soil conditions, I recommend considering wheat, rice, or pulses. Would you like specific recommendations for your area? I can analyze your farm details for personalized suggestions."
    }
    
    if (input.includes('fertilizer') || input.includes('nutrition')) {
      return "For optimal crop nutrition, consider soil testing first. Generally, NPK fertilizers work well, but organic options like compost and vermicompost are excellent for soil health. What crop are you planning to grow?"
    }
    
    if (input.includes('weather') || input.includes('rain')) {
      return "Current weather shows favorable conditions for farming. There's a chance of light rain in the next 48 hours, which would be good for your crops. I recommend monitoring soil moisture and adjusting irrigation accordingly."
    }
    
    if (input.includes('disease') || input.includes('pest')) {
      return "Common diseases this season include leaf rust and aphid infestations. For accurate disease detection, you can upload a photo of your plant in the Disease Detection section. I can provide treatment recommendations based on the diagnosis."
    }
    
    if (input.includes('price') || input.includes('market')) {
      return "Current market prices are trending upward for wheat and rice. Cotton prices have been stable. Would you like detailed price analysis for specific crops? I can also suggest the best time to sell based on market trends."
    }
    
    if (input.includes('water') || input.includes('irrigation')) {
      return "Water management is crucial for crop success. Based on your soil moisture levels, I recommend drip irrigation for water efficiency. The current water table in your area seems adequate for the season."
    }
    
    if (input.includes('soil')) {
      return "Your soil analysis shows good organic matter content. pH levels are optimal for most crops. Consider adding organic fertilizers to maintain soil health. Would you like specific soil improvement recommendations?"
    }

    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('namaste')) {
      return "Hello! I'm here to help with all your farming questions. You can ask me about crop recommendations, weather alerts, soil health, market prices, or any other agricultural concerns."
    }

    // Default response
    return "I understand you're asking about farming. I can help with crop recommendations, fertilizer guidance, weather alerts, soil analysis, pest management, and market prices. Could you be more specific about what you'd like to know?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <>
      {isMaximized && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setIsMaximized(false)}
        />
      )}
      <div className={`fixed z-50 transition-all duration-300 ${
        isMaximized 
          ? 'inset-4 w-auto h-auto' 
          : isMinimized 
            ? 'bottom-6 right-6 w-80 h-14' 
            : 'bottom-6 right-6 w-96 h-[600px]'
      }`}>
        <Card className="h-full flex flex-col shadow-xl">
        <CardHeader 
          className={`flex-row items-center justify-between p-4 ${!isMinimized ? 'border-b' : ''} ${isMinimized ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
          onClick={isMinimized ? () => setIsMinimized(false) : undefined}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm">AgriAI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {isMinimized ? 'Click to restore' : isListening ? 'Listening...' : 'Online'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMaximized(!isMaximized)
                  if (isMaximized) setIsMinimized(false)
                }}
                className="h-8 w-8"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(!isMinimized)
                if (!isMinimized) setIsMaximized(false)
              }}
              className="h-8 w-8"
              title={isMinimized ? "Restore" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className="h-8 w-8"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={translate('askQuestion')}
                  className="flex-1"
                />
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Ask about crops, weather, soil, pests, or market prices
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
    </>
  )
}