'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'


type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  metadata?: any
}

type Conversation = {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

// URL de votre backend Flask
const API_BASE_URL = 'http://localhost:3000/'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'ⵣ Azul ! Je suis AWAL GPT, votre assistant Amazigh. Je peux vous aider avec la traduction, l\'apprentissage de la langue Tamazight, et vous parler de la culture Amazighe.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'Discussion du jour', lastMessage: 'ⵣ Azul ! Comment puis-je vous aider ?', timestamp: new Date() },
  ])

  const [inputText, setInputText] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [activeConversation, setActiveConversation] = useState('1')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Vérifier le statut de l'API
  useEffect(() => {
    checkApiStatus()
  }, [])

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Ajustement textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputText])

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API Status:', data)
        setApiStatus('online')
      } else {
        setApiStatus('offline')
      }
    } catch (error) {
      console.error('❌ API Health check failed:', error)
      setApiStatus('offline')
    }
  }

  const sendToBackend = async (message: string) => {
    try {
      console.log('📤 Envoi au backend:', message)
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_id: activeConversation
        }),
      })

      const data = await response.json()
      console.log('📥 Réponse backend:', data)
      
      if (data.success && data.response) {
        return {
          success: true,
          text: data.response.text,
          metadata: data.response.metadata || {}
        }
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('❌ Erreur backend:', error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isBotTyping) return

    // Message utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const userText = inputText
    setInputText('')
    setIsBotTyping(true)

    // Mise à jour conversation
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, lastMessage: userText.substring(0, 40) + (userText.length > 40 ? '...' : ''), timestamp: new Date() }
        : conv
    ))

    try {
      // Envoyer au backend
      const backendResponse = await sendToBackend(userText)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: backendResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          ...backendResponse.metadata,
          source: 'backend'
        }
      }
      
      setMessages(prev => [...prev, botMessage])
      
    } catch (error) {
      // Fallback en cas d'erreur
      console.error('❌ Utilisation du fallback:', error)
      
      const fallbackResponse = generateFallbackResponse(userText)
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
        metadata: { source: 'fallback' }
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    }

    setIsBotTyping(false)
  }

  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase()
    
    if (lowerMsg.includes('slm') || lowerMsg.includes('salut') || lowerMsg.includes('bonjour') || lowerMsg.includes('azul')) {
      return 'ⵣ Azul fella-k ! (Le backend rencontre des difficultés)'
    } else {
      return 'ⵜⴰⵏⵎⵉⵔⵜ ! Problème de connexion au serveur. Réponse locale : Je peux vous aider avec la langue et culture Amazighe.'
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewChat = () => {
    const newId = (conversations.length + 1).toString()
    const newConversation: Conversation = {
      id: newId,
      title: `Discussion ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      lastMessage: 'Nouvelle conversation',
      timestamp: new Date()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveConversation(newId)
    setMessages([{
      id: '1',
      text: 'ⵣ Azul ! Nouvelle discussion. Comment puis-je vous aider ?',
      sender: 'bot',
      timestamp: new Date(),
    }])
  }

  const handleQuickAction = (text: string) => {
    setInputText(text)
    textareaRef.current?.focus()
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-80' : 'w-0'} 
        transition-all duration-300 flex-shrink-0
        flex flex-col bg-white border-r border-gray-200
        ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100 lg:w-20'}
      `}>
        
        {sidebarOpen ? (
          // Sidebar étendue
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#e10916] to-[#e10916] rounded-xl flex items-center justify-center">
                <Link href='#' className='mx-auto inline-block max-w-[160px]'>
                  <Image
                    src='/images/logo.png'
                    alt='logo'
                    width={24}
                    height={9}
                    className='dark:hidden'
                  />
                </Link>
               </div>
                  <div>
                    <div className="font-bold text-gray-900">AWAL GPT</div>
                    <div className="text-xs text-gray-500">Chatbot Amazigh</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Icon icon="mdi:close" width="20" height="20" />
                </button>
              </div>
              
              <button
                onClick={handleNewChat}
                className="w-full bg-gradient-to-r from-[#e10916] to-[#e10916] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Icon icon="mdi:plus" width="20" height="20" />
                Nouveau chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="text-sm font-semibold text-gray-500 mb-3 px-2">HISTORIQUE</div>
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeConversation === conv.id
                        ? 'bg-gradient-to-r from-[#e10916]/10 to-[#e10916]/10 border border-[#e10916]/20'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-gray-900 truncate">{conv.title}</div>
                    <div className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus === 'online' ? 'bg-green-500' : 
                  apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">Backend API</div>
                  <div className="text-xs text-gray-500">
                    {apiStatus === 'online' ? 'Connecté' : 
                     apiStatus === 'offline' ? 'Hors ligne' : 'Vérification...'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">LANGUE</div>
                <div className="flex gap-1">
                  {['fr', 'ber', 'ar'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-[#e10916] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {lang === 'fr' ? 'FR' : lang === 'ber' ? 'ⵜⵎⵣ' : 'AR'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Sidebar réduite
          <div className="p-4 flex flex-col items-center space-y-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Icon icon="mdi:menu" width="24" height="24" />
            </button>
            <button
              onClick={handleNewChat}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Nouveau chat"
            >
              <Icon icon="mdi:plus" width="24" height="24" />
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                  <Icon icon="mdi:menu" width="24" height="24" />
                </button>
              )}
              <div>
                <div className="font-bold text-gray-900">AWAL GPT</div>
                <div className="text-xs text-gray-500">
                  Assistant Amazigh • {apiStatus === 'online' ? '✅ Backend Connecté' : '⚠️ Mode local'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                apiStatus === 'online' ? 'bg-green-100 text-green-800' :
                apiStatus === 'offline' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {apiStatus === 'online' ? 'API Online' : 
                 apiStatus === 'offline' ? 'API Offline' : 'Checking...'}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] lg:max-w-[75%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#e10916] to-[#e10916] text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {message.sender === 'bot' && (
                      <div className="w-6 h-6 bg-gradient-to-r from-[#e10916] to-[#e10916] rounded-full flex items-center justify-center">
                <Link href='#' className='mx-auto inline-block max-w-[160px]'>
                  <Image
                    src='/images/logo.png'
                    alt='logo'
                    width={16}
                    height={4}
                    className='dark:hidden'
                  />
                </Link>                        
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {message.sender === 'user' ? 'Vous' : 'AWAL GPT'}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.metadata?.source === 'backend' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        DeepSeek
                      </span>
                    )}
                    {message.metadata?.source === 'fallback' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Local
                      </span>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {message.text}
                  </div>
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 rounded-bl-none max-w-[75%]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#e10916] to-[#e10916] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">ⵣ</span>
                    </div>
                    <span className="text-sm font-medium">AWAL GPT</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {apiStatus === 'online' ? 'Interroge DeepSeek API...' : 'Mode local...'}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-white/80">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickAction('Traduis "bonjour" en Tamazight')}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-[#e10916]/10 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:translate" width="14" height="14" className="text-[#e10916]" />
                  </div>
                  <span className="text-sm font-medium">Traduction</span>
                </div>
                <div className="text-xs text-gray-500">Traduire un mot ou phrase</div>
              </button>
              <button
                onClick={() => handleQuickAction('Apprends-moi 5 mots en Tamazight')}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-[#e10916]/10 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:book-education" width="14" height="14" className="text-[#e10916]" />
                  </div>
                  <span className="text-sm font-medium">Apprentissage</span>
                </div>
                <div className="text-xs text-gray-500">Vocabulaire et grammaire</div>
              </button>
              <button
                onClick={() => handleQuickAction('Parle-moi de la culture Amazighe')}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-[#e10916]/10 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:castle" width="14" height="14" className="text-[#e10916]" />
                  </div>
                  <span className="text-sm font-medium">Culture</span>
                </div>
                <div className="text-xs text-gray-500">Traditions et histoire</div>
              </button>
              <button
                onClick={() => handleQuickAction('Quels sont les dialectes Amazighs ?')}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-[#e10916]/10 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:earth" width="14" height="14" className="text-[#e10916]" />
                  </div>
                  <span className="text-sm font-medium">Dialectes</span>
                </div>
                <div className="text-xs text-gray-500">Variantes régionales</div>
              </button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Envoyez un message à AWAL GPT..."
                className="w-full p-4 pr-14 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e10916]/30 focus:border-[#e10916]/50 resize-none bg-white"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isBotTyping}
                className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                  inputText.trim() && !isBotTyping
                    ? 'bg-gradient-to-r from-[#e10916] to-[#e10916] text-white hover:shadow-lg'
                    : 'text-gray-400'
                }`}
              >
                <Icon icon="mdi:send" width="18" height="18" />
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 flex items-center justify-between px-1">
              <div>
                AWAL Bot • Assistant IA Amazigh • {apiStatus === 'online' ? 'Powered by DeepSeek API' : 'Mode local'}
              </div>
              <div className="flex items-center gap-2">
                <span>Appuyez sur <kbd className="px-2 py-1 bg-gray-100 rounded">Entrée</kbd> pour envoyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}