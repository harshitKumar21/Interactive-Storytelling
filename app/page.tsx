"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sword, Heart, Trophy, ArrowLeft, Home } from "lucide-react"

/* ────────────────────────
   Types
──────────────────────────*/
interface Choice {
  text: string
  nextId: string
  consequence?: string
}

interface StoryNode {
  id: string
  title: string
  content: string
  choices?: Choice[]
  isEnding?: boolean
  endingType?: "good" | "neutral" | "bad"
}

interface Genre {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  stories: Story[]
}

interface Story {
  id: string
  title: string
  description: string
  startNodeId: string
}

/* ────────────────────────
   Story Data - Complete with all 6 stories
──────────────────────────*/
const storyNodes: Record<string, StoryNode> = {
  // ADVENTURE GENRE - Story 1: The Midnight Library
  midnight_library: {
    id: "midnight_library",
    title: "The Midnight Library",
    content:
      "You find yourself standing before an ancient library that shouldn't exist. The building materializes from the fog as midnight strikes, its gothic spires reaching toward a starless sky. Golden light spills from tall windows, and you can hear the faint whisper of turning pages carried on the wind.",
    choices: [
      { text: "Enter through the main doors", nextId: "library_hall" },
      { text: "Circle around to find another way", nextId: "secret_garden" },
      { text: "Turn back and leave", nextId: "library_leave" },
    ],
  },
  library_hall: {
    id: "library_hall",
    title: "The Grand Hall",
    content:
      "Towering bookshelves stretch infinitely upward, filled with volumes that seem to glow with inner light. Floating candles cast dancing shadows across leather-bound tomes. An elderly librarian with silver hair looks up from an ornate desk, her eyes twinkling with ancient knowledge. 'Welcome, traveler,' she says, her voice like rustling parchment.",
    choices: [
      { text: "Approach the librarian", nextId: "meet_librarian" },
      { text: "Explore the magical books", nextId: "magic_books" },
      { text: "Climb the spiral staircase", nextId: "upper_floors" },
    ],
  },
  meet_librarian: {
    id: "meet_librarian",
    title: "The Keeper of Stories",
    content:
      "Evangeline, the librarian, smiles warmly as you approach. 'I am the keeper of all stories ever told and those yet to be written,' she explains. 'Each book here contains a different path, a different destiny. Tonight, you may choose one, but choose wisely—the story you select will become part of your very soul.' Three glowing books appear on the desk before you.",
    choices: [
      { text: "Choose the crimson book of courage", nextId: "courage_book" },
      { text: "Choose the golden book of wisdom", nextId: "wisdom_book" },
      { text: "Choose the silver book of mystery", nextId: "mystery_book" },
    ],
  },
  courage_book: {
    id: "courage_book",
    title: "The Hero's Awakening",
    content:
      "As you open the crimson book, words of fire dance across the pages. You feel a surge of bravery coursing through your veins like liquid lightning. The library around you transforms into a vast battlefield where heroes are forged. You now possess the courage to face any challenge, but with great power comes great responsibility. You have become a guardian of courage itself.",
    isEnding: true,
    endingType: "good",
  },
  wisdom_book: {
    id: "wisdom_book",
    title: "The Scholar's Path",
    content:
      "Golden light emanates from the pages as ancient knowledge flows into your mind. You understand the secrets of the universe, the connections between all things, and the true nature of wisdom. The librarian nods approvingly. 'You have chosen well. Knowledge without wisdom is dangerous, but wisdom without knowledge is powerless. You now possess both.'",
    isEnding: true,
    endingType: "good",
  },
  mystery_book: {
    id: "mystery_book",
    title: "The Enigma Eternal",
    content:
      "The silver book's pages are blank, yet as you stare, words begin to appear and disappear like whispers in the wind. You realize this book writes itself based on the reader's deepest questions. Some mysteries are meant to remain unsolved, and in accepting this, you find a different kind of peace—the wisdom of knowing when not to know.",
    isEnding: true,
    endingType: "neutral",
  },
  secret_garden: {
    id: "secret_garden",
    title: "The Moonlit Garden",
    content:
      "Behind the library, you discover a garden where flowers bloom only in moonlight. Each flower represents a story never told, a path never taken. A ghostly figure tends the garden—the spirit of a writer who died before finishing their masterpiece. 'Help me complete my final story,' they plead, 'and I will grant you a gift beyond measure.'",
    choices: [
      { text: "Help the ghostly writer", nextId: "help_writer" },
      { text: "Explore the garden alone", nextId: "garden_alone" },
      { text: "Return to the library", nextId: "library_hall" },
    ],
  },
  help_writer: {
    id: "help_writer",
    title: "The Unfinished Tale",
    content:
      "Together, you and the spirit weave a story of love, loss, and redemption. As the final words are spoken, the ghost begins to glow with peaceful light. 'Thank you,' they whisper. 'My story is complete, and so is yours.' They bestow upon you the gift of perfect storytelling—you will always know exactly what words to say to heal hearts and inspire souls.",
    isEnding: true,
    endingType: "good",
  },
  garden_alone: {
    id: "garden_alone",
    title: "The Solitary Path",
    content:
      "You wander the garden alone, touching flowers that show you glimpses of untold stories. Each touch fills you with melancholy for all the tales that will never be shared. You leave the garden changed, carrying the weight of unfinished narratives, but also the understanding that some stories are meant to remain in the realm of possibility.",
    isEnding: true,
    endingType: "neutral",
  },
  library_leave: {
    id: "library_leave",
    title: "The Road Not Taken",
    content:
      "You turn away from the mysterious library, choosing the safety of the known world. As you walk away, you hear the faint sound of pages turning in the wind. Years later, you'll wonder what stories you might have discovered, what adventures you missed. Sometimes the greatest adventure is the one we choose not to take.",
    isEnding: true,
    endingType: "bad",
  },
  magic_books: {
    id: "magic_books",
    title: "The Living Library",
    content:
      "The books begin to flutter their pages like wings, lifting off the shelves and circling around you in a whirlwind of stories. You're caught in a tornado of tales, each book trying to tell you its story simultaneously. The cacophony is overwhelming until you realize you must choose just one voice to listen to.",
    choices: [
      { text: "Listen to the adventure tales", nextId: "adventure_tales" },
      { text: "Focus on the love stories", nextId: "love_tales" },
      { text: "Hear the mysteries", nextId: "mystery_tales" },
    ],
  },
  adventure_tales: {
    id: "adventure_tales",
    title: "The Adventurer's Spirit",
    content:
      "The adventure books surround you, filling your mind with tales of brave explorers, daring quests, and impossible journeys. You feel the spirit of adventure awakening within you. When you leave the library, you'll never be content with an ordinary life again. Every day will be a new quest, every challenge a dragon to slay.",
    isEnding: true,
    endingType: "good",
  },
  love_tales: {
    id: "love_tales",
    title: "The Heart's Wisdom",
    content:
      "Romance novels flutter around you like butterflies, each one teaching you about the many forms of love. You learn that love isn't just romantic—it's the love of friends, family, strangers, and most importantly, yourself. You leave with a heart full of compassion and the ability to see the love story in every life you encounter.",
    isEnding: true,
    endingType: "good",
  },
  mystery_tales: {
    id: "mystery_tales",
    title: "The Detective's Mind",
    content:
      "Mystery novels swirl around you, each one sharpening your powers of observation and deduction. You begin to see patterns everywhere, to notice details others miss. You leave the library with the mind of a detective, able to solve puzzles and uncover truths that others cannot see.",
    isEnding: true,
    endingType: "good",
  },
  upper_floors: {
    id: "upper_floors",
    title: "The Tower of Time",
    content:
      "The spiral staircase seems to climb forever, each floor representing a different era of storytelling. You pass floors dedicated to ancient myths, medieval legends, modern novels, and future tales not yet written. At the very top, you find a single chair facing a window that looks out onto all of time itself.",
    choices: [
      { text: "Sit in the chair and observe", nextId: "time_observer" },
      { text: "Look for a way to the roof", nextId: "library_roof" },
      { text: "Descend back down", nextId: "library_hall" },
    ],
  },
  time_observer: {
    id: "time_observer",
    title: "The Eternal Witness",
    content:
      "From the chair, you watch the flow of all stories across time. You see how every tale connects to every other, how characters from different eras influence each other across the centuries. You become the eternal witness, the one who remembers all stories and ensures none are truly forgotten.",
    isEnding: true,
    endingType: "good",
  },
  library_roof: {
    id: "library_roof",
    title: "Among the Stars",
    content:
      "On the library's roof, you discover that the building extends into the night sky itself. Stars are revealed to be the lights of other libraries on other worlds, each one preserving the stories of its civilization. You realize you've found the universal library, the repository of all stories across all worlds.",
    isEnding: true,
    endingType: "good",
  },

  // ADVENTURE GENRE - Story 2: The Dragon's Mountain
  dragon_quest: {
    id: "dragon_quest",
    title: "The Dragon's Mountain",
    content:
      "You stand at the base of Mount Pyrion, where legends say an ancient dragon guards a treasure that could save your dying village. The mountain looms before you, shrouded in mist and mystery. Your sword feels heavy at your side, and you carry the hopes of everyone you've ever loved. Three paths wind up the treacherous slopes.",
    choices: [
      { text: "Take the steep warrior's path", nextId: "warrior_path" },
      { text: "Follow the winding scholar's route", nextId: "scholar_path" },
      { text: "Choose the hidden thief's passage", nextId: "thief_path" },
    ],
  },
  warrior_path: {
    id: "warrior_path",
    title: "Trial by Combat",
    content:
      "The warrior's path leads you through treacherous terrain filled with stone guardians that come alive as you pass. Each battle tests your resolve and skill. Your muscles ache, your armor is dented, but your spirit burns brighter with each victory. Finally, you reach a plateau where the dragon's roar echoes from a crystal cave above.",
    choices: [
      { text: "Challenge the dragon to honorable combat", nextId: "dragon_combat" },
      { text: "Seek to understand the dragon's purpose", nextId: "dragon_wisdom" },
      { text: "Attempt to sneak past the dragon", nextId: "dragon_sneak" },
    ],
  },
  scholar_path: {
    id: "scholar_path",
    title: "The Path of Knowledge",
    content:
      "The scholar's route winds through ancient ruins covered in draconic script. You spend hours deciphering the texts, learning the true history of the dragon and the mountain. The dragon, you discover, is not a monster but a guardian, protecting something far more valuable than gold—the last repository of ancient wisdom.",
    choices: [
      { text: "Approach the dragon with respect", nextId: "dragon_respect" },
      { text: "Offer to help protect the knowledge", nextId: "dragon_alliance" },
      { text: "Try to convince the dragon to share the wisdom", nextId: "dragon_negotiate" },
    ],
  },
  thief_path: {
    id: "thief_path",
    title: "Shadows and Secrets",
    content:
      "The hidden passage leads through narrow caves and secret tunnels. You move like a shadow, avoiding the dragon's notice. In the depths of the mountain, you discover the truth—the 'treasure' is not gold, but a magical spring that can heal any ailment. The dragon guards it not from greed, but to prevent its misuse.",
    choices: [
      { text: "Take just enough water to save your village", nextId: "noble_thief" },
      { text: "Try to steal as much as possible", nextId: "greedy_thief" },
      { text: "Reveal yourself to the dragon", nextId: "honest_thief" },
    ],
  },
  dragon_combat: {
    id: "dragon_combat",
    title: "The Dragon's Respect",
    content:
      "The ancient dragon, Pyraxis, emerges with scales that shimmer like molten gold. Your battle is fierce but honorable. In the end, the dragon yields not from defeat, but from respect for your courage. 'Few have faced me with such honor,' Pyraxis rumbles. 'Your village's salvation lies not in treasure, but in the strength you've shown here.'",
    isEnding: true,
    endingType: "good",
  },
  dragon_wisdom: {
    id: "dragon_wisdom",
    title: "The Ancient Pact",
    content:
      "Instead of fighting, you listen to the dragon's story. Pyraxis reveals that he once made a pact with your ancestors—to guard the mountain's power until a worthy heir appeared. Your willingness to seek understanding rather than battle proves your worth. The dragon grants you not treasure, but the wisdom to lead your village to prosperity.",
    isEnding: true,
    endingType: "good",
  },
  dragon_sneak: {
    id: "dragon_sneak",
    title: "The Coward's Gold",
    content:
      "You manage to sneak past the sleeping dragon and find a chamber filled with gold. But as you grab the treasure, you realize it's cursed—anyone who takes it without earning it will be forever haunted by their cowardice. You return to your village wealthy but hollow, knowing you chose the easy path over the right one.",
    isEnding: true,
    endingType: "bad",
  },
  dragon_respect: {
    id: "dragon_respect",
    title: "The Scholar's Reward",
    content:
      "Your respectful approach and knowledge of draconic lore impresses Pyraxis. The dragon shares ancient secrets of healing and agriculture that will make your village prosper for generations. 'Knowledge shared is knowledge multiplied,' the dragon says, gifting you with wisdom worth more than any treasure.",
    isEnding: true,
    endingType: "good",
  },
  dragon_alliance: {
    id: "dragon_alliance",
    title: "Guardian's Bond",
    content:
      "The dragon accepts your offer to help protect the ancient knowledge. You become the dragon's human partner, learning secrets that have been hidden for millennia. Together, you establish a school where worthy students can learn the old ways, ensuring the wisdom survives for future generations.",
    isEnding: true,
    endingType: "good",
  },
  dragon_negotiate: {
    id: "dragon_negotiate",
    title: "The Bargain Struck",
    content:
      "Through careful negotiation, you convince the dragon to share some of its knowledge in exchange for your village's protection of the mountain. It's a fair bargain that benefits both parties, though you sense the dragon is testing your people's worthiness. Time will tell if the pact holds.",
    isEnding: true,
    endingType: "neutral",
  },
  noble_thief: {
    id: "noble_thief",
    title: "Honor Among Thieves",
    content:
      "You take only what you need, showing restraint and honor even in theft. The dragon, who was watching all along, is impressed by your nobility. 'A thief with honor is rarer than any treasure,' Pyraxis says, allowing you to take the healing water and offering your village his protection.",
    isEnding: true,
    endingType: "good",
  },
  greedy_thief: {
    id: "greedy_thief",
    title: "The Price of Greed",
    content:
      "Your greed awakens the dragon's wrath. Though you escape with some of the magical water, the dragon's curse follows you. The water heals your village but at a terrible cost—you age rapidly, paying with your own life for your selfishness. Your village is saved, but you become a cautionary tale.",
    isEnding: true,
    endingType: "bad",
  },
  honest_thief: {
    id: "honest_thief",
    title: "Redemption's Path",
    content:
      "Your honesty in revealing yourself touches the dragon's heart. 'You came as a thief but leave as a hero,' Pyraxis declares. The dragon not only allows you to take the healing water but also teaches you the secret of creating more, ensuring your village will never suffer from disease again.",
    isEnding: true,
    endingType: "good",
  },

  // ROMANCE GENRE - Story 1: The Time Traveler's Café
  time_cafe: {
    id: "time_cafe",
    title: "The Time Traveler's Café",
    content:
      "You discover a peculiar café where the same person appears to be working every shift, but they're different ages each time you visit. Today, they look about your age, with kind eyes that seem to hold centuries of experience. When they serve your coffee, they whisper, 'I've been waiting for you across many lifetimes.'",
    choices: [
      { text: "Ask them what they mean", nextId: "time_explanation" },
      { text: "Play along with the mystery", nextId: "time_flirt" },
      { text: "Leave immediately", nextId: "time_flee" },
    ],
  },
  time_explanation: {
    id: "time_explanation",
    title: "The Eternal Barista",
    content:
      "They lean closer, their voice barely audible above the café's ambient music. 'I'm caught in a time loop, living the same day over and over, but aging with each cycle. You're the only constant—the only person who makes each day worth living again. I've fallen in love with you a thousand times, but you never remember.'",
    choices: [
      { text: "Try to help them break the loop", nextId: "break_loop" },
      { text: "Ask to remember the other timelines", nextId: "remember_timelines" },
      { text: "Confess you've felt drawn to this café", nextId: "mutual_attraction" },
    ],
  },
  time_flirt: {
    id: "time_flirt",
    title: "Dancing Through Time",
    content:
      "You decide to embrace the mystery, flirting back with playful banter about time and destiny. Their face lights up with joy and relief. 'In some timelines, you're a poet. In others, a scientist. But in every single one, you have the most beautiful laugh.' The connection between you feels both new and ancient.",
    choices: [
      { text: "Ask about your other selves", nextId: "other_selves" },
      { text: "Focus on this timeline's connection", nextId: "present_moment" },
      { text: "Suggest leaving the café together", nextId: "escape_together" },
    ],
  },
  time_flee: {
    id: "time_flee",
    title: "The Path Not Taken",
    content:
      "You leave the café quickly, but you can't shake the feeling that you've made a terrible mistake. Over the following weeks, you find yourself drawn back to the area, but the café is never there when you look for it. You spend the rest of your life wondering about the person with the ancient eyes and what they meant.",
    isEnding: true,
    endingType: "bad",
  },
  break_loop: {
    id: "break_loop",
    title: "Love's Liberation",
    content:
      "Together, you work to understand the time loop. Through research and experimentation, you discover that the loop was created by their desperate wish to find true love. Your genuine desire to help them, born from love rather than pity, breaks the spell. Time moves forward again, and you face the future together.",
    isEnding: true,
    endingType: "good",
  },
  remember_timelines: {
    id: "remember_timelines",
    title: "Memories Across Time",
    content:
      "They touch your hand, and suddenly you remember—every meeting, every conversation, every moment of connection across countless timelines. The weight of all that love, all those memories, is overwhelming but beautiful. You understand now that some love is so strong it transcends time itself.",
    isEnding: true,
    endingType: "good",
  },
  mutual_attraction: {
    id: "mutual_attraction",
    title: "Destined Hearts",
    content:
      "Your confession that you've always felt drawn to this place, to them, confirms what they've hoped for across countless loops. 'Our souls recognize each other,' they say, tears in their eyes. 'Even when our minds forget, our hearts remember.' The time loop begins to weaken, reality bending around your mutual love.",
    isEnding: true,
    endingType: "good",
  },
  other_selves: {
    id: "other_selves",
    title: "Infinite Variations",
    content:
      "They tell you stories of your other selves—the you who was a musician and serenaded them with songs, the you who was a chef and cooked elaborate meals, the you who was a teacher and helped them understand their condition. 'But this you,' they say, 'this you is my favorite, because this is the you who chose to stay and listen.'",
    isEnding: true,
    endingType: "good",
  },
  present_moment: {
    id: "present_moment",
    title: "Here and Now",
    content:
      "You decide that whatever happened in other timelines doesn't matter—what matters is this moment, this connection, this choice to be present with each other. Your focus on the here and now grounds them in reality, and slowly, the time loop begins to dissolve. Love, it turns out, is the most powerful force for keeping someone in the present.",
    isEnding: true,
    endingType: "good",
  },
  escape_together: {
    id: "escape_together",
    title: "Beyond the Loop",
    content:
      "Hand in hand, you leave the café together. As you step outside, the building fades away like morning mist. They're free from the loop, but the cost is that the café—their anchor to this reality—is gone forever. It doesn't matter. You have each other, and that's enough to build a new reality on.",
    isEnding: true,
    endingType: "good",
  },

  // ROMANCE GENRE - Story 2: The Letter Exchange
  letter_exchange: {
    id: "letter_exchange",
    title: "Letters to a Stranger",
    content:
      "You find a handwritten letter tucked into a library book—a heartfelt message from someone pouring out their loneliness and dreams to an unknown reader. On impulse, you write back, leaving your response in the same book. Days later, you return to find a reply waiting for you, beginning an anonymous correspondence that slowly becomes the highlight of your days.",
    choices: [
      { text: "Suggest meeting in person", nextId: "suggest_meeting" },
      { text: "Keep the mystery alive", nextId: "maintain_mystery" },
      { text: "Try to figure out who they are", nextId: "detective_work" },
    ],
  },
  suggest_meeting: {
    id: "suggest_meeting",
    title: "The Leap of Faith",
    content:
      "You write a letter suggesting you meet at the library's café. Your heart pounds as you wait, wondering if they'll show up, if the magic of your written connection will translate to real life. Then you see someone approaching your table, holding the same book where your letters have been exchanged, looking as nervous and hopeful as you feel.",
    choices: [
      { text: "Greet them warmly", nextId: "warm_greeting" },
      { text: "Admit you're nervous", nextId: "nervous_confession" },
      { text: "Comment on the coincidence", nextId: "coincidence_comment" },
    ],
  },
  maintain_mystery: {
    id: "maintain_mystery",
    title: "The Beautiful Unknown",
    content:
      "You decide that the mystery is part of the magic. Your letters become more intimate, more revealing, as you share your deepest thoughts with someone whose face you've never seen. The anonymity allows for a purity of connection that might not exist if you knew each other's physical forms. Your love grows in the realm of words and souls.",
    choices: [
      { text: "Propose a lifetime of letters", nextId: "lifetime_letters" },
      { text: "Suggest exchanging photos", nextId: "photo_exchange" },
      { text: "Ask about their dreams", nextId: "dream_sharing" },
    ],
  },
  detective_work: {
    id: "detective_work",
    title: "The Investigation",
    content:
      "You become a detective of the heart, analyzing handwriting, noting which books they choose, trying to piece together clues about their identity. Your investigation leads you to realize they work at the library—you've probably seen them dozens of times without knowing they were your mysterious correspondent.",
    choices: [
      { text: "Observe the library staff", nextId: "staff_observation" },
      { text: "Leave a letter with specific clues", nextId: "clue_letter" },
      { text: "Abandon the investigation", nextId: "give_up_search" },
    ],
  },
  warm_greeting: {
    id: "warm_greeting",
    title: "Recognition",
    content:
      "As you greet them, you realize you've seen each other before—brief glances in the library, polite nods in the hallway. The recognition is mutual and electric. 'I wondered if it might be you,' they say with a smile. 'Your letters have the same kindness as your eyes.' The transition from written to spoken word feels natural and right.",
    isEnding: true,
    endingType: "good",
  },
  nervous_confession: {
    id: "nervous_confession",
    title: "Vulnerable Truth",
    content:
      "Your admission of nervousness breaks the ice perfectly. They laugh and confess they've been pacing outside for ten minutes, too scared to come in. Your shared vulnerability becomes the foundation for deeper intimacy. 'If we can be this honest in person,' they say, 'imagine how beautiful our future conversations will be.'",
    isEnding: true,
    endingType: "good",
  },
  coincidence_comment: {
    id: "coincidence_comment",
    title: "Meant to Be",
    content:
      "You comment on the amazing coincidence of finding each other through letters, and they shake their head with a knowing smile. 'I don't think it's coincidence,' they say. 'I think some connections are meant to happen, and the universe just finds creative ways to make them occur.' You realize they might be right.",
    isEnding: true,
    endingType: "good",
  },
  lifetime_letters: {
    id: "lifetime_letters",
    title: "Eternal Correspondence",
    content:
      "You propose continuing your letter exchange for life, never meeting, never revealing your identities, but growing old together through words alone. They agree, and your correspondence becomes legendary—two souls connected across decades through the written word, proving that love doesn't always need a face, just a heart.",
    isEnding: true,
    endingType: "good",
  },
  photo_exchange: {
    id: "photo_exchange",
    title: "Faces Revealed",
    content:
      "You exchange photos in your next letters, and the faces match the souls you've come to know. The physical attraction is there, but it's secondary to the deep emotional connection you've built. Your relationship evolves naturally from letters to phone calls to video chats, each step deepening your bond.",
    isEnding: true,
    endingType: "good",
  },
  dream_sharing: {
    id: "dream_sharing",
    title: "Shared Visions",
    content:
      "Your letters turn to dreams and aspirations, and you discover you've been having similar dreams about each other—walking together in places you've never been, sharing conversations you've never had. The connection transcends the physical world, existing in the realm of dreams and possibilities.",
    isEnding: true,
    endingType: "good",
  },
  staff_observation: {
    id: "staff_observation",
    title: "The Librarian's Secret",
    content:
      "Through careful observation, you identify your correspondent—the quiet librarian who always seems to be reading during breaks, whose eyes light up when discussing books. When you approach with your latest letter, they blush and smile. 'I was wondering when you'd figure it out,' they say. 'I've been hoping you would.'",
    isEnding: true,
    endingType: "good",
  },
  clue_letter: {
    id: "clue_letter",
    title: "The Revealing Letter",
    content:
      "Your letter filled with specific clues about your identity prompts them to reveal themselves in return. The mutual revelation is thrilling—you've been circling each other for months, both too shy to make the first move until the letters gave you courage. Your first face-to-face conversation feels like coming home.",
    isEnding: true,
    endingType: "good",
  },
  give_up_search: {
    id: "give_up_search",
    title: "The Mystery Preserved",
    content:
      "You decide that trying to solve the mystery might ruin it. Instead, you focus on deepening your written connection, letting the relationship exist in its pure, anonymous form. Sometimes the most beautiful love stories are the ones that exist outside the constraints of the physical world.",
    isEnding: true,
    endingType: "neutral",
  },

  // SPORTS GENRE - Story 1: The Championship Dream
  championship_dream: {
    id: "championship_dream",
    title: "The Final Game",
    content:
      "The stadium roars with 80,000 voices as you step onto the field for the championship game. Years of training, sacrifice, and dreams have led to this moment. Your team, the underdogs from a small town, faces the defending champions. Your jersey feels heavy with the hopes of everyone back home. The scoreboard shows 0-0, but the weight of expectation is immense.",
    choices: [
      { text: "Rally your team with an inspiring speech", nextId: "team_speech" },
      { text: "Focus on your individual performance", nextId: "solo_focus" },
      { text: "Study the opponents' strategy", nextId: "strategy_study" },
    ],
  },
  team_speech: {
    id: "team_speech",
    title: "United We Stand",
    content:
      "Your words ignite something powerful in your teammates' eyes. 'We didn't come this far to only come this far,' you declare. 'Every practice, every sacrifice, every moment of doubt—it all led us here. They may have the trophies, but we have heart!' The team huddles closer, and you feel the shift in energy. Together, you're not just eleven players—you're one unstoppable force.",
    choices: [
      { text: "Execute a risky but brilliant play", nextId: "brilliant_play" },
      { text: "Play steady and wait for opportunities", nextId: "steady_play" },
      { text: "Adapt to counter their strategy", nextId: "adaptive_play" },
    ],
  },
  solo_focus: {
    id: "solo_focus",
    title: "The Lone Wolf",
    content:
      "You decide to focus entirely on your own game, trusting your individual skills over team coordination. Your performance is flawless—every pass precise, every move calculated. You score spectacular goals and make impossible saves, but something feels hollow. The crowd cheers your name, but your teammates seem distant.",
    choices: [
      { text: "Recognize the importance of teamwork", nextId: "team_realization" },
      { text: "Continue playing as an individual star", nextId: "solo_glory" },
      { text: "Try to balance both approaches", nextId: "balanced_approach" },
    ],
  },
  strategy_study: {
    id: "strategy_study",
    title: "The Chess Master",
    content:
      "You spend the first half analyzing every move the opposing team makes, looking for patterns and weaknesses. Your careful observation pays off—you notice they have a blind spot in their defense and a tendency to overcommit on offense. Armed with this knowledge, you're ready to turn the game around.",
    choices: [
      { text: "Exploit their defensive weakness", nextId: "exploit_defense" },
      { text: "Counter their offensive patterns", nextId: "counter_offense" },
      { text: "Share your insights with the team", nextId: "team_strategy" },
    ],
  },
  brilliant_play: {
    id: "brilliant_play",
    title: "Moment of Glory",
    content:
      "With seconds left on the clock, you call the play you've practiced a thousand times but never used in a real game. It's audacious, requiring perfect timing from every player. As the ball leaves your hands, time seems to slow. Your teammate catches it in the end zone just as the final whistle blows. The stadium erupts. You've done it—champions at last, proving that heart and teamwork can overcome any odds.",
    isEnding: true,
    endingType: "good",
  },
  steady_play: {
    id: "steady_play",
    title: "The Patient Victory",
    content:
      "Your steady, methodical approach pays off. You don't make spectacular plays, but you don't make mistakes either. Slowly, surely, your team builds a lead through consistent effort and smart decisions. It's not the most exciting victory, but it's yours. Sometimes the greatest triumphs come not from brilliance, but from refusing to give up.",
    isEnding: true,
    endingType: "good",
  },
  adaptive_play: {
    id: "adaptive_play",
    title: "The Flexible Champion",
    content:
      "Your ability to adapt your strategy mid-game becomes the key to victory. When they adjust their defense, you change your offense. When they pressure your weak side, you strengthen it. Your flexibility and quick thinking lead your team to a hard-fought victory that showcases not just skill, but intelligence and leadership.",
    isEnding: true,
    endingType: "good",
  },
  team_realization: {
    id: "team_realization",
    title: "The True Champion",
    content:
      "Mid-game, you realize that individual glory means nothing without your team. You start passing more, encouraging others, playing for the collective rather than personal stats. Your change in attitude transforms the entire team's energy. You win not just the game, but the respect and friendship of your teammates. This victory will be remembered not for your individual performance, but for your growth as a leader.",
    isEnding: true,
    endingType: "good",
  },
  solo_glory: {
    id: "solo_glory",
    title: "The Hollow Victory",
    content:
      "You continue playing for individual glory, and your stats are incredible. You win the game almost single-handedly and earn MVP honors. But as you hold the trophy, surrounded by teammates who feel more like strangers, you realize that winning alone isn't really winning at all. The victory feels empty, and you wonder if this is really what you wanted.",
    isEnding: true,
    endingType: "bad",
  },
  balanced_approach: {
    id: "balanced_approach",
    title: "The Complete Player",
    content:
      "You find the perfect balance between individual excellence and team play. Your personal skills shine, but always in service of the team's success. You make the key plays when needed, but also set up your teammates for their moments of glory. The victory is sweet because it's shared, and you've proven that the best players make everyone around them better.",
    isEnding: true,
    endingType: "good",
  },
  exploit_defense: {
    id: "exploit_defense",
    title: "The Strategic Strike",
    content:
      "Your exploitation of their defensive weakness leads to a series of quick scores that completely changes the momentum of the game. The opposing team scrambles to adjust, but it's too late. Your analytical approach and patience in waiting for the right moment to strike proves that sometimes the mind is the most powerful weapon in sports.",
    isEnding: true,
    endingType: "good",
  },
  counter_offense: {
    id: "counter_offense",
    title: "The Perfect Defense",
    content:
      "By perfectly countering their offensive patterns, you turn their greatest strength into their weakness. Every time they try their favorite plays, you're already there waiting. Your defensive mastery frustrates them into making mistakes, and you capitalize on every error. Victory comes through preparation and intelligence rather than raw talent.",
    isEnding: true,
    endingType: "good",
  },
  team_strategy: {
    id: "team_strategy",
    title: "The Master Tactician",
    content:
      "Sharing your strategic insights with the team transforms everyone's understanding of the game. Your teammates start seeing the patterns you've identified, and suddenly the entire team is playing at a higher level. The victory is comprehensive and satisfying because everyone contributed to the strategic success. You've proven that knowledge shared is power multiplied.",
    isEnding: true,
    endingType: "good",
  },

  // SPORTS GENRE - Story 2: The Comeback Kid
  comeback_story: {
    id: "comeback_story",
    title: "Second Chances",
    content:
      "Two years ago, a career-ending injury took you away from the sport you loved. Now, against all medical advice, you're attempting a comeback. Your body isn't what it used to be, but your determination burns brighter than ever. The local team has agreed to give you a tryout, but whispers follow you everywhere—'washed up,' 'has-been,' 'should have stayed retired.'",
    choices: [
      { text: "Prove them wrong with raw determination", nextId: "determination_path" },
      { text: "Use experience and wisdom over athleticism", nextId: "wisdom_path" },
      { text: "Focus on inspiring younger players", nextId: "mentor_path" },
    ],
  },
  determination_path: {
    id: "determination_path",
    title: "Against All Odds",
    content:
      "You push your body beyond its limits, training harder than athletes half your age. Every morning brings pain, but also purpose. Your determination becomes legendary among the team—they've never seen someone fight so hard for a second chance. Your work ethic starts to inspire others, and slowly, the whispers change from doubt to admiration.",
    choices: [
      { text: "Push through a major setback", nextId: "overcome_setback" },
      { text: "Accept your physical limitations", nextId: "accept_limits" },
      { text: "Inspire others to push their limits too", nextId: "inspire_others" },
    ],
  },
  wisdom_path: {
    id: "wisdom_path",
    title: "The Veteran's Edge",
    content:
      "You realize you can't compete on pure athleticism anymore, so you focus on what experience has taught you—reading the game, anticipating plays, making smart decisions. Your younger teammates are faster and stronger, but you see things they miss. Your veteran presence becomes invaluable, turning you from a liability into a strategic asset.",
    choices: [
      { text: "Become the team's strategic leader", nextId: "strategic_leader" },
      { text: "Focus on clutch moments", nextId: "clutch_player" },
      { text: "Teach others your insights", nextId: "share_wisdom" },
    ],
  },
  mentor_path: {
    id: "mentor_path",
    title: "The Teacher Returns",
    content:
      "You realize your greatest contribution might not be your own performance, but what you can teach others. You take younger players under your wing, sharing hard-earned lessons about perseverance, dedication, and the true meaning of sportsmanship. Your comeback becomes less about personal glory and more about passing on a legacy.",
    choices: [
      { text: "Focus entirely on coaching others", nextId: "full_mentor" },
      { text: "Balance mentoring with playing", nextId: "player_coach" },
      { text: "Create a formal training program", nextId: "training_program" },
    ],
  },
  overcome_setback: {
    id: "overcome_setback",
    title: "Unbreakable Spirit",
    content:
      "When a training injury threatens to end your comeback before it begins, you refuse to quit. Through months of rehabilitation and unwavering determination, you not only recover but come back stronger. Your refusal to surrender becomes the stuff of legend, proving that some spirits simply cannot be broken.",
    isEnding: true,
    endingType: "good",
  },
  accept_limits: {
    id: "accept_limits",
    title: "Wisdom in Acceptance",
    content:
      "You learn to work within your physical limitations rather than against them. This acceptance doesn't diminish you—it transforms you into a smarter, more efficient player. You may not be the fastest anymore, but you're the most effective. Your comeback succeeds not by denying your limitations, but by transcending them.",
    isEnding: true,
    endingType: "good",
  },
  inspire_others: {
    id: "inspire_others",
    title: "The Catalyst",
    content:
      "Your determination becomes contagious. Teammates start pushing themselves harder, inspired by your example. The entire team's performance improves because you've shown them what's possible when someone refuses to give up. Your comeback succeeds not just individually, but by elevating everyone around you.",
    isEnding: true,
    endingType: "good",
  },
  strategic_leader: {
    id: "strategic_leader",
    title: "The Field General",
    content:
      "Your deep understanding of the game makes you invaluable as a strategic leader. You may not be the fastest player on the field, but you're the smartest. Your ability to read situations and make crucial decisions in pressure moments proves that experience and wisdom can be just as valuable as youth and speed.",
    isEnding: true,
    endingType: "good",
  },
  clutch_player: {
    id: "clutch_player",
    title: "When It Matters Most",
    content:
      "You discover that while your overall performance may have declined, your ability to perform in crucial moments has actually improved. Your experience and mental toughness make you the player everyone wants on the field when the game is on the line. Your comeback is defined not by statistics, but by moments that matter.",
    isEnding: true,
    endingType: "good",
  },
  share_wisdom: {
    id: "share_wisdom",
    title: "The Living Library",
    content:
      "You become a repository of knowledge for younger players, sharing insights that can only come from years of experience. Your technical skills may have diminished, but your understanding of the game has deepened. You find fulfillment in watching others succeed using lessons you've taught them.",
    isEnding: true,
    endingType: "good",
  },
  full_mentor: {
    id: "full_mentor",
    title: "The Greatest Victory",
    content:
      "You transition from player to full-time mentor, and discover this role suits you better than you ever imagined. Watching your proteges succeed gives you more satisfaction than your own achievements ever did. Your comeback story becomes one of transformation—from seeking personal glory to finding purpose in lifting others up.",
    isEnding: true,
    endingType: "good",
  },
  player_coach: {
    id: "player_coach",
    title: "The Dual Role",
    content:
      "You successfully balance playing and coaching, becoming a unique hybrid that the team has never seen before. Your on-field experience informs your teaching, while your coaching insights improve your play. You've found a way to extend your career while preparing for life after sports.",
    isEnding: true,
    endingType: "good",
  },
  training_program: {
    id: "training_program",
    title: "The Legacy Builder",
    content:
      "Your formal training program becomes renowned for developing not just skilled athletes, but complete competitors with strong character. Your comeback story evolves into something bigger—a system for helping others achieve their own comebacks and second chances. Your greatest victory is the success of those you've trained.",
    isEnding: true,
    endingType: "good",
  },
}

