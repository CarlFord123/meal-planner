import React, { useState, useMemo } from 'react';
import { Sparkles, ShoppingBasket, Shuffle, ChevronDown, ChevronUp, Check, X, Download, Flame, Beef, Wheat, Droplet, Dumbbell, Moon, Calendar } from 'lucide-react';

// ============================================================
// MEAL DATABASE (from Fit with Jade plans — 1 serving each)
// ============================================================

const MEALS = {
  preworkout: [
    { name: "Banana wrap", cal: 353, c: 63, f: 6, p: 7, ing: [
      { item: "Banana", qty: 1, unit: "" },
      { item: "Mission original white wrap 70g", qty: 1, unit: "" },
      { item: "Honey", qty: 15, unit: "g" },
    ]},
    { name: "PB&J Muffin", cal: 353, c: 65, f: 7, p: 12, ing: [
      { item: "English muffin", qty: 2, unit: "" },
      { item: "Peanut butter", qty: 10, unit: "g" },
      { item: "Jam", qty: 20, unit: "g" },
    ]},
    { name: "Cocopops & banana", cal: 349, c: 76, f: 5, p: 5, ing: [
      { item: "Cocopops", qty: 55, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Almond milk unsweetened", qty: 200, unit: "ml" },
    ]},
    { name: "Crumpets & jam", cal: 353, c: 73, f: 2, p: 10, ing: [
      { item: "Circle crumpet", qty: 3, unit: "" },
      { item: "Jam", qty: 30, unit: "g" },
    ]},
  ],

  breakfast: [
    { name: "Overnight oats chia (apple walnut)", cal: 496, c: 46, f: 18, p: 39, ing: [
      { item: "Oats", qty: 30, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Chia seeds", qty: 15, unit: "g" },
      { item: "Pink lady apple", qty: 1, unit: "" },
      { item: "Walnuts", qty: 15, unit: "g" },
    ]},
    { name: "Overnight oats chia (banana PB)", cal: 491, c: 49, f: 16, p: 39, ing: [
      { item: "Oats", qty: 30, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Chia seeds", qty: 15, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Peanut butter", qty: 12, unit: "g" },
    ]},
    { name: "Brekky bagel (salmon cream cheese)", cal: 503, c: 52, f: 19, p: 28, ing: [
      { item: "Abe's bagel", qty: 1, unit: "" },
      { item: "Smoked salmon", qty: 80, unit: "g" },
      { item: "Light cream cheese", qty: 60, unit: "g" },
    ]},
    { name: "Brekky bagel (cheesy bacon & egg)", cal: 511, c: 52, f: 19, p: 31, ing: [
      { item: "Abe's bagel", qty: 1, unit: "" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Short cut bacon", qty: 100, unit: "g" },
      { item: "Egg", qty: 1, unit: "" },
      { item: "Sugar reduced bbq sauce", qty: 10, unit: "g" },
    ]},
    { name: "Brekky bagel (avo cottage cheese + chicken)", cal: 508, c: 52, f: 19, p: 36, ing: [
      { item: "Abe's bagel", qty: 1, unit: "" },
      { item: "Light cottage cheese", qty: 50, unit: "g" },
      { item: "Avocado", qty: 50, unit: "g" },
      { item: "Chicken breast (cooked)", qty: 100, unit: "g" },
    ]},
    { name: "Fudgy pumpkin brownie", cal: 514, c: 65, f: 17, p: 31, ing: [
      { item: "Butternut pumpkin (raw)", qty: 200, unit: "g" },
      { item: "Egg", qty: 0.5, unit: "" },
      { item: "Coco powder", qty: 5, unit: "g" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Sugar free maple syrup", qty: 10, unit: "g" },
      { item: "Almond butter", qty: 15, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Chobani light", qty: 50, unit: "g" },
    ]},
    { name: "Apple muffin", cal: 511, c: 65, f: 17, p: 31, ing: [
      { item: "Rolled oats", qty: 40, unit: "g" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
      { item: "Granny smith apple", qty: 1, unit: "" },
      { item: "Almond butter", qty: 10, unit: "g" },
      { item: "Chobani light", qty: 50, unit: "g" },
      { item: "Walnuts", qty: 10, unit: "g" },
    ]},
    { name: "Yoghurt bowl (choc banana)", cal: 508, c: 66, f: 13, p: 36, ing: [
      { item: "Chobani light", qty: 200, unit: "g" },
      { item: "Macro Mike almond protein", qty: 20, unit: "g" },
      { item: "Rice bubbles", qty: 25, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Mayver's hazelnut cashew cacao spread", qty: 20, unit: "g" },
    ]},
    { name: "Chia pudding (banana PB honey)", cal: 504, c: 49, f: 19, p: 35, ing: [
      { item: "Chia seeds", qty: 20, unit: "g" },
      { item: "Almond milk unsweetened", qty: 150, unit: "ml" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Peanut butter", qty: 20, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
    ]},
    { name: "Protein oats (choc berry)", cal: 507, c: 66, f: 17, p: 31, ing: [
      { item: "Oats quick", qty: 55, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Strawberries", qty: 100, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
    ]},
    { name: "Protein oats (carrot cake)", cal: 507, c: 62, f: 16, p: 33, ing: [
      { item: "Oats quick", qty: 50, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Carrot (grated)", qty: 1, unit: "" },
      { item: "Walnuts", qty: 15, unit: "g" },
      { item: "Honey", qty: 15, unit: "g" },
      { item: "Sugar free caramel syrup", qty: 10, unit: "g" },
    ]},
    { name: "Pancake bowl bake", cal: 504, c: 58, f: 18, p: 31, ing: [
      { item: "Oat flour", qty: 40, unit: "g" },
      { item: "Egg", qty: 0.5, unit: "" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Almond milk unsweetened", qty: 50, unit: "ml" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Mixed berries", qty: 100, unit: "g" },
      { item: "Yopro yoghurt", qty: 50, unit: "g" },
    ]},
    { name: "Yopro yoghurt bowl (snickers)", cal: 497, c: 50, f: 11, p: 28, ing: [
      { item: "Yopro yoghurt", qty: 250, unit: "g" },
      { item: "Pitted dates", qty: 6, unit: "" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Peanuts (chopped)", qty: 15, unit: "g" },
      { item: "Natvia sugar free caramel sauce", qty: 5, unit: "g" },
    ]},
    { name: "Yoghurt bowl (milo)", cal: 516, c: 75, f: 11, p: 32, ing: [
      { item: "Yopro yoghurt", qty: 250, unit: "g" },
      { item: "Milo cereal", qty: 30, unit: "g" },
      { item: "Mixed berries", qty: 100, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Nut butter", qty: 20, unit: "g" },
    ]},
    { name: "Tropical smoothie", cal: 512, c: 85, f: 8, p: 26, ing: [
      { item: "Frozen pineapple", qty: 100, unit: "g" },
      { item: "Frozen mango", qty: 100, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Coconut water", qty: 150, unit: "ml" },
      { item: "Coconut yoghurt (Cocobella)", qty: 50, unit: "g" },
    ]},
    { name: "Date banana smoothie", cal: 504, c: 69, f: 13, p: 30, ing: [
      { item: "Banana (frozen)", qty: 1, unit: "" },
      { item: "Dates", qty: 6, unit: "" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Peanut butter", qty: 20, unit: "g" },
    ]},
    { name: "Protein cake (banana choc)", cal: 505, c: 68, f: 16, p: 30, ing: [
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Oat flour", qty: 30, unit: "g" },
      { item: "Baking powder", qty: 5, unit: "g" },
      { item: "Almond milk unsweetened", qty: 80, unit: "ml" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Chobani light", qty: 60, unit: "g" },
    ]},
    { name: "Rice flour protein cake (berry coconut)", cal: 513, c: 64, f: 17, p: 33, ing: [
      { item: "Rice flour", qty: 30, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Strawberries/raspberries", qty: 150, unit: "g" },
      { item: "Yopro yoghurt", qty: 80, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Coconut shredded", qty: 5, unit: "g" },
    ]},
    { name: "Rice flour cake (apple)", cal: 514, c: 73, f: 10, p: 33, ing: [
      { item: "Rice flour", qty: 50, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Granny smith apple", qty: 1, unit: "" },
      { item: "Walnuts (chopped)", qty: 10, unit: "g" },
      { item: "Yopro yoghurt", qty: 80, unit: "g" },
      { item: "Sugar free caramel syrup", qty: 5, unit: "g" },
    ]},
    { name: "Frittata bake/muffins", cal: 515, c: 28, f: 27, p: 44, ing: [
      { item: "Egg", qty: 2, unit: "" },
      { item: "Light tasty cheese", qty: 25, unit: "g" },
      { item: "Deli sliced ham", qty: 60, unit: "g" },
      { item: "Mushroom, tomato, onion, spinach", qty: 100, unit: "g" },
      { item: "Simpson's pantry low carb wrap 70g", qty: 1, unit: "" },
    ]},
    { name: "Salmon muffin", cal: 511, c: 54, f: 16, p: 36, ing: [
      { item: "English muffin", qty: 2, unit: "" },
      { item: "Smoked salmon", qty: 120, unit: "g" },
      { item: "Light cottage cheese", qty: 40, unit: "g" },
      { item: "Rocket, tomato, spring onion, chives", qty: 50, unit: "g" },
    ]},
    { name: "Shakshuka", cal: 514, c: 49, f: 22, p: 30, ing: [
      { item: "Egg", qty: 3, unit: "" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Red onion, capsicum, mushroom, zucchini", qty: 100, unit: "g" },
      { item: "Diced tomatoes", qty: 50, unit: "g" },
      { item: "Tomato paste", qty: 30, unit: "g" },
      { item: "Helga's wholemeal sourdough bread", qty: 2, unit: "slices" },
      { item: "Light danish feta", qty: 10, unit: "g" },
    ]},
    { name: "Mexican egg breakfast bake", cal: 508, c: 55, f: 12, p: 31, ing: [
      { item: "Egg", qty: 2, unit: "" },
      { item: "Light cottage cheese smooth", qty: 100, unit: "g" },
      { item: "Corn", qty: 40, unit: "g" },
      { item: "Black beans", qty: 40, unit: "g" },
      { item: "Tomato, mushroom, onion, spinach, capsicum", qty: 100, unit: "g" },
      { item: "Sweet potato (raw)", qty: 150, unit: "g" },
      { item: "Avocado", qty: 30, unit: "g" },
      { item: "Salsa", qty: 30, unit: "g" },
    ]},
  ],

  lunch: [
    { name: "Mexican bowl", cal: 505, c: 57, f: 12, p: 42, ing: [
      { item: "Chicken breast (raw)", qty: 130, unit: "g" },
      { item: "Basmati rice (uncooked)", qty: 40, unit: "g" },
      { item: "Avocado", qty: 50, unit: "g" },
      { item: "Salsa", qty: 30, unit: "g" },
      { item: "Corn", qty: 50, unit: "g" },
      { item: "Black beans", qty: 30, unit: "g" },
      { item: "Chobani light", qty: 50, unit: "g" },
      { item: "Cucumber, red onion, tomato, lettuce", qty: 100, unit: "g" },
    ]},
    { name: "Vietnamese salad bowl", cal: 507, c: 56, f: 14, p: 44, ing: [
      { item: "Vermicelli noodles (dry)", qty: 60, unit: "g" },
      { item: "Chicken breast (raw)", qty: 150, unit: "g" },
      { item: "Capsicum, carrot, spring onion, coriander, red cabbage, mint", qty: 100, unit: "g" },
      { item: "Peanut butter", qty: 20, unit: "g" },
      { item: "Soy sauce sodium reduced", qty: 10, unit: "g" },
    ]},
    { name: "Satay beef", cal: 505, c: 49, f: 16, p: 40, ing: [
      { item: "Basmati rice (uncooked)", qty: 45, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 125, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Onion, red capsicum, green beans", qty: 100, unit: "g" },
      { item: "Sodium reduced soy sauce", qty: 10, unit: "g" },
      { item: "Peanut butter", qty: 10, unit: "g" },
      { item: "Red curry paste", qty: 10, unit: "g" },
      { item: "Chobani light", qty: 60, unit: "g" },
    ]},
    { name: "Hot honey beef", cal: 502, c: 54, f: 15, p: 39, ing: [
      { item: "Sweet potato (raw)", qty: 150, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 125, unit: "g" },
      { item: "Red onion, capsicum, zucchini", qty: 100, unit: "g" },
      { item: "Spinach", qty: 100, unit: "g" },
      { item: "Tomato paste", qty: 20, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Avocado", qty: 40, unit: "g" },
      { item: "Chobani light", qty: 80, unit: "g" },
      { item: "Sriracha", qty: 10, unit: "g" },
      { item: "Honey", qty: 20, unit: "g" },
    ]},
    { name: "Mediterranean spicy beef", cal: 504, c: 63, f: 11, p: 32, ing: [
      { item: "Extra lean beef mince/steak strips", qty: 100, unit: "g" },
      { item: "Eggplant, zucchini, capsicum, mushroom, spinach", qty: 100, unit: "g" },
      { item: "Tomato paste", qty: 30, unit: "g" },
      { item: "Chickpeas", qty: 60, unit: "g" },
      { item: "Olive oil", qty: 5, unit: "g" },
      { item: "Basmati rice (uncooked)", qty: 50, unit: "g" },
      { item: "Tzaziki (Coles)", qty: 20, unit: "g" },
      { item: "Light danish feta", qty: 15, unit: "g" },
    ]},
    { name: "Hommus beef bowl", cal: 498, c: 54, f: 18, p: 29, ing: [
      { item: "Basmati rice (uncooked)", qty: 50, unit: "g" },
      { item: "Extra lean beef mince/steak strips", qty: 100, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Lettuce, tomato, cucumber", qty: 100, unit: "g" },
      { item: "Hommus (Coles)", qty: 50, unit: "g" },
    ]},
    { name: "Greek salad bowl", cal: 511, c: 64, f: 14, p: 41, ing: [
      { item: "Sweet potato (raw)", qty: 350, unit: "g" },
      { item: "Chicken breast (raw)", qty: 150, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Tomato, cucumber, red onion, lettuce", qty: 100, unit: "g" },
      { item: "Olive oil", qty: 10, unit: "g" },
      { item: "Light danish feta", qty: 20, unit: "g" },
      { item: "Olives", qty: 20, unit: "g" },
      { item: "Tzaziki (Coles)", qty: 30, unit: "g" },
    ]},
    { name: "Thai green curry", cal: 507, c: 52, f: 16, p: 40, ing: [
      { item: "Basmati rice (uncooked)", qty: 50, unit: "g" },
      { item: "Chicken breast (raw)", qty: 150, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Thai green curry paste", qty: 20, unit: "g" },
      { item: "Coconut cream light", qty: 40, unit: "g" },
      { item: "Capsicum, onion, broccoli, green beans", qty: 100, unit: "g" },
    ]},
    { name: "Teriyaki beef", cal: 509, c: 66, f: 10, p: 38, ing: [
      { item: "Basmati rice (uncooked)", qty: 60, unit: "g" },
      { item: "Extra lean stir fry beef strips", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 10, unit: "g" },
      { item: "Capsicum, onion, broccoli", qty: 100, unit: "g" },
      { item: "Teriyaki sauce", qty: 30, unit: "g" },
    ]},
    { name: "Sushi bowl", cal: 496, c: 62, f: 12, p: 31, ing: [
      { item: "Jasmine rice (cooked)", qty: 160, unit: "g" },
      { item: "Tuna lemon pepper (1 small can)", qty: 90, unit: "g" },
      { item: "Edamame beans", qty: 70, unit: "g" },
      { item: "Seaweed paper", qty: 5, unit: "g" },
      { item: "Fat free mayo", qty: 20, unit: "g" },
      { item: "Sodium reduced soy sauce", qty: 20, unit: "g" },
      { item: "Carrot, cucumber, spring onion", qty: 100, unit: "g" },
    ]},
    { name: "Thai beef salad", cal: 501, c: 46, f: 21, p: 33, ing: [
      { item: "Extra lean beef stir fry strips (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Carrot, cucumber, capsicum, red onion, lettuce", qty: 100, unit: "g" },
      { item: "Vermicelli noodles (dry)", qty: 30, unit: "g" },
      { item: "Peanut butter", qty: 15, unit: "g" },
      { item: "Thai curry paste", qty: 10, unit: "g" },
      { item: "Lime juice", qty: 20, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
      { item: "Sriracha", qty: 10, unit: "g" },
      { item: "Peanuts crushed", qty: 5, unit: "g" },
    ]},
    { name: "Creamy pasta salad", cal: 505, c: 57, f: 11, p: 35, ing: [
      { item: "Vetta protein penne (dry)", qty: 80, unit: "g" },
      { item: "Deli sliced ham", qty: 50, unit: "g" },
      { item: "Fat free mayo", qty: 50, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Red onion, capsicum, celery", qty: 100, unit: "g" },
    ]},
    { name: "Chicken & rice (BBQ pineapple)", cal: 507, c: 59, f: 11, p: 42, ing: [
      { item: "Basmati rice (uncooked)", qty: 55, unit: "g" },
      { item: "Chicken breast (raw)", qty: 100, unit: "g" },
      { item: "Sugar reduced bbq sauce", qty: 20, unit: "g" },
      { item: "Pineapple", qty: 50, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Capsicum, onion", qty: 100, unit: "g" },
    ]},
    { name: "Tandoori chicken", cal: 498, c: 57, f: 11, p: 41, ing: [
      { item: "Basmati rice (uncooked)", qty: 60, unit: "g" },
      { item: "Chicken breast (raw)", qty: 110, unit: "g" },
      { item: "Tandoori marinade (Patak's)", qty: 25, unit: "g" },
      { item: "Tzaziki (Coles)", qty: 20, unit: "g" },
      { item: "Peas, onion, capsicum", qty: 100, unit: "g" },
    ]},
    { name: "Tuna burger", cal: 500, c: 59, f: 13, p: 37, ing: [
      { item: "Egg", qty: 1, unit: "" },
      { item: "Spring water tuna (1 can)", qty: 70, unit: "g" },
      { item: "Parmesan", qty: 15, unit: "g" },
      { item: "Corn", qty: 50, unit: "g" },
      { item: "Celery, onion, carrot grated", qty: 100, unit: "g" },
      { item: "Bread crumbs", qty: 30, unit: "g" },
      { item: "Tip top burger thins", qty: 1, unit: "" },
      { item: "Fat free mayo", qty: 20, unit: "g" },
      { item: "Sriracha hot sauce", qty: 5, unit: "g" },
    ]},
    { name: "Zucchini bacon slice", cal: 501, c: 44, f: 20, p: 34, ing: [
      { item: "Egg", qty: 2, unit: "" },
      { item: "Short cut bacon", qty: 50, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Zucchini, carrot, onion grated", qty: 200, unit: "g" },
      { item: "Light cottage cheese smooth", qty: 50, unit: "g" },
      { item: "Flour", qty: 40, unit: "g" },
      { item: "Baking powder", qty: 5, unit: "g" },
    ]},
    { name: "Roast veg salad", cal: 503, c: 58, f: 15, p: 40, ing: [
      { item: "Butternut pumpkin (raw)", qty: 150, unit: "g" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Beetroot (raw)", qty: 100, unit: "g" },
      { item: "Zucchini, cherry tomato, cauliflower, red onion, spinach", qty: 200, unit: "g" },
      { item: "Chickpeas", qty: 70, unit: "g" },
      { item: "Hommus (Coles)", qty: 40, unit: "g" },
    ]},
    { name: "Broccoli beef buddha bowl", cal: 504, c: 56, f: 15, p: 40, ing: [
      { item: "Extra lean stir fry beef strips", qty: 120, unit: "g" },
      { item: "Sweet potato (raw)", qty: 250, unit: "g" },
      { item: "Coconut oil", qty: 5, unit: "g" },
      { item: "Broccoli, carrot", qty: 150, unit: "g" },
      { item: "Cashews", qty: 15, unit: "g" },
      { item: "Coconut aminos/soy sauce", qty: 15, unit: "g" },
    ]},
    { name: "Teriyaki poke bowl", cal: 502, c: 65, f: 9, p: 41, ing: [
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Basmati rice (uncooked)", qty: 40, unit: "g" },
      { item: "Edamame beans", qty: 70, unit: "g" },
      { item: "Carrot, cucumber", qty: 100, unit: "g" },
      { item: "Corn", qty: 50, unit: "g" },
      { item: "Teriyaki sauce", qty: 30, unit: "g" },
      { item: "Pickled ginger", qty: 10, unit: "g" },
    ]},
    { name: "Pesto pasta", cal: 504, c: 43, f: 16, p: 45, ing: [
      { item: "Vetta protein penne (dry)", qty: 70, unit: "g" },
      { item: "Chicken breast (raw)", qty: 100, unit: "g" },
      { item: "Leggo pesto sauce", qty: 40, unit: "g" },
      { item: "Light danish feta", qty: 20, unit: "g" },
      { item: "Zucchini, cherry tomato, onion", qty: 100, unit: "g" },
    ]},
    { name: "Sweet chilli prawn salad bowl", cal: 504, c: 61, f: 11, p: 40, ing: [
      { item: "Rice noodles (dry)", qty: 40, unit: "g" },
      { item: "Prawns (peeled, raw)", qty: 150, unit: "g" },
      { item: "Avocado", qty: 60, unit: "g" },
      { item: "Corn", qty: 60, unit: "g" },
      { item: "Mango", qty: 80, unit: "g" },
      { item: "Capsicum, cucumber, cherry tomato, spinach", qty: 100, unit: "g" },
      { item: "Fat free mayo", qty: 20, unit: "g" },
      { item: "Ayam light sweet chilli sauce", qty: 20, unit: "g" },
    ]},
    { name: "Beet feta walnut salad", cal: 510, c: 43, f: 22, p: 42, ing: [
      { item: "Chicken breast (raw)", qty: 140, unit: "g" },
      { item: "Walnuts (chopped)", qty: 20, unit: "g" },
      { item: "Beetroot", qty: 50, unit: "g" },
      { item: "Light danish feta", qty: 20, unit: "g" },
      { item: "Cucumber, tomato, red onion, rocket", qty: 100, unit: "g" },
      { item: "Cous cous wholemeal (dry)", qty: 30, unit: "g" },
      { item: "Dijon mustard", qty: 5, unit: "g" },
      { item: "Balsamic vinegar", qty: 5, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
    ]},
    { name: "Sweet sour pork bake bowl", cal: 501, c: 65, f: 8, p: 40, ing: [
      { item: "Basmati rice (uncooked)", qty: 60, unit: "g" },
      { item: "Chicken stock low sodium", qty: 120, unit: "ml" },
      { item: "Extra lean pork mince", qty: 150, unit: "g" },
      { item: "Tomato sauce sugar free", qty: 30, unit: "g" },
      { item: "Sodium reduced soy sauce", qty: 20, unit: "g" },
      { item: "Worcestershire sauce", qty: 20, unit: "g" },
      { item: "Onion, capsicum", qty: 100, unit: "g" },
      { item: "Pineapple", qty: 50, unit: "g" },
    ]},
    { name: "Creamy chicken & rice bake bowl", cal: 505, c: 38, f: 18, p: 42, ing: [
      { item: "Basmati rice (uncooked)", qty: 30, unit: "g" },
      { item: "Low sodium chicken stock", qty: 60, unit: "ml" },
      { item: "Chicken breast (raw)", qty: 130, unit: "g" },
      { item: "Light cooking cream", qty: 50, unit: "g" },
      { item: "Parmesan", qty: 20, unit: "g" },
      { item: "Onion, mushroom, zucchini", qty: 100, unit: "g" },
      { item: "Sundried tomatoes", qty: 20, unit: "g" },
    ]},
    { name: "Tzaziki chicken salad", cal: 500, c: 72, f: 6, p: 42, ing: [
      { item: "Basmati rice (uncooked)", qty: 60, unit: "g" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Lettuce, cucumber, red onion, capsicum", qty: 100, unit: "g" },
      { item: "Chobani light", qty: 100, unit: "g" },
      { item: "Grated cucumber", qty: 50, unit: "g" },
      { item: "Honey", qty: 15, unit: "g" },
    ]},
    { name: "Pesto chicken wrap", cal: 498, c: 40, f: 13, p: 41, ing: [
      { item: "Lebanese wrap", qty: 1, unit: "" },
      { item: "Leggo pesto sauce", qty: 30, unit: "g" },
      { item: "Chicken breast (cooked)", qty: 100, unit: "g" },
      { item: "Tomato, spinach", qty: 50, unit: "g" },
      { item: "Light danish feta", qty: 15, unit: "g" },
    ]},
    { name: "BBQ chicken wrap", cal: 498, c: 40, f: 13, p: 41, ing: [
      { item: "Lebanese wrap", qty: 1, unit: "" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Fat free mayo", qty: 15, unit: "g" },
      { item: "Sugar reduced bbq sauce", qty: 15, unit: "g" },
      { item: "Tomato, cucumber, red onion, spinach", qty: 100, unit: "g" },
    ]},
  ],

  dinner: [
    { name: "Burger bowl", cal: 414, c: 26, f: 14, p: 39, ing: [
      { item: "Spud light (raw)", qty: 180, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 150, unit: "g" },
      { item: "Olive oil spray (garlic)", qty: 5, unit: "g" },
      { item: "Pickles", qty: 10, unit: "g" },
      { item: "Light tasty cheese", qty: 10, unit: "g" },
      { item: "Fat free mayo", qty: 10, unit: "g" },
      { item: "Sugar reduced tomato sauce", qty: 10, unit: "g" },
      { item: "Dijon mustard", qty: 10, unit: "g" },
      { item: "Tomato, lettuce, onion", qty: 100, unit: "g" },
    ]},
    { name: "Bolognaise (spud or pasta)", cal: 411, c: 27, f: 14, p: 40, ing: [
      { item: "Spud light (raw)", qty: 200, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 150, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Diced tomatoes", qty: 50, unit: "g" },
      { item: "Tomato paste", qty: 20, unit: "g" },
      { item: "Light tasty cheese", qty: 10, unit: "g" },
      { item: "Onion, grated zucchini, carrot", qty: 100, unit: "g" },
    ]},
    { name: "Chili con carne bake", cal: 406, c: 32, f: 12, p: 40, ing: [
      { item: "Basmati rice (uncooked)", qty: 25, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 130, unit: "g" },
      { item: "Beef stock (low sodium)", qty: 50, unit: "ml" },
      { item: "Kidney beans", qty: 15, unit: "g" },
      { item: "Olive oil", qty: 5, unit: "g" },
      { item: "Brown onion, red capsicum, zucchini", qty: 100, unit: "g" },
      { item: "Diced tomatoes", qty: 100, unit: "g" },
      { item: "Light mozzarella", qty: 10, unit: "g" },
      { item: "Chobani light", qty: 50, unit: "g" },
    ]},
    { name: "Gyros bowl", cal: 400, c: 33, f: 10, p: 43, ing: [
      { item: "Spud light (raw)", qty: 280, unit: "g" },
      { item: "Chicken breast (raw)", qty: 160, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Tomato, cucumber, red onion, lettuce", qty: 100, unit: "g" },
      { item: "Greek/Italian salad dressing", qty: 15, unit: "g" },
      { item: "Light danish feta", qty: 15, unit: "g" },
      { item: "Ayam light sweet chilli sauce", qty: 20, unit: "g" },
    ]},
    { name: "Cajun chicken pasta", cal: 410, c: 30, f: 14, p: 38, ing: [
      { item: "Vetta protein penne", qty: 45, unit: "g" },
      { item: "Chicken breast (raw)", qty: 80, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Light cream cheese", qty: 40, unit: "g" },
      { item: "Low sodium chicken stock cube", qty: 1, unit: "" },
      { item: "Capsicum, onion, mushroom", qty: 100, unit: "g" },
    ]},
    { name: "Prawn pad thai", cal: 401, c: 29, f: 15, p: 38, ing: [
      { item: "Thick rice noodles (dry)", qty: 25, unit: "g" },
      { item: "Prawns (peeled, raw)", qty: 120, unit: "g" },
      { item: "Egg", qty: 1, unit: "" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Capsicum, onion, bean sprout", qty: 100, unit: "g" },
      { item: "Sodium reduced soy sauce", qty: 10, unit: "g" },
      { item: "Peanut butter", qty: 10, unit: "g" },
      { item: "Fish sauce", qty: 10, unit: "g" },
      { item: "Sriracha hot sauce", qty: 10, unit: "g" },
    ]},
    { name: "Hawaiian chicken burger", cal: 412, c: 40, f: 10, p: 39, ing: [
      { item: "Tip top burger thins", qty: 1, unit: "" },
      { item: "Chicken breast (raw)", qty: 100, unit: "g" },
      { item: "Sugar reduced bbq sauce", qty: 10, unit: "g" },
      { item: "Pineapple", qty: 30, unit: "g" },
      { item: "Light tasty cheese", qty: 10, unit: "g" },
      { item: "Onion, lettuce, tomato", qty: 100, unit: "g" },
      { item: "Spud light (raw)", qty: 150, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
    ]},
    { name: "Bang bang chicken bake", cal: 415, c: 49, f: 12, p: 40, ing: [
      { item: "Basmati rice (uncooked)", qty: 25, unit: "g" },
      { item: "Chicken breast (raw)", qty: 140, unit: "g" },
      { item: "Chicken stock (low sodium)", qty: 70, unit: "ml" },
      { item: "Sriracha", qty: 15, unit: "g" },
      { item: "Fat free mayo", qty: 20, unit: "g" },
      { item: "Chobani light", qty: 40, unit: "g" },
      { item: "Sweet chilli sauce", qty: 20, unit: "g" },
      { item: "Red onion, yellow capsicum, broccoli", qty: 100, unit: "g" },
      { item: "Avocado", qty: 40, unit: "g" },
    ]},
    { name: "Korean beef bake", cal: 416, c: 31, f: 15, p: 38, ing: [
      { item: "Basmati rice (uncooked)", qty: 25, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 155, unit: "g" },
      { item: "Beef stock (low sodium)", qty: 70, unit: "ml" },
      { item: "Stevia brown sugar", qty: 20, unit: "g" },
      { item: "Sodium reduced soy sauce", qty: 20, unit: "g" },
      { item: "Olive oil", qty: 5, unit: "g" },
      { item: "Brown onion, red capsicum, zucchini", qty: 100, unit: "g" },
      { item: "Sriracha", qty: 5, unit: "g" },
      { item: "Fat free mayo", qty: 10, unit: "g" },
      { item: "Sesame seeds", qty: 5, unit: "g" },
    ]},
    { name: "Lemon orzo chicken", cal: 408, c: 27, f: 17, p: 39, ing: [
      { item: "Risoni (dry)", qty: 30, unit: "g" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray garlic", qty: 5, unit: "g" },
      { item: "Chicken stock (low sodium)", qty: 80, unit: "ml" },
      { item: "Onion, grated zucchini", qty: 100, unit: "g" },
      { item: "Light cream cheese", qty: 30, unit: "g" },
      { item: "Nutelex lite", qty: 5, unit: "g" },
      { item: "Light danish feta", qty: 10, unit: "g" },
      { item: "Light mozzarella", qty: 10, unit: "g" },
    ]},
    { name: "Steak & spuds", cal: 410, c: 15, f: 13, p: 28, ing: [
      { item: "Spud light (raw)", qty: 120, unit: "g" },
      { item: "Eye fillet steak", qty: 200, unit: "g" },
      { item: "Olive oil spray", qty: 10, unit: "g" },
      { item: "Asparagus, mushroom, spinach", qty: 100, unit: "g" },
    ]},
    { name: "Honey lemon chicken bake", cal: 400, c: 31, f: 14, p: 39, ing: [
      { item: "Spud light (raw)", qty: 130, unit: "g" },
      { item: "Chicken breast (raw)", qty: 160, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Broccoli, carrot", qty: 100, unit: "g" },
      { item: "Lemon juice", qty: 40, unit: "g" },
      { item: "Honey", qty: 15, unit: "g" },
      { item: "Garlic olive oil", qty: 10, unit: "g" },
      { item: "Sriracha", qty: 5, unit: "g" },
    ]},
    { name: "Steak fajita bowl", cal: 411, c: 26, f: 17, p: 39, ing: [
      { item: "Basmati rice (uncooked)", qty: 20, unit: "g" },
      { item: "Extra lean stir fry beef strips", qty: 130, unit: "g" },
      { item: "Olive oil spray", qty: 20, unit: "g" },
      { item: "Corn", qty: 30, unit: "g" },
      { item: "Onion, capsicum (mixed)", qty: 100, unit: "g" },
    ]},
    { name: "Butter chicken soup", cal: 403, c: 38, f: 12, p: 38, ing: [
      { item: "Chicken breast (raw)", qty: 100, unit: "g" },
      { item: "Butternut pumpkin (raw)", qty: 100, unit: "g" },
      { item: "Diced tomatoes", qty: 50, unit: "g" },
      { item: "Low sodium chicken stock cube", qty: 0.5, unit: "" },
      { item: "Cauliflower", qty: 150, unit: "g" },
      { item: "Coconut cream light", qty: 20, unit: "g" },
      { item: "Onion, zucchini", qty: 100, unit: "g" },
      { item: "Wholemeal bread", qty: 1, unit: "slice" },
      { item: "Butter", qty: 5, unit: "g" },
    ]},
    { name: "Loaded spud", cal: 404, c: 34, f: 11, p: 34, ing: [
      { item: "Spud light (raw)", qty: 320, unit: "g" },
      { item: "Leg ham salt reduced", qty: 30, unit: "g" },
      { item: "Chicken breast (raw)", qty: 60, unit: "g" },
      { item: "Beetroot cooked", qty: 20, unit: "g" },
      { item: "Pineapple", qty: 20, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Light sour cream", qty: 20, unit: "g" },
    ]},
    { name: "Potato bake bowl", cal: 408, c: 21, f: 16, p: 36, ing: [
      { item: "Spud light (raw)", qty: 120, unit: "g" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Onion, mushroom", qty: 100, unit: "g" },
      { item: "Low sodium chicken stock", qty: 50, unit: "ml" },
      { item: "Light cooking cream", qty: 40, unit: "g" },
      { item: "Sundried tomatoes", qty: 10, unit: "g" },
      { item: "Light tasty cheese", qty: 15, unit: "g" },
    ]},
    { name: "Marry me chicken bake", cal: 403, c: 27, f: 12, p: 37, ing: [
      { item: "Macaroni (dry)", qty: 25, unit: "g" },
      { item: "Chicken breast (raw)", qty: 100, unit: "g" },
      { item: "Light cooking cream", qty: 40, unit: "g" },
      { item: "Low sodium chicken stock", qty: 100, unit: "ml" },
      { item: "Parmesan", qty: 5, unit: "g" },
      { item: "Onion, mushroom", qty: 100, unit: "g" },
      { item: "Sundried tomatoes", qty: 10, unit: "g" },
    ]},
    { name: "Mini pizza (English muffin)", cal: 407, c: 57, f: 9, p: 29, ing: [
      { item: "English muffin", qty: 2, unit: "" },
      { item: "Chicken breast (raw)", qty: 60, unit: "g" },
      { item: "Pizza sauce", qty: 20, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Sugar reduced bbq sauce", qty: 10, unit: "g" },
      { item: "Pineapple", qty: 10, unit: "g" },
      { item: "Capsicum, onion, tomato, mushroom", qty: 50, unit: "g" },
    ]},
    { name: "Nando's potato bake", cal: 400, c: 28, f: 15, p: 37, ing: [
      { item: "Spud light (raw)", qty: 190, unit: "g" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Onion, capsicum", qty: 100, unit: "g" },
      { item: "Nando's marinade", qty: 40, unit: "g" },
      { item: "Light cream cheese", qty: 40, unit: "g" },
      { item: "Light tasty cheese", qty: 10, unit: "g" },
    ]},
    { name: "Beef ragu pappardelle (slow cooker)", cal: 402, c: 34, f: 8, p: 34, ing: [
      { item: "Diced beef (Coles)", qty: 110, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Mushrooms, carrot, onion", qty: 100, unit: "g" },
      { item: "Red wine", qty: 50, unit: "ml" },
      { item: "Diced tomatoes", qty: 200, unit: "g" },
      { item: "Beef stock low sodium", qty: 150, unit: "ml" },
      { item: "Linguine/pappardelle (dry)", qty: 30, unit: "g" },
      { item: "Parmesan", qty: 5, unit: "g" },
    ]},
    { name: "Chicken stew (slow cooker)", cal: 404, c: 38, f: 10, p: 33, ing: [
      { item: "Chicken breast (raw)", qty: 110, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Carrot, onion, celery", qty: 100, unit: "g" },
      { item: "Spud light (raw)", qty: 180, unit: "g" },
      { item: "Chicken stock low sodium", qty: 200, unit: "ml" },
      { item: "Flour", qty: 15, unit: "g" },
      { item: "Peas", qty: 50, unit: "g" },
      { item: "Light cooking cream", qty: 20, unit: "g" },
    ]},
    { name: "Broccoli cheese soup", cal: 412, c: 30, f: 20, p: 37, ing: [
      { item: "Chicken breast (raw)", qty: 90, unit: "g" },
      { item: "Butter", qty: 5, unit: "g" },
      { item: "Onion", qty: 50, unit: "g" },
      { item: "Broccoli", qty: 150, unit: "g" },
      { item: "Carrot", qty: 100, unit: "g" },
      { item: "Spud lite", qty: 80, unit: "g" },
      { item: "Chicken stock low sodium", qty: 150, unit: "ml" },
      { item: "Light cooking cream", qty: 20, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
    ]},
    { name: "Mexi beef chilli", cal: 399, c: 46, f: 9, p: 33, ing: [
      { item: "Sweet potato (raw)", qty: 150, unit: "g" },
      { item: "Onion, capsicum, mushroom", qty: 100, unit: "g" },
      { item: "Extra lean beef mince (raw)", qty: 100, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Black beans", qty: 30, unit: "g" },
      { item: "Diced tomatoes", qty: 100, unit: "g" },
      { item: "Corn", qty: 30, unit: "g" },
      { item: "Chobani light", qty: 60, unit: "g" },
    ]},
    { name: "Cheeseburger smash wrap", cal: 415, c: 28, f: 17, p: 38, ing: [
      { item: "Simpson's pantry low carb wrap 70g", qty: 1, unit: "" },
      { item: "Extra lean beef mince (raw)", qty: 100, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Tomato, red onion, lettuce", qty: 50, unit: "g" },
      { item: "Pickles", qty: 10, unit: "g" },
      { item: "Light tasty cheese", qty: 10, unit: "g" },
      { item: "Fat free mayo", qty: 10, unit: "g" },
      { item: "Sugar reduced tomato sauce", qty: 10, unit: "g" },
      { item: "Dijon mustard", qty: 5, unit: "g" },
    ]},
    { name: "Beef stroganoff", cal: 412, c: 31, f: 14, p: 39, ing: [
      { item: "Pasta", qty: 25, unit: "g" },
      { item: "Extra lean stir fry beef strips", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Mushrooms, onion, zucchini", qty: 100, unit: "g" },
      { item: "Worcestershire sauce", qty: 20, unit: "g" },
      { item: "Dijon mustard", qty: 25, unit: "g" },
      { item: "Beef stock (low sodium)", qty: 150, unit: "ml" },
      { item: "Flour", qty: 5, unit: "g" },
      { item: "Light cooking cream", qty: 25, unit: "g" },
    ]},
    { name: "Chicken pumpkin curry (slow cooker)", cal: 408, c: 43, f: 12, p: 34, ing: [
      { item: "Chicken breast (raw)", qty: 100, unit: "g" },
      { item: "Carrot, onion, celery", qty: 100, unit: "g" },
      { item: "Butternut pumpkin (raw)", qty: 200, unit: "g" },
      { item: "Tomato paste", qty: 20, unit: "g" },
      { item: "Diced tomatoes", qty: 100, unit: "g" },
      { item: "Chicken stock low sodium", qty: 150, unit: "ml" },
      { item: "Red curry paste", qty: 10, unit: "g" },
      { item: "Chickpeas", qty: 70, unit: "g" },
      { item: "Coconut cream light", qty: 40, unit: "g" },
    ]},
    { name: "Mediterranean spicy chicken", cal: 404, c: 45, f: 9, p: 40, ing: [
      { item: "Chicken breast (raw)", qty: 130, unit: "g" },
      { item: "Eggplant, zucchini, capsicum, onion", qty: 100, unit: "g" },
      { item: "Tomato paste", qty: 50, unit: "g" },
      { item: "Chickpeas", qty: 40, unit: "g" },
      { item: "Olive oil", qty: 5, unit: "g" },
      { item: "Basmati rice (uncooked)", qty: 25, unit: "g" },
      { item: "Tzaziki (Coles)", qty: 30, unit: "g" },
    ]},
    { name: "Honey soy chicken", cal: 408, c: 55, f: 4, p: 41, ing: [
      { item: "Rice noodles (dry)", qty: 20, unit: "g" },
      { item: "Chicken breast mince (raw)", qty: 150, unit: "g" },
      { item: "Capsicum, zucchini, cabbage", qty: 100, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Peas", qty: 40, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
      { item: "Soy sauce sodium reduced", qty: 15, unit: "g" },
      { item: "Lemon juice", qty: 10, unit: "g" },
    ]},
    { name: "Naked parmi", cal: 410, c: 24, f: 12, p: 46, ing: [
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Pizza sauce", qty: 20, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Cauliflower, carrots, green beans", qty: 100, unit: "g" },
      { item: "Spud light (raw)", qty: 150, unit: "g" },
    ]},
    { name: "Prawn marinara", cal: 414, c: 45, f: 9, p: 39, ing: [
      { item: "Prawns (peeled, raw)", qty: 140, unit: "g" },
      { item: "Onion, capsicum, zucchini", qty: 100, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Passata", qty: 100, unit: "g" },
      { item: "Spaghetti (dry)", qty: 50, unit: "g" },
      { item: "Parmesan", qty: 10, unit: "g" },
    ]},
    { name: "Sweet chilli sticky chicken", cal: 399, c: 52, f: 7, p: 32, ing: [
      { item: "Basmati rice (uncooked)", qty: 30, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Chicken breast mince (raw)", qty: 120, unit: "g" },
      { item: "Capsicum, zucchini, carrot, cabbage", qty: 100, unit: "g" },
      { item: "Corn", qty: 40, unit: "g" },
      { item: "Pineapple", qty: 40, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
      { item: "Heinz sugar reduced ketchup", qty: 20, unit: "g" },
      { item: "Sriracha", qty: 5, unit: "g" },
    ]},
    { name: "Creamy pumpkin pasta", cal: 405, c: 48, f: 10, p: 30, ing: [
      { item: "Vetta protein penne (dry)", qty: 50, unit: "g" },
      { item: "Pumpkin (raw)", qty: 100, unit: "g" },
      { item: "Cannellini beans", qty: 50, unit: "g" },
      { item: "Coconut cream light", qty: 40, unit: "g" },
      { item: "Faba bean protein", qty: 15, unit: "g" },
      { item: "Cherry tomato, mushroom, onion, cabbage", qty: 100, unit: "g" },
    ]},
    { name: "Prawn fried rice", cal: 403, c: 40, f: 10, p: 42, ing: [
      { item: "Basmati rice (uncooked)", qty: 35, unit: "g" },
      { item: "Prawns (peeled, raw)", qty: 150, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Capsicum, onion, peas, broccoli", qty: 100, unit: "g" },
      { item: "Egg", qty: 0.5, unit: "" },
      { item: "Thai curry paste", qty: 15, unit: "g" },
      { item: "Sodium reduced soy sauce", qty: 10, unit: "g" },
      { item: "Fish sauce", qty: 10, unit: "g" },
      { item: "Sriracha hot sauce", qty: 10, unit: "g" },
    ]},
    { name: "Beef stew (slow cooker)", cal: 408, c: 36, f: 7, p: 41, ing: [
      { item: "Extra lean stir fry beef strips", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Carrot, onion, celery", qty: 100, unit: "g" },
      { item: "Tomato paste", qty: 20, unit: "g" },
      { item: "Spud light (raw)", qty: 150, unit: "g" },
      { item: "Beef stock low sodium", qty: 100, unit: "ml" },
      { item: "Diced tomatoes", qty: 50, unit: "g" },
      { item: "Peas", qty: 50, unit: "g" },
      { item: "Corn", qty: 50, unit: "g" },
    ]},
    { name: "Mexican potato bake", cal: 402, c: 25, f: 17, p: 36, ing: [
      { item: "Extra lean beef mince (raw)", qty: 125, unit: "g" },
      { item: "Salsa", qty: 50, unit: "g" },
      { item: "Onion, capsicum, zucchini", qty: 100, unit: "g" },
      { item: "Spud light (raw)", qty: 150, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Sour cream light", qty: 20, unit: "g" },
    ]},
    { name: "Lemon feta cous cous chicken", cal: 407, c: 33, f: 12, p: 44, ing: [
      { item: "Cous cous (dry)", qty: 40, unit: "g" },
      { item: "Chicken breast (raw)", qty: 120, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
      { item: "Cherry tomato, zucchini, red onion, spinach", qty: 100, unit: "g" },
      { item: "Lemon juice", qty: 20, unit: "g" },
      { item: "Danish feta", qty: 20, unit: "g" },
    ]},
  ],

  snack: [
    { name: "Bagel ham & cheese", cal: 347, c: 49, f: 9, p: 22, ing: [
      { item: "Abe's low carb bagel", qty: 1, unit: "" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Deli sliced ham", qty: 40, unit: "g" },
    ]},
    { name: "Bagel \"nutella\"", cal: 349, c: 56, f: 11, p: 17, ing: [
      { item: "Abe's low carb bagel", qty: 1, unit: "" },
      { item: "Mayver's protein choc PB", qty: 25, unit: "g" },
    ]},
    { name: "Bagel salmon cream cheese", cal: 340, c: 49, f: 10, p: 21, ing: [
      { item: "Abe's low carb bagel", qty: 1, unit: "" },
      { item: "Smoked salmon", qty: 50, unit: "g" },
      { item: "Light cream cheese", qty: 20, unit: "g" },
    ]},
    { name: "Wrap ham cheese", cal: 350, c: 23, f: 16, p: 30, ing: [
      { item: "Simpson's pantry low carb wrap 70g", qty: 1, unit: "" },
      { item: "Deli sliced ham", qty: 60, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Tomato, spinach", qty: 50, unit: "g" },
    ]},
    { name: "Wrap pesto chicken", cal: 350, c: 22, f: 17, p: 31, ing: [
      { item: "Simpson's pantry low carb wrap 70g", qty: 1, unit: "" },
      { item: "Leggo pesto sauce", qty: 30, unit: "g" },
      { item: "Chicken breast (cooked)", qty: 50, unit: "g" },
      { item: "Light danish feta", qty: 15, unit: "g" },
    ]},
    { name: "Yopro yoghurt bowl (choc berry)", cal: 351, c: 33, f: 13, p: 27, ing: [
      { item: "Yopro yoghurt", qty: 230, unit: "g" },
      { item: "Strawberries", qty: 100, unit: "g" },
      { item: "Mayver's hazelnut cashew cacao spread", qty: 25, unit: "g" },
    ]},
    { name: "Yopro yoghurt bowl (apple biscoff)", cal: 347, c: 51, f: 5, p: 25, ing: [
      { item: "Yopro yoghurt", qty: 230, unit: "g" },
      { item: "Biscoff biscuit", qty: 3, unit: "" },
      { item: "Apple pie fruit canned", qty: 150, unit: "g" },
      { item: "Sugar free caramel syrup", qty: 10, unit: "g" },
    ]},
    { name: "Yopro yoghurt bowl (snickers)", cal: 343, c: 33, f: 5, p: 27, ing: [
      { item: "Yopro yoghurt", qty: 230, unit: "g" },
      { item: "Dates", qty: 2, unit: "" },
      { item: "Dark chocolate Lindt/Coles square", qty: 1, unit: "" },
      { item: "Peanuts (chopped)", qty: 10, unit: "g" },
    ]},
    { name: "Cheese & crackers", cal: 349, c: 32, f: 18, p: 16, ing: [
      { item: "Jatz crackers", qty: 10, unit: "" },
      { item: "Light tasty cheese (2 slices)", qty: 40, unit: "g" },
      { item: "Cherry tomato", qty: 5, unit: "" },
    ]},
    { name: "Egg muffins", cal: 353, c: 12, f: 19, p: 34, ing: [
      { item: "Egg", qty: 2, unit: "" },
      { item: "Light cottage cheese", qty: 100, unit: "g" },
      { item: "Tomato, onion, spinach, mushroom, capsicum", qty: 100, unit: "g" },
      { item: "Deli sliced ham", qty: 50, unit: "g" },
      { item: "Olive oil spray", qty: 5, unit: "g" },
    ]},
    { name: "Protein banana muffins", cal: 345, c: 38, f: 10, p: 31, ing: [
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Banana (mashed)", qty: 1, unit: "" },
      { item: "Egg", qty: 1, unit: "" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Olive oil spray", qty: 3, unit: "g" },
    ]},
    { name: "Easy protein bar combo", cal: 353, c: 13, f: 13, p: 24, ing: [
      { item: "Noway collagen protein bar OR Fibre boost", qty: 1, unit: "" },
      { item: "Carmen's fruit & nut muesli bar", qty: 1, unit: "" },
    ]},
    { name: "Chickpea cookie dough", cal: 343, c: 38, f: 9, p: 28, ing: [
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Chickpeas", qty: 120, unit: "g" },
      { item: "Sugar free caramel syrup", qty: 10, unit: "g" },
      { item: "Dark chocolate square", qty: 1, unit: "" },
    ]},
    { name: "Apple oat muffin", cal: 343, c: 55, f: 5, p: 27, ing: [
      { item: "Rolled oats", qty: 25, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Apple pink lady", qty: 1, unit: "" },
      { item: "Honey", qty: 10, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
    ]},
    { name: "Pumpkin choc chia mousse", cal: 363, c: 35, f: 10, p: 28, ing: [
      { item: "Butternut pumpkin (raw)", qty: 200, unit: "g" },
      { item: "Coco powder", qty: 10, unit: "g" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Chia seeds", qty: 15, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 1, unit: "" },
    ]},
  ],

  funSnack: [
    { name: "Mini chocolate rice cakes", cal: 65, c: 12, f: 2, p: 1, ing: [{ item: "Table of plenty mini chocolate rice cakes", qty: 1, unit: "pack" }]},
    { name: "Biscoff biscuit (x2)", cal: 70, c: 11, f: 3, p: 1, ing: [{ item: "Biscoff biscuit", qty: 2, unit: "" }]},
    { name: "Kit Kat mini", cal: 73, c: 8, f: 3, p: 0, ing: [{ item: "Kit Kat mini fun size", qty: 1, unit: "" }]},
    { name: "Twirl mini", cal: 75, c: 8, f: 4, p: 1, ing: [{ item: "Twirl mini", qty: 1, unit: "" }]},
    { name: "Coles mini wafer", cal: 72, c: 9, f: 3, p: 0, ing: [{ item: "Coles mini wafer snack pack", qty: 1, unit: "pack" }]},
  ],
};

// ============================================================
// HELPERS
// ============================================================

const round = (n, dp = 0) => { const m = Math.pow(10, dp); return Math.round(n * m) / m; };
const fmtQty = (qty, unit) => {
  const q = qty < 10 ? round(qty, 1) : round(qty);
  return unit ? `${q}${unit === 'g' || unit === 'ml' ? unit : ' ' + unit}` : `${q}`;
};

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build plan optimising for BOTH calorie AND protein targets.
// Score = (cal_diff / cal_tolerance)² + (protein_diff / protein_tolerance)²
function buildPlan(targetCal, targetProtein, includePreworkout, seed) {
  const rng = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  const calTol = 75;       // cal_diff weighted 1:1 at 75 cal
  const proteinTol = 8;    // protein_diff weighted 1:1 at 8g

  let best = null;
  for (let attempt = 0; attempt < 800; attempt++) {
    const pre = includePreworkout ? pick(MEALS.preworkout) : null;
    const b = pick(MEALS.breakfast);
    const l = pick(MEALS.lunch);
    const d = pick(MEALS.dinner);
    const s = pick(MEALS.snack);
    const f = pick(MEALS.funSnack);

    const meals = [pre, b, l, d, s, f].filter(Boolean);
    const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);
    const totalP = meals.reduce((sum, m) => sum + m.p, 0);

    const calScore = Math.pow((totalCal - targetCal) / calTol, 2);
    const pScore = Math.pow((totalP - targetProtein) / proteinTol, 2);
    const score = calScore + pScore;

    if (!best || score < best.score) {
      best = {
        preworkout: pre,
        breakfast: b, lunch: l, dinner: d, snack: s, funSnack: f,
        totalCal, totalP, score,
      };
      if (score < 0.5) break;
    }
  }
  return best;
}

function planTotals(plan) {
  if (!plan) return { cal: 0, c: 0, f: 0, p: 0 };
  const slots = ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack'];
  return slots.reduce((acc, slot) => {
    const m = plan[slot];
    if (!m) return acc;
    return { cal: acc.cal + m.cal, c: acc.c + m.c, f: acc.f + m.f, p: acc.p + m.p };
  }, { cal: 0, c: 0, f: 0, p: 0 });
}

function buildShoppingList(trainingPlan, restPlan, trainingDays, restDays) {
  const combined = {};
  const perMeal = [];

  const addMeals = (plan, dayCount, dayLabel) => {
    if (!plan || dayCount === 0) return;
    ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack'].forEach(slot => {
      const meal = plan[slot];
      if (!meal) return;
      const scaled = meal.ing.map(i => ({ item: i.item, qty: i.qty * dayCount, unit: i.unit }));
      perMeal.push({ mealName: meal.name, slot, dayLabel, dayCount, ingredients: scaled });
      scaled.forEach(i => {
        const key = `${i.item}|${i.unit}`;
        if (!combined[key]) combined[key] = { item: i.item, qty: 0, unit: i.unit };
        combined[key].qty += i.qty;
      });
    });
  };

  addMeals(trainingPlan, trainingDays, 'Training');
  addMeals(restPlan, restDays, 'Rest');

  const combinedArr = Object.values(combined).sort((a, b) => a.item.localeCompare(b.item));
  return { combined: combinedArr, perMeal };
}

// ============================================================
// UI
// ============================================================

const SLOT_META = {
  preworkout: { label: "Pre-workout", icon: "⚡" },
  breakfast: { label: "Breakfast", icon: "🌅" },
  lunch: { label: "Lunch", icon: "🥗" },
  dinner: { label: "Dinner", icon: "🍽️" },
  snack: { label: "Snack", icon: "🥯" },
  funSnack: { label: "Fun snack", icon: "🍫" },
};

export default function App() {
  const [trainingCal, setTrainingCal] = useState(2541);
  const [trainingProtein, setTrainingProtein] = useState(179);
  const [restCal, setRestCal] = useState(2188);
  const [restProtein, setRestProtein] = useState(172);

  const [totalDays, setTotalDays] = useState(7);
  const [trainingDayCount, setTrainingDayCount] = useState(5);

  const [trainingSeed, setTrainingSeed] = useState(1);
  const [restSeed, setRestSeed] = useState(2);
  const [activeMode, setActiveMode] = useState('training');
  const [view, setView] = useState('combined');
  const [expanded, setExpanded] = useState({});
  const [swapping, setSwapping] = useState(null);
  const [trainingOverrides, setTrainingOverrides] = useState({});
  const [restOverrides, setRestOverrides] = useState({});

  const restDayCount = Math.max(0, totalDays - trainingDayCount);
  // Clamp training day count when total decreases
  if (trainingDayCount > totalDays) setTrainingDayCount(totalDays);

  const baseTraining = useMemo(
    () => buildPlan(trainingCal, trainingProtein, true, trainingSeed),
    [trainingCal, trainingProtein, trainingSeed]
  );
  const baseRest = useMemo(
    () => buildPlan(restCal, restProtein, false, restSeed),
    [restCal, restProtein, restSeed]
  );

  const trainingPlan = useMemo(() => baseTraining ? applyOverrides(baseTraining, trainingOverrides) : null, [baseTraining, trainingOverrides]);
  const restPlan = useMemo(() => baseRest ? applyOverrides(baseRest, restOverrides) : null, [baseRest, restOverrides]);

  const tTotals = planTotals(trainingPlan);
  const rTotals = planTotals(restPlan);
  const weekCal = tTotals.cal * trainingDayCount + rTotals.cal * restDayCount;
  const weekProtein = tTotals.p * trainingDayCount + rTotals.p * restDayCount;

  const { combined: shoppingCombined, perMeal: shoppingPerMeal } = useMemo(
    () => buildShoppingList(trainingPlan, restPlan, trainingDayCount, restDayCount),
    [trainingPlan, restPlan, trainingDayCount, restDayCount]
  );

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  const currentPlan = activeMode === 'training' ? trainingPlan : restPlan;
  const currentSlots = activeMode === 'training'
    ? ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack']
    : ['breakfast', 'lunch', 'dinner', 'snack', 'funSnack'];

  const swapMeal = (slot, mealName) => {
    if (activeMode === 'training') {
      setTrainingOverrides(o => ({ ...o, [slot]: mealName }));
    } else {
      setRestOverrides(o => ({ ...o, [slot]: mealName }));
    }
    setSwapping(null);
  };

  const shuffleAll = () => {
    setTrainingOverrides({});
    setRestOverrides({});
    setTrainingSeed(s => s + 1);
    setRestSeed(s => s + 1);
  };

  const shuffleCurrent = () => {
    if (activeMode === 'training') {
      setTrainingOverrides({});
      setTrainingSeed(s => s + 1);
    } else {
      setRestOverrides({});
      setRestSeed(s => s + 1);
    }
  };

  const exportList = () => {
    const lines = [];
    lines.push(`MEAL PLAN & SHOPPING LIST — ${totalDays} day${totalDays > 1 ? 's' : ''}`);
    lines.push(`Training days × ${trainingDayCount}: target ${trainingCal} cal / ${trainingProtein}g protein · actual ${tTotals.cal} cal / ${tTotals.p}g`);
    if (restDayCount > 0) lines.push(`Rest days × ${restDayCount}: target ${restCal} cal / ${restProtein}g protein · actual ${rTotals.cal} cal / ${rTotals.p}g`);
    lines.push(`Period totals: ${weekCal.toLocaleString()} cal · ${weekProtein}g protein`);
    lines.push('');
    if (trainingDayCount > 0 && trainingPlan) {
      lines.push(`TRAINING DAY MEALS (×${trainingDayCount}):`);
      ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack'].forEach(slot => {
        if (trainingPlan[slot]) lines.push(`  ${SLOT_META[slot].label}: ${trainingPlan[slot].name} (${trainingPlan[slot].cal} cal, ${trainingPlan[slot].p}g protein)`);
      });
      lines.push('');
    }
    if (restDayCount > 0 && restPlan) {
      lines.push(`REST DAY MEALS (×${restDayCount}):`);
      ['breakfast', 'lunch', 'dinner', 'snack', 'funSnack'].forEach(slot => {
        if (restPlan[slot]) lines.push(`  ${SLOT_META[slot].label}: ${restPlan[slot].name} (${restPlan[slot].cal} cal, ${restPlan[slot].p}g protein)`);
      });
      lines.push('');
    }
    lines.push('COMBINED SHOPPING LIST:');
    shoppingCombined.forEach(i => lines.push(`  ☐ ${i.item} — ${fmtQty(i.qty, i.unit)}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${totalDays}days.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      background: 'linear-gradient(135deg, #c7e9e2 0%, #f5e8e0 100%)',
      minHeight: '100vh',
      padding: '32px 16px',
      color: '#1a3a36',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Pacifico&display=swap');
        * { box-sizing: border-box; }
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: #d4e9e3;
          border-radius: 3px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px;
          background: #f4b8b8;
          border: 3px solid #fff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(26,58,54,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px; height: 22px;
          background: #f4b8b8;
          border: 3px solid #fff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(26,58,54,0.2);
        }
        .meal-card { transition: transform 0.2s, box-shadow 0.2s; }
        .meal-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,58,54,0.12); }
        .btn { transition: all 0.15s; cursor: pointer; }
        .btn:hover { transform: translateY(-1px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Pacifico', cursive", fontSize: 18, color: '#1a3a36', marginBottom: 4, opacity: 0.7 }}>Fit with Jade</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: '#1a3a36' }}>Weekly Meal Planner</h1>
          <p style={{ color: '#4a6864', margin: '8px 0 0', fontSize: 15 }}>Calories + protein targets · custom prep days · one shopping list</p>
        </div>

        {/* Days control */}
        <div style={{
          background: '#1a3a36',
          color: '#fff',
          borderRadius: 20,
          padding: '22px 26px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Calendar size={18} />
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Prep period</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total days</label>
                <span style={{ fontSize: 24, fontWeight: 700 }}>{totalDays}</span>
              </div>
              <input type="range" min="1" max="14" step="1" value={totalDays} onChange={(e) => setTotalDays(Number(e.target.value))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.6, marginTop: 4 }}>
                <span>1</span><span>7</span><span>14</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Of those — training days</label>
                <span style={{ fontSize: 24, fontWeight: 700 }}>{Math.min(trainingDayCount, totalDays)}<span style={{ fontSize: 14, opacity: 0.6, fontWeight: 500 }}> / {totalDays}</span></span>
              </div>
              <input type="range" min="0" max={totalDays} step="1" value={Math.min(trainingDayCount, totalDays)} onChange={(e) => setTrainingDayCount(Number(e.target.value))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                <span>🛌 {restDayCount} rest</span>
                <span>💪 {Math.min(trainingDayCount, totalDays)} training</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Period calories</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{weekCal.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Period protein</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{weekProtein}g</div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg / day</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{totalDays > 0 ? Math.round(weekCal / totalDays) : 0} cal · {totalDays > 0 ? Math.round(weekProtein / totalDays) : 0}g p</div>
            </div>
          </div>
        </div>

        {/* Calorie + protein controls */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '24px 28px', marginBottom: 20, boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 16 }}>
            <DayTypeControl
              icon={<Dumbbell size={16} />}
              label="Training days"
              accent="#f4b8b8"
              cal={trainingCal}
              setCal={(v) => { setTrainingCal(v); setTrainingOverrides({}); }}
              protein={trainingProtein}
              setProtein={(v) => { setTrainingProtein(v); setTrainingOverrides({}); }}
              defaultCal={2541}
              defaultProtein={179}
            />
            <DayTypeControl
              icon={<Moon size={16} />}
              label="Rest days"
              accent="#a8d5ba"
              cal={restCal}
              setCal={(v) => { setRestCal(v); setRestOverrides({}); }}
              protein={restProtein}
              setProtein={(v) => { setRestProtein(v); setRestOverrides({}); }}
              defaultCal={2188}
              defaultProtein={172}
            />
          </div>
          <button
            className="btn"
            onClick={shuffleAll}
            style={{
              width: '100%',
              background: '#1a3a36',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 18px',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
            }}
          ><Shuffle size={16} /> Shuffle all meals</button>
        </div>

        {/* Mode tabs (only show tabs that are active for this period) */}
        {(trainingDayCount > 0 || restDayCount > 0) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: '#fff', padding: 6, borderRadius: 14, boxShadow: '0 2px 10px rgba(26,58,54,0.06)' }}>
            {trainingDayCount > 0 && (
              <button
                onClick={() => { setActiveMode('training'); setSwapping(null); }}
                style={{
                  flex: 1,
                  background: activeMode === 'training' ? '#1a3a36' : 'transparent',
                  color: activeMode === 'training' ? '#fff' : '#1a3a36',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                }}
              ><Dumbbell size={14} /> Training meals × {trainingDayCount}</button>
            )}
            {restDayCount > 0 && (
              <button
                onClick={() => { setActiveMode('rest'); setSwapping(null); }}
                style={{
                  flex: 1,
                  background: activeMode === 'rest' ? '#1a3a36' : 'transparent',
                  color: activeMode === 'rest' ? '#fff' : '#1a3a36',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                }}
              ><Moon size={14} /> Rest meals × {restDayCount}</button>
            )}
          </div>
        )}

        {/* Auto-switch if active mode has 0 days */}
        {(() => {
          if (activeMode === 'training' && trainingDayCount === 0 && restDayCount > 0) setActiveMode('rest');
          if (activeMode === 'rest' && restDayCount === 0 && trainingDayCount > 0) setActiveMode('training');
          return null;
        })()}

        {/* Macro summary for active mode */}
        {currentPlan && (activeMode === 'training' ? trainingDayCount > 0 : restDayCount > 0) && (
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '18px 24px',
            marginBottom: 16,
            boxShadow: '0 4px 20px rgba(26,58,54,0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 16,
            alignItems: 'center',
          }}>
            <MacroStat
              icon={<Flame size={16} />}
              label="Calories"
              value={activeMode === 'training' ? tTotals.cal : rTotals.cal}
              target={activeMode === 'training' ? trainingCal : restCal}
              accent="#f4b8b8"
            />
            <MacroStat
              icon={<Beef size={16} />}
              label="Protein"
              value={`${activeMode === 'training' ? tTotals.p : rTotals.p}g`}
              target={`${activeMode === 'training' ? trainingProtein : restProtein}g`}
              accent="#c7a4d9"
            />
            <MacroStat icon={<Wheat size={16} />} label="Carbs" value={`${activeMode === 'training' ? tTotals.c : rTotals.c}g`} accent="#f0c987" />
            <MacroStat icon={<Droplet size={16} />} label="Fats" value={`${activeMode === 'training' ? tTotals.f : rTotals.f}g`} accent="#a8d5ba" />
          </div>
        )}

        {/* Meals grid */}
        {currentPlan && (activeMode === 'training' ? trainingDayCount > 0 : restDayCount > 0) && (
          <div style={{ marginBottom: 24 }}>
            <SectionHeader
              icon={<Sparkles size={18} />}
              title={`${activeMode === 'training' ? 'Training' : 'Rest'} day meals`}
              sub={`Tap any meal to swap it · used for ${activeMode === 'training' ? trainingDayCount : restDayCount} day${(activeMode === 'training' ? trainingDayCount : restDayCount) > 1 ? 's' : ''}`}
              right={
                <button
                  className="btn"
                  onClick={shuffleCurrent}
                  style={{
                    background: '#f5e8e0',
                    color: '#1a3a36',
                    border: 'none',
                    borderRadius: 10,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                ><Shuffle size={12} /> Shuffle these</button>
              }
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {currentSlots.map(slot => {
                const meal = currentPlan[slot];
                if (!meal) return null;
                const isSwapping = swapping === slot;
                const list = MEALS[slot];

                return (
                  <div key={slot} className="meal-card fade-in" style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: 18,
                    boxShadow: '0 2px 10px rgba(26,58,54,0.06)',
                    border: isSwapping ? '2px solid #f4b8b8' : '2px solid transparent',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7a9692' }}>
                          {SLOT_META[slot].icon} {SLOT_META[slot].label}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: '#1a3a36', lineHeight: 1.25 }}>{meal.name}</div>
                      </div>
                      <div style={{
                        background: '#f5e8e0',
                        color: '#1a3a36',
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        marginLeft: 8,
                      }}>{meal.cal} cal</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#4a6864', marginBottom: 10 }}>
                      <span style={{ fontWeight: 600 }}>P {meal.p}g</span>
                      <span>C {meal.c}g</span>
                      <span>F {meal.f}g</span>
                    </div>

                    {!isSwapping ? (
                      <button
                        className="btn"
                        onClick={() => setSwapping(slot)}
                        style={{
                          width: '100%',
                          background: '#f5e8e0',
                          border: 'none',
                          borderRadius: 10,
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1a3a36',
                          fontFamily: 'inherit',
                        }}
                      >Swap this meal</button>
                    ) : (
                      <div>
                        <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 8, borderTop: '1px solid #eef3f1', paddingTop: 8 }}>
                          {list.map(m => (
                            <button
                              key={m.name}
                              onClick={() => swapMeal(slot, m.name)}
                              style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                background: m.name === meal.name ? '#f5e8e0' : 'transparent',
                                border: 'none',
                                padding: '6px 8px',
                                fontSize: 12,
                                cursor: 'pointer',
                                borderRadius: 6,
                                color: '#1a3a36',
                                fontFamily: 'inherit',
                              }}
                            >
                              {m.name === meal.name && <Check size={11} style={{ display: 'inline', marginRight: 4 }} />}
                              <span style={{ fontWeight: 500 }}>{m.name}</span>
                              <span style={{ color: '#7a9692', marginLeft: 4 }}>· {m.cal} cal · {m.p}g p</span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setSwapping(null)}
                          style={{ background: 'none', border: '1px solid #d4e9e3', borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer', color: '#4a6864', fontFamily: 'inherit' }}
                        ><X size={11} style={{ display: 'inline', marginRight: 4 }} />Cancel</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shopping list */}
        {(trainingDayCount > 0 || restDayCount > 0) && (
          <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <SectionHeader
                icon={<ShoppingBasket size={18} />}
                title={`Shopping list — ${totalDays} day${totalDays > 1 ? 's' : ''}`}
                sub={`${trainingDayCount > 0 ? `Training × ${trainingDayCount}` : ''}${trainingDayCount > 0 && restDayCount > 0 ? ' + ' : ''}${restDayCount > 0 ? `Rest × ${restDayCount}` : ''}`}
                noMargin
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ display: 'flex', background: '#f5e8e0', borderRadius: 10, padding: 3 }}>
                  <button onClick={() => setView('combined')} style={tabBtn(view === 'combined')}>Combined</button>
                  <button onClick={() => setView('permeal')} style={tabBtn(view === 'permeal')}>Per meal</button>
                </div>
                <button
                  className="btn"
                  onClick={exportList}
                  style={{
                    background: '#1a3a36',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                ><Download size={13} />Export</button>
              </div>
            </div>

            {view === 'combined' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 6 }}>
                {shoppingCombined.map((i, idx) => (
                  <CheckItem key={idx} label={i.item} qty={fmtQty(i.qty, i.unit)} />
                ))}
              </div>
            ) : (
              <div>
                {['Training', 'Rest'].map(label => {
                  const items = shoppingPerMeal.filter(m => m.dayLabel === label);
                  if (!items.length) return null;
                  return (
                    <div key={label} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7a9692', marginBottom: 8 }}>
                        {label} days × {items[0].dayCount}
                      </div>
                      {items.map((m, idx) => (
                        <div key={idx} style={{ marginBottom: 8, border: '1px solid #eef3f1', borderRadius: 12, overflow: 'hidden' }}>
                          <button
                            onClick={() => toggle(`${label}-${m.mealName}`)}
                            style={{
                              width: '100%',
                              background: '#f9f5f1',
                              border: 'none',
                              padding: '10px 14px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: 13, color: '#1a3a36' }}>
                              <span style={{ marginRight: 6 }}>{SLOT_META[m.slot].icon}</span>
                              {m.mealName}
                              <span style={{ color: '#7a9692', fontWeight: 500, marginLeft: 8 }}>×{m.dayCount}</span>
                            </span>
                            {expanded[`${label}-${m.mealName}`] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          {expanded[`${label}-${m.mealName}`] && (
                            <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
                              {m.ingredients.map((i, ix) => (
                                <CheckItem key={ix} label={i.item} qty={fmtQty(i.qty, i.unit)} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 12, color: '#7a9692', marginTop: 24, lineHeight: 1.6 }}>
          From your Fit with Jade plans · {MEALS.preworkout.length} pre-workouts · {MEALS.breakfast.length} breakfasts · {MEALS.lunch.length} lunches · {MEALS.dinner.length} dinners · {MEALS.snack.length} snacks
        </div>

      </div>
    </div>
  );
}

function applyOverrides(plan, overrides) {
  const out = { ...plan };
  Object.entries(overrides).forEach(([slot, name]) => {
    const list = MEALS[slot];
    if (!list) return;
    const found = list.find(m => m.name === name);
    if (found) out[slot] = found;
  });
  return out;
}

function tabBtn(active) {
  return {
    background: active ? '#1a3a36' : 'transparent',
    color: active ? '#fff' : '#1a3a36',
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };
}

function DayTypeControl({ icon, label, accent, cal, setCal, protein, setProtein, defaultCal, defaultProtein }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #eef3f1' }}>
        <div style={{
          background: accent,
          width: 28,
          height: 28,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a3a36',
        }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a3a36' }}>{label}</h3>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flame size={12} style={{ color: '#7a9692' }} />
            <label style={{ fontSize: 11, fontWeight: 600, color: '#4a6864', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Calories</label>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1a3a36' }}>{cal}</span>
        </div>
        <input type="range" min="1500" max="3000" step="25" value={cal} onChange={(e) => setCal(Number(e.target.value))} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#7a9692', marginTop: 2 }}>
          <span>1500</span>
          <button onClick={() => setCal(defaultCal)} style={{ background: 'none', border: 'none', color: '#4a6864', fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>{defaultCal}</button>
          <span>3000</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Beef size={12} style={{ color: '#7a9692' }} />
            <label style={{ fontSize: 11, fontWeight: 600, color: '#4a6864', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Protein</label>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1a3a36' }}>{protein}g</span>
        </div>
        <input type="range" min="80" max="250" step="1" value={protein} onChange={(e) => setProtein(Number(e.target.value))} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#7a9692', marginTop: 2 }}>
          <span>80g</span>
          <button onClick={() => setProtein(defaultProtein)} style={{ background: 'none', border: 'none', color: '#4a6864', fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>{defaultProtein}g</button>
          <span>250g</span>
        </div>
      </div>
    </div>
  );
}

function MacroStat({ icon, label, value, target, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        background: accent,
        width: 34,
        height: 34,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1a3a36',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, color: '#7a9692', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1a3a36' }}>
          {value}
          {target && <span style={{ fontSize: 11, color: '#7a9692', fontWeight: 500 }}> / {target}</span>}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, sub, noMargin, right }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ color: '#1a3a36' }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a3a36' }}>{title}</h2>
        </div>
        {sub && <div style={{ fontSize: 13, color: '#7a9692', marginLeft: 26 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function CheckItem({ label, qty }) {
  const [checked, setChecked] = useState(false);
  return (
    <button
      onClick={() => setChecked(c => !c)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'none',
        border: 'none',
        padding: '6px 8px',
        cursor: 'pointer',
        textAlign: 'left',
        borderRadius: 8,
        fontFamily: 'inherit',
        width: '100%',
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        border: '2px solid ' + (checked ? '#1a3a36' : '#cfdedb'),
        background: checked ? '#1a3a36' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}>
        {checked && <Check size={12} color="#fff" />}
      </div>
      <div style={{ flex: 1, fontSize: 13, color: checked ? '#a8b8b5' : '#1a3a36', textDecoration: checked ? 'line-through' : 'none' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: '#7a9692', fontWeight: 600, marginLeft: 8 }}>{qty}</span>
      </div>
    </button>
  );
}
