import { Quote, QuoteCategory } from '@/types/quote';

export const quotes: Quote[] = [
  // Motivation Quotes
  { id: 'm1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { id: 'm2', text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'motivation' },
  { id: 'm3', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'motivation' },
  { id: 'm4', text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'motivation' },
  { id: 'm5', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'motivation' },
  { id: 'm6', text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair', category: 'motivation' },
  { id: 'm7', text: 'Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.', author: 'Roy T. Bennett', category: 'motivation' },
  { id: 'm8', text: 'I learned that courage was not the absence of fear, but the triumph over it.', author: 'Nelson Mandela', category: 'motivation' },
  { id: 'm9', text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', category: 'motivation' },
  { id: 'm10', text: 'Your limitation—it\'s only your imagination.', author: 'Unknown', category: 'motivation' },

  // Love Quotes
  { id: 'l1', text: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.', author: 'Lao Tzu', category: 'love' },
  { id: 'l2', text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn', category: 'love' },
  { id: 'l3', text: 'Love is composed of a single soul inhabiting two bodies.', author: 'Aristotle', category: 'love' },
  { id: 'l4', text: 'Where there is love there is life.', author: 'Mahatma Gandhi', category: 'love' },
  { id: 'l5', text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott', category: 'love' },
  { id: 'l6', text: 'Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.', author: 'Maya Angelou', category: 'love' },
  { id: 'l7', text: 'The greatest happiness of life is the conviction that we are loved.', author: 'Victor Hugo', category: 'love' },
  { id: 'l8', text: 'Love is not only something you feel, it is something you do.', author: 'David Wilkerson', category: 'love' },
  { id: 'l9', text: 'We loved with a love that was more than love.', author: 'Edgar Allan Poe', category: 'love' },
  { id: 'l10', text: 'Love is the bridge between two hearts.', author: 'Unknown', category: 'love' },

  // Humour Quotes
  { id: 'h1', text: 'I\'m not lazy, I\'m just on energy-saving mode.', author: 'Unknown', category: 'humour' },
  { id: 'h2', text: 'Life is short. Smile while you still have teeth.', author: 'Unknown', category: 'humour' },
  { id: 'h3', text: 'I\'m not arguing, I\'m just explaining why I\'m right.', author: 'Unknown', category: 'humour' },
  { id: 'h4', text: 'I don\'t need a hair stylist, my pillow gives me a new hairstyle every morning.', author: 'Unknown', category: 'humour' },
  { id: 'h5', text: 'Common sense is like deodorant. The people who need it most never use it.', author: 'Unknown', category: 'humour' },
  { id: 'h6', text: 'I\'m not clumsy. The floor just hates me, the table and chairs are bullies, and the walls get in my way.', author: 'Unknown', category: 'humour' },
  { id: 'h7', text: 'My bed is a magical place where I suddenly remember everything I forgot to do.', author: 'Unknown', category: 'humour' },
  { id: 'h8', text: 'I don\'t have a bad handwriting, I have my own font.', author: 'Unknown', category: 'humour' },
  { id: 'h9', text: 'Exercise? I thought you said extra fries!', author: 'Unknown', category: 'humour' },
  { id: 'h10', text: 'I\'m on a seafood diet. I see food, and I eat it.', author: 'Unknown', category: 'humour' },

  // Fitness Quotes
  { id: 'f1', text: 'Take care of your body. It\'s the only place you have to live.', author: 'Jim Rohn', category: 'fitness' },
  { id: 'f2', text: 'The only bad workout is the one that didn\'t happen.', author: 'Unknown', category: 'fitness' },
  { id: 'f3', text: 'Push yourself because no one else is going to do it for you.', author: 'Unknown', category: 'fitness' },
  { id: 'f4', text: 'Success starts with self-discipline.', author: 'Unknown', category: 'fitness' },
  { id: 'f5', text: 'Your body can stand almost anything. It\'s your mind that you have to convince.', author: 'Unknown', category: 'fitness' },
  { id: 'f6', text: 'A one hour workout is 4% of your day. No excuses.', author: 'Unknown', category: 'fitness' },
  { id: 'f7', text: 'The pain you feel today will be the strength you feel tomorrow.', author: 'Unknown', category: 'fitness' },
  { id: 'f8', text: 'Don\'t stop when you\'re tired. Stop when you\'re done.', author: 'Unknown', category: 'fitness' },
  { id: 'f9', text: 'Sweat is just fat crying.', author: 'Unknown', category: 'fitness' },
  { id: 'f10', text: 'The only way to finish is to start.', author: 'Unknown', category: 'fitness' },

  // Success Quotes
  { id: 's1', text: 'Success is not the key to happiness. Happiness is the key to success.', author: 'Albert Schweitzer', category: 'success' },
  { id: 's2', text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau', category: 'success' },
  { id: 's3', text: 'Don\'t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller', category: 'success' },
  { id: 's4', text: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill', category: 'success' },
  { id: 's5', text: 'The road to success and the road to failure are almost exactly the same.', author: 'Colin R. Davis', category: 'success' },
  { id: 's6', text: 'Success is not how high you have climbed, but how you make a positive difference to the world.', author: 'Roy T. Bennett', category: 'success' },
  { id: 's7', text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier', category: 'success' },
  { id: 's8', text: 'The secret of success is to do the common thing uncommonly well.', author: 'John D. Rockefeller Jr.', category: 'success' },
  { id: 's9', text: 'Success is not in what you have, but who you are.', author: 'Bo Bennett', category: 'success' },
  { id: 's10', text: 'Success is getting what you want. Happiness is wanting what you get.', author: 'Dale Carnegie', category: 'success' },

  // Friendship Quotes
  { id: 'fr1', text: 'A real friend is one who walks in when the rest of the world walks out.', author: 'Walter Winchell', category: 'friendship' },
  { id: 'fr2', text: 'Friendship is born at that moment when one person says to another, "What! You too? I thought I was the only one."', author: 'C.S. Lewis', category: 'friendship' },
  { id: 'fr3', text: 'True friendship comes when the silence between two people is comfortable.', author: 'David Tyson', category: 'friendship' },
  { id: 'fr4', text: 'A friend is someone who knows all about you and still loves you.', author: 'Elbert Hubbard', category: 'friendship' },
  { id: 'fr5', text: 'Friendship is the only cement that will ever hold the world together.', author: 'Woodrow Wilson', category: 'friendship' },
  { id: 'fr6', text: 'Friends are the family you choose.', author: 'Jess C. Scott', category: 'friendship' },
  { id: 'fr7', text: 'A true friend never gets in your way unless you happen to be going down.', author: 'Arnold H. Glasow', category: 'friendship' },
  { id: 'fr8', text: 'Friendship is not about whom you have known the longest. It is about who came and never left your side.', author: 'Unknown', category: 'friendship' },
  { id: 'fr9', text: 'The greatest gift of life is friendship, and I have received it.', author: 'Hubert H. Humphrey', category: 'friendship' },
  { id: 'fr10', text: 'Friends are those rare people who ask how we are and then wait to hear the answer.', author: 'Ed Cunningham', category: 'friendship' },
];

export const categoryInfo: Record<QuoteCategory, { label: string; icon: string; gradient: string[] }> = {
  motivation: { 
    label: 'Motivation', 
    icon: 'Zap',
    gradient: ['#667eea', '#764ba2']
  },
  love: { 
    label: 'Love', 
    icon: 'Heart',
    gradient: ['#f093fb', '#f5576c']
  },
  humour: { 
    label: 'Humour', 
    icon: 'Smile',
    gradient: ['#4facfe', '#00f2fe']
  },
  fitness: { 
    label: 'Fitness', 
    icon: 'Activity',
    gradient: ['#43e97b', '#38f9d7']
  },
  success: { 
    label: 'Success', 
    icon: 'Trophy',
    gradient: ['#fa709a', '#fee140']
  },
  friendship: { 
    label: 'Friendship', 
    icon: 'Users',
    gradient: ['#30cfd0', '#330867']
  }
};