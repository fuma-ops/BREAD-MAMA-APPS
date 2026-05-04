import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Darkom',
    arabicName: 'خبز دار',
    price: 12,
    category: 'TRADITIONAL',
    description: 'Traditional Moroccan round bread, soft and authentic. Baked fresh every morning with premium flour and traditional yeast.',
    emoji: '🍞',
    quality: {
      ingredients: 'Premium wheat flour, traditional yeast, salt, water, subtle touch of olive oil',
      process: 'Kneaded by hand and baked in our traditional oven at high temperatures for the perfect crust',
      handmade: 'Shaped and scored individually by our master bakers',
      love: 'Made with the same warmth and care as our grandmothers used to make it'
    },
    reviews: [
      { author: 'Youssef B.', rating: 5, text: 'Absolutely authentic. Reminds me of home.' },
      { author: 'Sarah M.', rating: 5, text: 'The crust is perfect and so soft inside!' }
    ],
    images: ['https://images.unsplash.com/photo-1589367920969-abceb0c87b51?auto=format&fit=crop&q=80&w=500'],
    tags: ['bread', 'traditional', 'vegan'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 2,
    name: 'Msemen',
    arabicName: 'مسمن',
    price: 10,
    category: 'TRADITIONAL',
    description: 'Flaky buttery pastry, traditional Moroccan style. Perfectly crispy on the outside, soft and layered on the inside.',
    emoji: '🥐',
    quality: {
      ingredients: 'Fine semolina, premium wheat flour, pure butter, vegetable oil, salt',
      process: 'Folded multiple times to create delicate, paper-thin layers before pan-frying',
      handmade: 'Each piece is hand-stretched to achieve the authentic flaky texture',
      love: 'Served best with warm honey and mint tea'
    },
    reviews: [
      { author: 'Amina El.', rating: 5, text: 'So flaky and buttery! Best msemen in Marrakech.' },
      { author: 'Karim R.', rating: 4, text: 'Very good, perfectly cooked and not too oily.' }
    ],
    images: ['https://images.unsplash.com/photo-1626082900762-1051fa8bcfbb?auto=format&fit=crop&q=80&w=500'],
    tags: ['pastry', 'breakfast', 'traditional'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 3,
    name: 'Betbout',
    arabicName: 'بتبوت',
    price: 8,
    category: 'TRADITIONAL',
    description: 'Soft semolina bread with a golden crust. A fluffy pocket bread perfect for sweet or savory fillings.',
    emoji: '🫓',
    quality: {
      ingredients: 'Semolina flour, yeast, water, salt',
      process: 'Lightly pan-cooked to ensure a soft interior and slightly chewy exterior',
      handmade: 'Hand-rolled to the perfect thickness for optimal puffing',
      love: 'Simple ingredients brought to life with generations of technique'
    },
    reviews: [
      { author: 'Fatima Z.', rating: 5, text: 'My kids love these for their afternoon snack with cheese.' }
    ],
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500'],
    tags: ['bread', 'soft', 'kids'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 4,
    name: 'Bouchyar',
    arabicName: 'بوشيار',
    price: 25,
    category: 'PREMIUM',
    description: 'Almond cakes with honey, deliciously crispy. A rich, sweet treat combining nutty flavors with golden honey.',
    emoji: '🎂',
    quality: {
      ingredients: 'Roasted almonds, pure mountain honey, butter, flour, orange blossom water',
      process: 'Slow-baked until golden, then immediately drenched in warm honey syrup',
      handmade: 'Decorated by hand with whole toasted almonds',
      love: 'A premium indulgence reserved for distinct tastes'
    },
    reviews: [
      { author: 'FZ K.', rating: 5, text: 'Incredibly rich and the honey is top quality.' },
      { author: 'Nadia A.', rating: 5, text: 'Perfect for special occasions, everyone asked where I got them!' }
    ],
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=500'],
    tags: ['sweet', 'almonds', 'honey', 'premium'],
    available: true,
    preparation_time: 'Made to order'
  },
  {
    id: 5,
    name: 'Mehencha',
    arabicName: 'محنشة',
    price: 30,
    category: 'SPECIAL',
    description: 'Spiral pastry with almonds, honey and cinnamon. Known as "the snake" for its beautiful coiled shape.',
    emoji: '🌀',
    quality: {
      ingredients: 'Almond paste, cinnamon, mastic gum, orange blossom, warka pastry, honey',
      process: 'Delicate filling rolled into thin pastry, coiled tightly and baked until crispy',
      handmade: 'Requires immense skill to roll the delicate warka without tearing',
      love: 'The ultimate centerpiece for any Moroccan tea table'
    },
    reviews: [
      { author: 'Tarik O.', rating: 5, text: 'Beautiful presentation and the almond paste is just divine.' }
    ],
    images: ['https://images.unsplash.com/photo-1579697096985-aca13add3461?auto=format&fit=crop&q=80&w=500'],
    tags: ['sweet', 'cinnamon', 'almonds', 'special'],
    available: true,
    preparation_time: 'Made to order'
  },
  {
    id: 6,
    name: 'Chebakia',
    arabicName: 'شباكية',
    price: 15,
    category: 'PREMIUM',
    description: 'Flower-shaped cookies fried and coated with honey and sesame seeds. The perfect balance of sweet and savory in every bite.',
    emoji: '✨',
    quality: {
      ingredients: 'Almonds, sesame, cinnamon, sugar, honey, saffron',
      process: 'Hand-folded into a flower shape, fried until golden, then soaked in warm honey',
      handmade: 'Each piece takes immense skill to fold correctly and hold its shape',
      love: 'A staple of Moroccan celebrations and Ramadan'
    },
    reviews: [
      { author: 'Laila M.', rating: 5, text: 'Authentic taste! The layers of flavor are incredible.' },
      { author: 'Mehdi S.', rating: 5, text: 'Best I have had since my grandmother passed. Thank you Darkom!' }
    ],
    images: ['https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=500'],
    tags: ['savory', 'sweet', 'premium', 'delice'],
    available: true,
    preparation_time: 'Made to order'
  },
  {
    id: 7,
    name: 'Baghrir',
    arabicName: 'بغريرة',
    price: 8,
    category: 'TRADITIONAL',
    description: 'Thousand-hole Moroccan pancakes, incredibly light and spongy. Perfect for soaking up melted butter and warm honey.',
    emoji: '🥞',
    quality: {
      ingredients: 'Fine semolina, flour, yeast, baking powder, warm water',
      process: 'Cooked perfectly on one side until hundreds of tiny holes form on the surface',
      handmade: 'Poured with precision to maintain consistent size and texture',
      love: 'A breakfast classic that brings the whole family to the table'
    },
    reviews: [
      { author: 'Salma T.', rating: 5, text: 'So light and airy. The holes absorb the honey perfectly!' }
    ],
    images: ['https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=500'],
    tags: ['breakfast', 'pancake', 'traditional'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 8,
    name: 'Harcha',
    arabicName: 'حرشة',
    price: 12,
    category: 'TRADITIONAL',
    description: 'Moroccan semolina pan-fried flatbread. Crisp on the outside with a crumbly, buttery interior.',
    emoji: '🫓',
    quality: {
      ingredients: 'Coarse semolina, butter, milk, sugar, baking powder, salt',
      process: 'Mixed gently to keep the sandy texture, then slowly toasted on a cast iron griddle',
      handmade: 'Shaped by hand to achieve the rustic, authentic cracked edges',
      love: 'The quintessential Moroccan afternoon tea accompaniment'
    },
    reviews: [
      { author: 'Idriss M.', rating: 5, text: 'Tastes exactly like the one sold in the old medina.' }
    ],
    images: ['https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=500'],
    tags: ['bread', 'semolina', 'tea-time'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 9,
    name: 'Kaab el Ghazal',
    arabicName: 'كعب الغزال',
    price: 45,
    category: 'PREMIUM',
    description: 'Gazelle Horns: The crown jewel of Moroccan sweets. Delicate pastry crescents filled with pure almond paste and orange blossom water.',
    emoji: '🌙',
    quality: {
      ingredients: 'Pure almonds, orange blossom water, warka flour, butter, mastic gum',
      process: 'The almond paste is shaped by hand into a crescent, wrapped in paper-thin pastry and baked until barely golden',
      handmade: 'Each curve is carefully sculpted by our master artisans to achieve the perfect crescent shape',
      love: 'An elegant necessity for weddings and distinguished gatherings'
    },
    reviews: [
      { author: 'Leyla K.', rating: 5, text: 'The almond paste is so fragrant. Truly the best Kaab el Ghazal.' },
      { author: 'Omar F.', rating: 5, text: 'Worth every penny. The orange blossom water makes it sublime.' }
    ],
    images: ['https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=500'],
    tags: ['premium', 'almonds', 'orange-blossom'],
    available: true,
    preparation_time: 'Made to order'
  },
  {
    id: 10,
    name: 'Fekkas',
    arabicName: 'فقاص',
    price: 28,
    category: 'SWEET',
    description: 'Twice-baked Moroccan biscotti loaded with toasted almonds, sesame seeds, and fragrant anise.',
    emoji: '🍪',
    quality: {
      ingredients: 'Flour, eggs, almonds, sesame, anise seeds, sugar, oil',
      process: 'Baked as a loaf, thinly sliced, and baked again until perfectly crunchy',
      handmade: 'Sliced precisely by hand to ensure every piece has a generous amount of toasted almonds',
      love: 'The ultimate cookie for dipping into hot mint tea or coffee'
    },
    reviews: [
      { author: 'Zineb R.', rating: 4, text: 'Very crunchy and the anise flavor is wonderfully balanced.' }
    ],
    images: ['https://images.unsplash.com/photo-1603533623549-0ab73e22aa48?auto=format&fit=crop&q=80&w=500'],
    tags: ['cookie', 'crunchy', 'almonds', 'anise'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 11,
    name: 'Ghriba',
    arabicName: 'غريبة',
    price: 32,
    category: 'SWEET',
    description: 'Melt-in-your-mouth Moroccan shortbread cookies with a signature cracked surface and a rich nutty flavor.',
    emoji: '🍘',
    quality: {
      ingredients: 'Toasted walnuts, pure butter, icing sugar, baking powder, vanilla',
      process: 'Rolled into balls and baked at high heat to achieve the classic cracked "snowy" top',
      handmade: 'Each cookie is gently pressed to create the perfect bite-sized treat',
      love: 'A timeless recipe perfected over generations'
    },
    reviews: [
      { author: 'Soukaina E.', rating: 5, text: 'They literally melt in the mouth. Extremely delicious!' }
    ],
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=500'],
    tags: ['cookie', 'walnut', 'soft'],
    available: true,
    preparation_time: 'Fresh daily'
  },
  {
    id: 12,
    name: 'Krachel',
    arabicName: 'قراشل',
    price: 15,
    category: 'SWEET',
    description: 'Sweet Moroccan milk rolls infused with anise seeds, sesame, and a hint of orange blossom water.',
    emoji: '🥯',
    quality: {
      ingredients: 'Flour, milk, butter, anise seeds, sesame seeds, orange blossom water',
      process: 'Slowly proofed for maximum fluffiness, brushed with egg wash and baked until golden brown',
      handmade: 'Kneaded extensively to develop a soft, pillowy crumb',
      love: 'The smell of baking Krachel is the official scent of a Moroccan weekend morning'
    },
    reviews: [
      { author: 'Yassine J.', rating: 5, text: 'I wake up early just to eat these warm with butter. Highly recommend.' }
    ],
    images: ['https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&q=80&w=500'],
    tags: ['bread', 'sweet', 'anise'],
    available: true,
    preparation_time: 'Fresh daily'
  }
];