const genres: Genre[] = [
  {
    id: "adventure",
    title: "Adventure",
    description: "Epic quests and thrilling journeys await",
    icon: Sword,
    color: "from-orange-500 to-red-500",
    stories: [
      {
        id: "midnight_library",
        title: "The Midnight Library",
        description: "A mysterious library that appears only at midnight holds secrets beyond imagination.",
        startNodeId: "midnight_library",
      },
      {
        id: "dragon_quest",
        title: "The Dragon's Mountain",
        description: "Face an ancient dragon to save your village, but the truth may surprise you.",
        startNodeId: "dragon_quest",
      },
    ],
  },
  {
    id: "romance",
    title: "Romance",
    description: "Stories of the heart and soul connections",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    stories: [
      {
        id: "time_cafe",
        title: "The Time Traveler's Café",
        description: "A mysterious barista claims to have loved you across multiple timelines.",
        startNodeId: "time_cafe",
      },
      {
        id: "letter_exchange",
        title: "Letters to a Stranger",
        description: "An anonymous correspondence blossoms into something beautiful and unexpected.",
        startNodeId: "letter_exchange",
      },
    ],
  },
  {
    id: "sports",
    title: "Sports",
    description: "Victory, defeat, and the spirit of competition",
    icon: Trophy,
    color: "from-blue-500 to-cyan-500",
    stories: [
      {
        id: "championship_dream",
        title: "The Final Game",
        description: "Lead your underdog team to victory in the championship game of a lifetime.",
        startNodeId: "championship_dream",
      },
      {
        id: "comeback_story",
        title: "Second Chances",
        description: "Attempt an impossible comeback after a career-ending injury.",
        startNodeId: "comeback_story",
      },
    ],
  },
]

