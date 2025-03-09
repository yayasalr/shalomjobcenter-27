
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Smile, Heart, Star, Music, Flag, Utensils, Coffee, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Emoji categories
const EMOJI_CATEGORIES = {
  recent: {
    name: 'Recent',
    icon: <Clock className="h-4 w-4" />,
    emojis: ['😊', '👍', '❤️', '😂', '🙏', '🔥', '👋', '😍']
  },
  smileys: {
    name: 'Smileys',
    icon: <Smile className="h-4 w-4" />,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔']
  },
  emotions: {
    name: 'Emotions',
    icon: <Heart className="h-4 w-4" />,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '😍', '🥰', '😘', '😻', '💑']
  },
  objects: {
    name: 'Objects',
    icon: <Coffee className="h-4 w-4" />,
    emojis: ['⌚️', '📱', '💻', '⌨️', '🖥️', '🖱️', '🖨️', '🖋️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️']
  },
  activities: {
    name: 'Activities',
    icon: <Zap className="h-4 w-4" />,
    emojis: ['🏃', '🚶', '💃', '🕺', '👯', '🧗', '🏋️', '🏄', '🚴', '⛹️', '🤸', '🤼', '🤾', '🤹', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '♟️', '🎯']
  },
  food: {
    name: 'Food',
    icon: <Utensils className="h-4 w-4" />,
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨']
  },
  travel: {
    name: 'Travel',
    icon: <Flag className="h-4 w-4" />,
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅']
  },
  symbols: {
    name: 'Symbols',
    icon: <Star className="h-4 w-4" />,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎']
  },
  music: {
    name: 'Music',
    icon: <Music className="h-4 w-4" />,
    emojis: ['🎵', '🎶', '🎼', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '🪘', '🪗', '🪕', '📻', '🎙️', '🎚️', '🎛️', '🪇', '🪈', '👨‍🎤', '👩‍🎤', '🎭', '🎬', '🎨', '🎪']
  }
};

import { Clock } from 'lucide-react';

interface AdvancedEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose?: () => void;
}

const AdvancedEmojiPicker: React.FC<AdvancedEmojiPickerProps> = ({
  onEmojiSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recent');

  // Filter emojis based on search query
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return null; // Show categories when no search
    }

    // Flatten all emojis and filter based on search
    const allEmojis = Object.values(EMOJI_CATEGORIES).flatMap(category => category.emojis);
    return allEmojis.filter(emoji => emoji.includes(searchQuery));
  }, [searchQuery]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    
    // Store in recent emojis (could use localStorage in a real implementation)
    const updatedRecent = [emoji, ...EMOJI_CATEGORIES.recent.emojis.filter(e => e !== emoji)].slice(0, 8);
    EMOJI_CATEGORIES.recent.emojis = updatedRecent;
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow-lg border border-gray-200">
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Input
            placeholder="Rechercher un emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-sm"
          />
          <Search className="h-4 w-4 absolute left-2 top-3 text-gray-500" />
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {filteredEmojis ? (
          // Search results
          <div className="grid grid-cols-8 gap-1 p-2">
            {filteredEmojis.map((emoji, index) => (
              <Button
                key={`${emoji}-${index}`}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => handleEmojiClick(emoji)}
              >
                <span className="text-xl">{emoji}</span>
              </Button>
            ))}
            {filteredEmojis.length === 0 && (
              <div className="col-span-8 text-center py-3 text-gray-500 text-sm">
                Aucun emoji trouvé
              </div>
            )}
          </div>
        ) : (
          // Category tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex overflow-x-auto scrollbar-hide bg-gray-50 p-1 justify-start w-full">
              {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center justify-center p-2 min-w-[32px] h-8"
                >
                  {category.icon}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid grid-cols-8 gap-1 p-2">
                  {category.emojis.map((emoji, index) => (
                    <Button
                      key={`${emoji}-${index}`}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      <span className="text-xl">{emoji}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdvancedEmojiPicker;
