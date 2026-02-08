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
  processingSteps?: any
  language?: string
}

type ProcessingStep = {
  name: string
  description: string
  data?: any
}

// URL de votre backend FastAPI
const API_BASE_URL = 'http://localhost:8000'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'ⵣ Azul ! Je suis AWAL GPT, votre assistant Tamazight. Tapez votre message en Amazigh latin et je vous répondrai.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  
  const [inputText, setInputText] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('francais')
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const [showProcessingSteps, setShowProcessingSteps] = useState(false)
  const [currentProcessingSteps, setCurrentProcessingSteps] = useState<ProcessingStep[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Vérifier le statut de l'API
  useEffect(() => {
    checkApiStatus()
  }, [])

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'healthy') {
          setApiStatus('online')
        } else {
          setApiStatus('offline')
        }
      } else {
        setApiStatus('offline')
      }
    } catch (error) {
      console.error('❌ API Health check failed:', error)
      setApiStatus('offline')
    }
  }

  const sendToBackend = async (message: string, language: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: language
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Réponse backend:', data)
      
      return data
      
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
      language: selectedLanguage
    }

    setMessages(prev => [...prev, userMessage])
    const userText = inputText
    setInputText('')
    setIsBotTyping(true)

    try {
      // Envoyer au backend
      const backendResponse = await sendToBackend(userText, selectedLanguage)
      
      if (backendResponse.success) {
        // Extraire les étapes de traitement
        const processingSteps: ProcessingStep[] = [
          {
            name: "Prétraitement",
            description: "Normalisation et tokenization",
            data: backendResponse.preprocessed
          },
          {
            name: "Recherche corpus",
            description: "Correspondances trouvées",
            data: backendResponse.corpus_matches
          },
          {
            name: "Contexte généré",
            description: "Requête préparée pour DeepSeek",
            data: backendResponse.translated_context
          }
        ]
        
        setCurrentProcessingSteps(processingSteps)
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: backendResponse.llm_response,
          sender: 'bot',
          timestamp: new Date(),
          processingSteps: processingSteps,
          language: selectedLanguage
        }
        
        setMessages(prev => [...prev, botMessage])
        
      } else {
        throw new Error('Backend returned error')
      }
      
    } catch (error) {
      console.error('❌ Utilisation du fallback:', error)
      
      const fallbackResponse = generateFallbackResponse(userText, selectedLanguage)
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: selectedLanguage
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    }

    setIsBotTyping(false)
  }

  const generateFallbackResponse = (userMessage: string, language: string): string => {
    const responses = {
      francais: `ⵣ J'ai reçu : "${userMessage}"\n\nLe backend est actuellement indisponible. Mode local activé.`,
      arabe: `ⵣ تلقيت: "${userMessage}"\n\nالخادم غير متاح حاليًا. تم تفعيل الوضع المحلي.`,
      english: `ⵣ I received: "${userMessage}"\n\nBackend is currently unavailable. Local mode activated.`
    }
    return responses[language as keyof typeof responses] || responses.francais
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = (text: string) => {
    setInputText(text)
    textareaRef.current?.focus()
  }

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
    // Message système
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `🌐 Langue changée : ${lang === 'francais' ? 'Français' : lang === 'arabe' ? 'العربية' : 'English'}`,
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, systemMessage])
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
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
              <div className="text-xs text-gray-500">
                Assistant Tamazight • {apiStatus === 'online' ? '✅ Backend Connecté' : '⚠️ Mode local'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sélecteur de langue */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Langue :</span>
              <div className="flex gap-1">
                {['francais', 'arabe', 'english'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-[#e10916] text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {lang === 'francais' ? 'FR' : lang === 'arabe' ? 'AR' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Bouton étapes de traitement */}
            <button
              onClick={() => setShowProcessingSteps(!showProcessingSteps)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showProcessingSteps ? '👁️ Masquer étapes' : '🔍 Voir étapes'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar des étapes de traitement */}
        {showProcessingSteps && currentProcessingSteps.length > 0 && (
          <div className="w-96 border-r border-gray-200 bg-white/80 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4">📊 Étapes de Traitement</h3>
              <div className="space-y-4">
                {currentProcessingSteps.map((step, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <h4 className="font-bold">{step.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    {step.data && (
                      <div className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                        <pre>{JSON.stringify(step.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zone de chat principale */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
                          <span className="text-xs text-white">ⵣ</span>
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {message.sender === 'user' ? 'Vous' : 'AWAL GPT'}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.language && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {message.language === 'francais' ? 'FR' : 
                           message.language === 'arabe' ? 'AR' : 'EN'}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">
                      {message.text}
                    </div>
                    {message.processingSteps && showProcessingSteps && (
                      <div className="mt-3 pt-3 border-t border-gray-200 border-dashed">
                        <div className="text-xs text-gray-500">
                          {message.processingSteps.length} étapes de traitement
                        </div>
                      </div>
                    )}
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
                      Traitement du Tamazight...
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
                  onClick={() => handleQuickAction('salam 3likom')}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-sm font-medium">Salutation</div>
                  <div className="text-xs text-gray-500">salam 3likom</div>
                </button>
                <button
                  onClick={() => handleQuickAction('wash 3ndk')}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-sm font-medium">Question</div>
                  <div className="text-xs text-gray-500">wash 3ndk</div>
                </button>
                <button
                  onClick={() => handleQuickAction('tarjama dyal ordinateur')}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-sm font-medium">Traduction</div>
                  <div className="text-xs text-gray-500">tarjama dyal ...</div>
                </button>
                <button
                  onClick={() => handleQuickAction('chno kayn f tamazight')}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#e10916]/50 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-sm font-medium">Culture</div>
                  <div className="text-xs text-gray-500">chno kayn f...</div>
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
                  placeholder={`Écrivez votre message en Tamazight latin... (Langue: ${selectedLanguage})`}
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
                  AWAL GPT • Tamazight Processor • {apiStatus === 'online' ? '✅ Backend actif' : '⚠️ Mode local'}
                </div>
                <div className="flex items-center gap-2">
                  <span>Appuyez sur <kbd className="px-2 py-1 bg-gray-100 rounded">Entrée</kbd> pour envoyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}