/* ────────────────────────
   Main Component
──────────────────────────*/
export default function InteractiveStory() {
  const [currentView, setCurrentView] = useState<"home" | "genre" | "story">("home")
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [currentNodeId, setCurrentNodeId] = useState<string>("")

  const currentNode = storyNodes[currentNodeId]

  const handleChoice = (nextId: string) => {
    if (storyNodes[nextId]) {
      setCurrentNodeId(nextId)
    } else {
      console.warn(`Story node ${nextId} not found`)
      setCurrentView("home")
    }
  }

  const startStory = (story: Story) => {
    setCurrentNodeId(story.startNodeId)
    setCurrentView("story")
  }

  const goHome = () => {
    setCurrentView("home")
    setSelectedGenre(null)
    setCurrentNodeId("")
  }

  const goToGenre = (genre: Genre) => {
    setSelectedGenre(genre)
    setCurrentView("genre")
  }

  const goBack = () => {
    if (currentView === "story") {
      setCurrentView("genre")
    } else if (currentView === "genre") {
      setCurrentView("home")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {currentView !== "home" && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          )}
        </div>
        <button
          onClick={goHome}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/20 transition-colors"
        >
          <Home size={20} />
          Home
        </button>
      </nav>

      <div className="container mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* Home View */}
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Interactive Tales
              </h1>
              <p className="text-xl mb-12 text-purple-200 max-w-2xl mx-auto">
                Choose your adventure and shape your destiny through the power of choice
              </p>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {genres.map((genre) => {
                  const IconComponent = genre.icon
                  return (
                    <motion.div
                      key={genre.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass p-8 rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                      onClick={() => goToGenre(genre)}
                    >
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${genre.color} flex items-center justify-center`}
                      >
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{genre.title}</h3>
                      <p className="text-purple-200 mb-4">{genre.description}</p>
                      <p className="text-sm text-purple-300">{genre.stories.length} stories available</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Genre View */}
          {currentView === "genre" && selectedGenre && (
            <motion.div
              key="genre"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-12">
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${selectedGenre.color} flex items-center justify-center`}
                >
                  <selectedGenre.icon size={40} className="text-white" />
                </div>
                <h1 className="text-5xl font-bold mb-4">{selectedGenre.title}</h1>
                <p className="text-xl text-purple-200">{selectedGenre.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {selectedGenre.stories.map((story) => (
                  <motion.div
                    key={story.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass p-6 rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                    onClick={() => startStory(story)}
                  >
                    <h3 className="text-2xl font-bold mb-3">{story.title}</h3>
                    <p className="text-purple-200 mb-4">{story.description}</p>
                    <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
                      Start Story
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Story View */}
          {currentView === "story" && currentNode && (
            <motion.div
              key={`story-${currentNode.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass p-8 rounded-xl">
                <h1 className="text-4xl font-bold mb-6 text-purple-200">{currentNode.title}</h1>
                <div className="prose prose-lg prose-invert mb-8">
                  <p className="text-lg leading-relaxed">{currentNode.content}</p>
                </div>

                {currentNode.isEnding ? (
                  <div className="text-center">
                    <div
                      className={`inline-block px-4 py-2 rounded-full mb-6 ${
                        currentNode.endingType === "good"
                          ? "bg-green-600"
                          : currentNode.endingType === "bad"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                      }`}
                    >
                      {currentNode.endingType === "good"
                        ? "Good Ending"
                        : currentNode.endingType === "bad"
                          ? "Bad Ending"
                          : "Neutral Ending"}
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => setCurrentView("genre")}
                        className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                      >
                        Choose Another Story
                      </button>
                      <button
                        onClick={goHome}
                        className="block w-full px-6 py-3 glass hover:bg-white/20 rounded-lg font-semibold transition-colors"
                      >
                        Return to Home
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentNode.choices?.map((choice, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice(choice.nextId)}
                        className="block w-full text-left p-4 glass hover:bg-white/20 rounded-lg transition-all"
                      >
                        <span className="font-semibold">{choice.text}</span>
                        {choice.consequence && (
                          <span className="block text-sm text-purple-300 mt-1">{choice.consequence}</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
