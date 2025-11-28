"use client";

import { useState } from "react";
import { Book, Settings, BookOpen, User, Moon, Sun, Volume2, Bookmark, Home, BarChart3, Headphones, Play, Pause, SkipBack, SkipForward, Heart, Share2, MessageCircle, ChevronRight, TrendingUp, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function BibleApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "reader" | "audiobook" | "profile" | "diagnostic">("home");
  const [fontSize, setFontSize] = useState(18);
  const [ptTranslation, setPtTranslation] = useState("ARA");
  const [secondLanguage, setSecondLanguage] = useState("en");
  const [showSettings, setShowSettings] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [portugueseOnly, setPortugueseOnly] = useState(false);
  
  // Audiobook states
  const [audioLanguage, setAudioLanguage] = useState("pt");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [audioProgress, setAudioProgress] = useState(35);

  // Meta states
  const [goalDays, setGoalDays] = useState(365);
  const [currentDays, setCurrentDays] = useState(127);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Dados de exemplo
  const bibleText = {
    pt: {
      ARA: "No princípio, criou Deus os céus e a terra. A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas.",
      ARC: "No princípio criou Deus os céus e a terra. E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
      NVI: "No princípio Deus criou os céus e a terra. Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
      NTLH: "No começo Deus criou os céus e a terra. A terra era um vazio, sem nenhum ser vivente, e estava coberta por um mar profundo. A escuridão cobria o mar, e o Espírito de Deus se movia por cima da água.",
      NAA: "No princípio, Deus criou os céus e a terra. A terra era sem forma e vazia. As trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas."
    },
    en: "In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
    es: "En el principio creó Dios los cielos y la tierra. Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.",
    it: "Nel principio Dio creò i cieli e la terra. La terra era informe e deserta e le tenebre ricoprivano l'abisso e lo spirito di Dio aleggiava sulle acque.",
    fr: "Au commencement, Dieu créa les cieux et la terre. La terre était informe et vide: il y avait des ténèbres à la surface de l'abîme, et l'esprit de Dieu se mouvait au-dessus des eaux."
  };

  const languageNames = {
    pt: "Português",
    en: "English",
    es: "Español",
    it: "Italiano",
    fr: "Français"
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const playAudio = (lang: string) => {
    console.log(`Playing audio in ${lang}`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goalPercentage = Math.min((currentDays / goalDays) * 100, 100);

  // Helper function para obter texto da Bíblia
  const getBibleText = (language: string): string => {
    if (language === "pt") {
      return bibleText.pt[ptTranslation as keyof typeof bibleText.pt];
    }
    const text = bibleText[language as keyof typeof bibleText];
    return typeof text === 'string' ? text : bibleText.pt[ptTranslation as keyof typeof bibleText.pt];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`} style={{ backgroundColor: "#F0F4F8" }}>
      <div className="min-h-screen flex flex-col font-serif">
        {/* Header - Estilo referência */}
        <header className="backdrop-blur-sm bg-white/90 shadow-sm sticky top-0 z-40">
          <div className="h-16 px-6 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <BookOpen className="w-7 h-7" style={{ color: "#FF6F61" }} />
              <h1 className="text-2xl font-bold" style={{ color: "#333333" }}>Bíblia</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 font-medium hover:bg-blue-50 rounded-xl"
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hover:bg-gray-100/50 rounded-xl"
              >
                {isDarkMode ? <Sun className="w-5 h-5" style={{ color: "#333333" }} /> : <Moon className="w-5 h-5" style={{ color: "#333333" }} />}
              </Button>
            </div>
          </div>
        </header>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg">
          <div className="px-4 py-2">
            <div className="flex justify-around items-center max-w-md mx-auto">
              {[
                { view: "home", icon: Home, label: "Resumo" },
                { view: "reader", icon: Book, label: "Leitura" },
                { view: "audiobook", icon: Headphones, label: "Áudio" },
                { view: "diagnostic", icon: BarChart3, label: "Progresso" },
                { view: "profile", icon: User, label: "Perfil" }
              ].map((item) => (
                <Button
                  key={item.view}
                  variant="ghost"
                  onClick={() => setCurrentView(item.view as any)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all rounded-xl ${
                    currentView === item.view ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-24 pt-4">
          {/* ABA RESUMO (HOME) - Estilo referência */}
          {currentView === "home" && (
            <div className="px-4 py-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Header com título grande */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold" style={{ color: "#333333" }}>Resumo</h2>
                </div>

                {/* Card Principal - Gradiente laranja/coral como referência */}
                <div className="relative overflow-hidden rounded-3xl shadow-lg">
                  <div className="relative p-8 bg-gradient-to-br from-orange-400 to-pink-500">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Leitura do Dia</h3>
                        <p className="text-white/90 text-lg">Salmo 23</p>
                      </div>
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">Progresso Hoje</span>
                        <span className="text-sm font-bold">75%</span>
                      </div>
                      <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-white text-orange-500 hover:bg-white/90 font-semibold rounded-xl h-12 transition-all shadow-md"
                      onClick={() => setCurrentView("reader")}
                    >
                      Continuar Leitura
                    </Button>
                  </div>
                </div>

                {/* Cards de Estatísticas - Grid como referência */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-gray-700">Sequência</h4>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">127</p>
                    <p className="text-sm text-gray-500">dias consecutivos</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-500" />
                      </div>
                      <h4 className="font-semibold text-gray-700">Tempo</h4>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">3.5h</p>
                    <p className="text-sm text-gray-500">esta semana</p>
                  </div>
                </div>

                {/* Versículo do Dia */}
                <div className="bg-white rounded-3xl p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">Versículo do Dia</h3>
                  </div>
                  <p className="text-base leading-relaxed text-gray-700 mb-3">
                    "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
                  </p>
                  <p className="text-sm font-semibold text-blue-500">João 3:16</p>
                </div>

                {/* Botão "Show All" - Estilo referência */}
                <Button 
                  variant="ghost"
                  className="w-full justify-between bg-white rounded-3xl p-6 h-auto hover:bg-gray-50 transition-all shadow-md"
                  onClick={() => setCurrentView("diagnostic")}
                >
                  <span className="text-base font-semibold text-gray-900">Ver Todo Progresso</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>

                {/* Seletor de Idioma */}
                <div className="bg-white rounded-3xl p-6 shadow-md">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Idioma de Leitura</h3>
                  <Select value={secondLanguage} onValueChange={setSecondLanguage}>
                    <SelectTrigger className="w-full rounded-xl h-12 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">🇧🇷 Português</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* ABA LEITURA */}
          {currentView === "reader" && (
            <div className="h-full flex flex-col">
              {/* Settings Modal */}
              {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
                  <div 
                    className="bg-white p-8 max-w-md w-full mx-4 rounded-3xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-2xl font-bold mb-6" style={{ color: "#333333" }}>Configurações</h3>

                    <div className="space-y-6">
                      {/* Modo Somente Português */}
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                        <div className="flex-1">
                          <label className="text-sm font-semibold block mb-1" style={{ color: "#333333" }}>
                            Somente Português
                          </label>
                          <p className="text-xs text-gray-600">
                            Expande o texto em português para tela cheia
                          </p>
                        </div>
                        <Switch
                          checked={portugueseOnly}
                          onCheckedChange={setPortugueseOnly}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-3 block" style={{ color: "#333333" }}>Tradução em Português</label>
                        <Select value={ptTranslation} onValueChange={setPtTranslation}>
                          <SelectTrigger className="rounded-xl h-12 border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ARA">ARA</SelectItem>
                            <SelectItem value="ARC">ARC</SelectItem>
                            <SelectItem value="NVI">NVI</SelectItem>
                            <SelectItem value="NTLH">NTLH</SelectItem>
                            <SelectItem value="NAA">NAA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!portugueseOnly && (
                        <div>
                          <label className="text-sm font-semibold mb-3 block" style={{ color: "#333333" }}>Segundo Idioma</label>
                          <Select value={secondLanguage} onValueChange={setSecondLanguage}>
                            <SelectTrigger className="rounded-xl h-12 border-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="it">Italiano</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-semibold mb-3 block" style={{ color: "#333333" }}>Tamanho: {fontSize}px</label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          min={14}
                          max={28}
                          step={2}
                          className="mt-2"
                        />
                      </div>

                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl h-12 transition-all"
                        onClick={() => setShowSettings(false)}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Header Leitura */}
              <div className="py-6 text-center bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 mb-2">
                  <div className="w-10"></div>
                  <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>Gênesis 1:1-2</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                    className="rounded-xl"
                  >
                    <Settings className="w-5 h-5" style={{ color: "#333333" }} />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">A Criação</p>
              </div>

              {/* Dual Text Reader ou Single Text Reader */}
              {portugueseOnly ? (
                // Modo Somente Português - Tela Cheia
                <div className="flex-1 flex flex-col h-full">
                  <div className="sticky top-0 px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-base" style={{ color: "#333333" }}>{ptTranslation}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playAudio("pt")}
                      className="h-8 w-8 rounded-xl"
                    >
                      <Volume2 className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto bg-white" style={{ padding: "32px 48px" }}>
                    <div className="max-w-4xl mx-auto">
                      <p
                        className="leading-relaxed"
                        style={{ 
                          fontSize: `${fontSize + 2}px`, 
                          lineHeight: "2.2",
                          color: "#333333",
                          textAlign: "justify"
                        }}
                      >
                        {bibleText.pt[ptTranslation as keyof typeof bibleText.pt]}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Modo Dual - Duas Colunas
                <div className="flex-1 grid grid-cols-2 divide-x divide-gray-200">
                  {/* Portuguese */}
                  <div className="flex flex-col h-full">
                    <div className="sticky top-0 px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
                      <h3 className="font-semibold text-base" style={{ color: "#333333" }}>{ptTranslation}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playAudio("pt")}
                        className="h-8 w-8 rounded-xl"
                      >
                        <Volume2 className="w-4 h-4 text-blue-500" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto bg-white" style={{ padding: "20px 24px" }}>
                      <p
                        className="leading-relaxed max-w-2xl"
                        style={{ 
                          fontSize: `${fontSize}px`, 
                          lineHeight: "2",
                          color: "#333333",
                          textAlign: "justify"
                        }}
                      >
                        {bibleText.pt[ptTranslation as keyof typeof bibleText.pt]}
                      </p>
                    </div>
                  </div>

                  {/* Second Language */}
                  <div className="flex flex-col h-full">
                    <div className="sticky top-0 px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
                      <h3 className="font-semibold text-base" style={{ color: "#333333" }}>
                        {secondLanguage.toUpperCase()}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playAudio(secondLanguage)}
                        className="h-8 w-8 rounded-xl"
                      >
                        <Volume2 className="w-4 h-4 text-blue-500" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto bg-white" style={{ padding: "20px 24px" }}>
                      <p
                        className="leading-relaxed max-w-2xl"
                        style={{ 
                          fontSize: `${fontSize}px`, 
                          lineHeight: "2",
                          color: "#333333",
                          textAlign: "justify"
                        }}
                      >
                        {getBibleText(secondLanguage)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA AUDIOBOOK */}
          {currentView === "audiobook" && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="py-6 text-center bg-white shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Headphones className="w-7 h-7 mr-3 text-blue-500" />
                  <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>Audiobook</h2>
                </div>
                <p className="text-sm text-gray-500">Gênesis 1:1-2</p>
              </div>

              {/* Language Selector */}
              <div className="py-6 px-6 bg-white border-b border-gray-200">
                <label className="text-sm font-semibold mb-3 block" style={{ color: "#333333" }}>Idioma do Áudio</label>
                <Select value={audioLanguage} onValueChange={setAudioLanguage}>
                  <SelectTrigger className="w-full rounded-xl h-12 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">🇧🇷 Português</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Display */}
              <div className="flex-1 overflow-auto bg-white m-4 rounded-3xl shadow-md" style={{ padding: "24px" }}>
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-bold text-xl" style={{ color: "#333333" }}>
                      {languageNames[audioLanguage as keyof typeof languageNames]}
                    </h3>
                    <span className="text-sm px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-xl">
                      {audioLanguage === "pt" ? ptTranslation : audioLanguage.toUpperCase()}
                    </span>
                  </div>
                  <p
                    className="leading-relaxed"
                    style={{ 
                      fontSize: `${fontSize}px`, 
                      lineHeight: "2",
                      color: "#333333",
                      textAlign: "justify"
                    }}
                  >
                    {getBibleText(audioLanguage)}
                  </p>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="py-8 px-6 bg-white border-t border-gray-200">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 transition-all rounded-full"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-gray-100"
                    >
                      <SkipBack className="w-5 h-5 text-gray-700" />
                    </Button>

                    <Button
                      size="icon"
                      className="h-16 w-16 bg-blue-500 hover:bg-blue-600 rounded-2xl transition-all shadow-lg"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 ml-1 text-white" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-gray-100"
                    >
                      <SkipForward className="w-5 h-5 text-gray-700" />
                    </Button>
                  </div>

                  {/* Speed */}
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">Velocidade:</span>
                    <Select value={audioSpeed.toString()} onValueChange={(v) => setAudioSpeed(parseFloat(v))}>
                      <SelectTrigger className="w-24 rounded-xl h-10 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="0.75">0.75x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="1.25">1.25x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA DIAGNÓSTICO */}
          {currentView === "diagnostic" && (
            <div className="px-4 py-4">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold" style={{ color: "#333333" }}>Progresso</h2>
                </div>

                {/* Modal de Configuração de Meta */}
                {showGoalModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowGoalModal(false)}>
                    <div 
                      className="bg-white p-8 max-w-md w-full mx-4 rounded-3xl shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-2xl font-bold mb-6" style={{ color: "#333333" }}>Definir Meta</h3>

                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-semibold mb-3 block" style={{ color: "#333333" }}>
                            Meta de Dias Consecutivos
                          </label>
                          <Input
                            type="number"
                            value={goalDays}
                            onChange={(e) => setGoalDays(parseInt(e.target.value) || 0)}
                            className="rounded-xl h-12 border-gray-200"
                            placeholder="Ex: 365"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Defina quantos dias consecutivos você deseja alcançar
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl h-12 transition-all"
                          onClick={() => setShowGoalModal(false)}
                        >
                          Salvar Meta
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card de Meta */}
                <div className="relative overflow-hidden rounded-3xl shadow-lg">
                  <div className="relative p-8 bg-gradient-to-br from-blue-400 to-purple-500">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Minha Meta</h3>
                        <p className="text-white/90 text-lg">{goalDays} dias consecutivos</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowGoalModal(true)}
                        className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30"
                      >
                        <Target className="w-6 h-6 text-white" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">Progresso da Meta</span>
                        <span className="text-sm font-bold">{Math.round(goalPercentage)}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-500" 
                          style={{ width: `${goalPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-white/90 text-sm">
                        <span>{currentDays} dias</span>
                        <span>{goalDays} dias</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <p className="text-white/80 text-xs mb-1">Faltam</p>
                        <p className="text-white text-2xl font-bold">{Math.max(goalDays - currentDays, 0)}</p>
                        <p className="text-white/80 text-xs">dias</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <p className="text-white/80 text-xs mb-1">Alcançado</p>
                        <p className="text-white text-2xl font-bold">{currentDays}</p>
                        <p className="text-white/80 text-xs">dias</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Motivacional */}
                <div className="p-8 text-center bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl shadow-lg">
                  <p className="text-xl font-semibold text-white italic">
                    "Cada página lida é um passo mais perto da sabedoria"
                  </p>
                </div>

                {/* Progresso Semanal */}
                <div className="p-6 bg-white rounded-3xl shadow-md">
                  <h3 className="font-bold text-lg mb-6" style={{ color: "#333333" }}>Progresso Semanal</h3>
                  <div className="space-y-4">
                    {[
                      { day: "Dom", progress: 85, color: "#3B82F6" },
                      { day: "Seg", progress: 60, color: "#8B5CF6" },
                      { day: "Ter", progress: 90, color: "#10B981" },
                      { day: "Qua", progress: 45, color: "#F59E0B" },
                      { day: "Qui", progress: 70, color: "#EF4444" },
                      { day: "Sex", progress: 55, color: "#EC4899" },
                      { day: "Sáb", progress: 80, color: "#06B6D4" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm w-12 font-semibold text-gray-700">{item.day}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-3 transition-all rounded-full"
                            style={{ 
                              width: `${item.progress}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                        <span className="text-sm w-12 text-right font-bold" style={{ color: item.color }}>
                          {item.progress}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tempo Total */}
                <div className="p-8 bg-white rounded-3xl text-center shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-4 text-gray-700">Tempo de Leitura</h3>
                  <div className="text-5xl font-bold mb-2 text-blue-500">3h 42min</div>
                  <p className="text-sm text-gray-500">Total esta semana</p>
                </div>
              </div>
            </div>
          )}

          {/* ABA PERFIL */}
          {currentView === "profile" && (
            <div className="px-4 py-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Header Perfil */}
                <div className="text-center p-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-white rounded-2xl">
                    <User className="w-12 h-12 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">João Silva</h2>
                  <p className="text-white/90">Membro desde Janeiro 2024</p>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "127", label: "Dias", icon: TrendingUp, color: "#10B981" },
                    { value: "42", label: "Capítulos", icon: Book, color: "#3B82F6" },
                    { value: "3.5h", label: "Tempo", icon: Clock, color: "#F59E0B" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-5 bg-white rounded-3xl shadow-md">
                      <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Preferências */}
                <div className="p-6 bg-white rounded-3xl shadow-md">
                  <h3 className="font-bold text-lg mb-6 text-gray-900">Preferências</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Tradução", value: "ARA", icon: Book },
                      { label: "Idioma", value: "Inglês", icon: Target },
                      { label: "Notificações", value: "Ativo", icon: Settings }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <span className="font-semibold text-blue-500">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
