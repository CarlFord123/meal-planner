import React, { useState, useMemo, useRef } from 'react';
import { Sparkles, ShoppingBasket, Shuffle, ChevronDown, ChevronUp, Check, X, Download, Flame, Beef, Wheat, Droplet, Dumbbell, Moon, Calendar, Plus, Trash2, BookOpen, BarChart2, ChevronRight, Target, UtensilsCrossed, ClipboardList } from 'lucide-react';

const MEALS = {
  preworkout: [
    { name: "Banana wrap", cal: 353, c: 63, f: 6, p: 7, ing: [
      { item: "Banana", qty: 1, unit: "" },
      { item: "Mission original white wrap 70g", qty: 1, unit: "" },
      { item: "Honey", qty: 15, unit: "g" }
    ], method: "Lay wrap flat. Peel and place banana at one end. Drizzle honey over banana. Roll wrap tightly around banana and slice in half." },
    { name: "PB&J Muffin", cal: 353, c: 65, f: 7, p: 12, ing: [
      { item: "English muffin", qty: 2, unit: "" },
      { item: "Peanut butter", qty: 10, unit: "g" },
      { item: "Jam", qty: 20, unit: "g" }
    ], method: "Toast English muffins until golden. Spread peanut butter on one half and jam on the other. Press together and enjoy." },
    { name: "Cocopops & banana", cal: 349, c: 76, f: 5, p: 5, ing: [
      { item: "Cocopops", qty: 55, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Almond milk unsweetened", qty: 200, unit: "ml" }
    ], method: "Pour Cocopops into a bowl. Add almond milk. Slice banana on top and eat immediately so cereal stays crunchy." },
    { name: "Crumpets & jam", cal: 353, c: 73, f: 2, p: 10, ing: [
      { item: "Circle crumpet", qty: 3, unit: "" },
      { item: "Jam", qty: 30, unit: "g" }
    ], method: "Toast crumpets until golden and crispy. Spread jam generously over each one while still warm." },
  ],
  breakfast: [
    { name: "Overnight oats chia (apple walnut)", cal: 496, c: 46, f: 18, p: 39, ing: [
      { item: "Oats", qty: 30, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Chia seeds", qty: 15, unit: "g" },
      { item: "Pink lady apple", qty: 1, unit: "" },
      { item: "Walnuts", qty: 15, unit: "g" }
    ], method: "Mix oats, protein powder and chia seeds in a jar. Pour in enough almond milk to cover well. Stir, seal and refrigerate overnight. In the morning top with diced apple and roughly chopped walnuts." },
    { name: "Overnight oats chia (banana PB)", cal: 491, c: 49, f: 16, p: 39, ing: [
      { item: "Oats", qty: 30, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Chia seeds", qty: 15, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Peanut butter", qty: 12, unit: "g" }
    ], method: "Mix oats, protein powder and chia seeds in a jar. Add almond milk to cover. Stir and refrigerate overnight. Top with sliced banana and a dollop of peanut butter before eating." },
    { name: "Brekky bagel (salmon cream cheese)", cal: 503, c: 52, f: 19, p: 28, ing: [
      { item: "Abe's bagel", qty: 1, unit: "" },
      { item: "Smoked salmon", qty: 80, unit: "g" },
      { item: "Light cream cheese", qty: 60, unit: "g" }
    ], method: "Slice and toast bagel. Spread cream cheese generously on both halves. Layer smoked salmon on top. Season with black pepper if desired." },
    { name: "Brekky bagel (cheesy bacon & egg)", cal: 511, c: 52, f: 19, p: 31, ing: [
      { item: "Abe's bagel", qty: 1, unit: "" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Short cut bacon", qty: 100, unit: "g" },
      { item: "Egg", qty: 1, unit: "" },
      { item: "Sugar reduced bbq sauce", qty: 10, unit: "g" }
    ], method: "Cook bacon in a pan over medium heat until crispy. Fry or scramble egg in the same pan. Toast bagel. Layer cheese, bacon and egg on the base, drizzle with BBQ sauce and top with the other half." },
    { name: "Brekky bagel (avo cottage cheese + chicken)", cal: 508, c: 52, f: 19, p: 36, ing: [
      { item: "Abe's bagel", qty: 1, unit: "" },
      { item: "Light cottage cheese", qty: 50, unit: "g" },
      { item: "Avocado", qty: 50, unit: "g" },
      { item: "Chicken breast (cooked)", qty: 100, unit: "g" }
    ], method: "Toast bagel. Mash avocado with a pinch of salt. Spread cottage cheese on base, then avocado. Top with sliced cooked chicken breast and close bagel." },
    { name: "Fudgy pumpkin brownie", cal: 514, c: 65, f: 17, p: 31, ing: [
      { item: "Butternut pumpkin (raw)", qty: 200, unit: "g" },
      { item: "Egg", qty: 0.5, unit: "" },
      { item: "Coco powder", qty: 5, unit: "g" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Sugar free maple syrup", qty: 10, unit: "g" },
      { item: "Almond butter", qty: 15, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Chobani light", qty: 50, unit: "g" }
    ], method: "Preheat oven to 180°C. Steam or microwave pumpkin until soft, then mash well. Mix in egg, protein powder, cacao powder, baking powder, maple syrup and almond butter until smooth. Pour into a greased small baking dish. Press chocolate squares into the top. Bake 20–25 mins until just set. Serve with Chobani on the side." },
    { name: "Apple muffin", cal: 511, c: 65, f: 17, p: 31, ing: [
      { item: "Rolled oats", qty: 40, unit: "g" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" },
      { item: "Granny smith apple", qty: 1, unit: "" },
      { item: "Almond butter", qty: 10, unit: "g" },
      { item: "Chobani light", qty: 50, unit: "g" },
      { item: "Walnuts", qty: 10, unit: "g" }
    ], method: "Preheat oven to 175°C. Mix oats, protein powder and baking powder. Stir in honey, almond butter, Chobani and grated apple. Fold in walnuts. Spoon into muffin tins and bake 18–22 mins until golden." },
    { name: "Yoghurt bowl (choc banana)", cal: 508, c: 66, f: 13, p: 36, ing: [
      { item: "Chobani light", qty: 200, unit: "g" },
      { item: "Macro Mike almond protein", qty: 20, unit: "g" },
      { item: "Rice bubbles", qty: 25, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Mayver's hazelnut cashew cacao spread", qty: 20, unit: "g" }
    ], method: "Add Chobani to a bowl. Stir through protein powder until smooth. Top with rice bubbles, sliced banana and a drizzle of hazelnut cacao spread." },
    { name: "Chia pudding (banana PB honey)", cal: 504, c: 49, f: 19, p: 35, ing: [
      { item: "Chia seeds", qty: 20, unit: "g" },
      { item: "Almond milk unsweetened", qty: 150, unit: "ml" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Peanut butter", qty: 20, unit: "g" },
      { item: "Honey", qty: 10, unit: "g" }
    ], method: "Mix chia seeds and almond milk in a jar. Stir well and refrigerate overnight (or at least 2 hours). Before eating, stir through protein powder. Top with sliced banana, peanut butter and drizzle of honey." },
    { name: "Protein oats (choc berry)", cal: 507, c: 66, f: 17, p: 31, ing: [
      { item: "Oats quick", qty: 55, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Strawberries", qty: 100, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" }
    ], method: "Cook quick oats with water or milk on stovetop or microwave. Stir in protein powder while hot. Top with sliced strawberries and chopped dark chocolate squares." },
    { name: "Protein oats (carrot cake)", cal: 507, c: 62, f: 16, p: 33, ing: [
      { item: "Oats quick", qty: 50, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Carrot (grated)", qty: 1, unit: "" },
      { item: "Walnuts", qty: 15, unit: "g" },
      { item: "Honey", qty: 15, unit: "g" },
      { item: "Sugar free caramel syrup", qty: 10, unit: "g" }
    ], method: "Cook quick oats. Stir in protein powder, grated carrot, honey and caramel syrup while hot. Top with chopped walnuts." },
    { name: "Pancake bowl bake", cal: 504, c: 58, f: 18, p: 31, ing: [
      { item: "Oat flour", qty: 40, unit: "g" },
      { item: "Egg", qty: 0.5, unit: "" },
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Almond milk unsweetened", qty: 50, unit: "ml" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Mixed berries", qty: 100, unit: "g" },
      { item: "Yopro yoghurt", qty: 50, unit: "g" }
    ], method: "Preheat oven to 180°C. Mix oat flour, protein powder, baking powder, egg and almond milk into a thick batter. Pour into a greased ramekin or small baking dish. Press chocolate squares into the top and scatter berries over. Bake 18–22 mins until cooked through. Serve with Yopro on the side." },
    { name: "Yopro yoghurt bowl (snickers)", cal: 497, c: 50, f: 11, p: 28, ing: [
      { item: "Yopro yoghurt", qty: 250, unit: "g" },
      { item: "Pitted dates", qty: 6, unit: "" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Peanuts (chopped)", qty: 15, unit: "g" },
      { item: "Natvia sugar free caramel sauce", qty: 5, unit: "g" }
    ], method: "Spoon Yopro into a bowl. Pit and roughly chop dates, then scatter over yoghurt. Chop chocolate squares and peanuts and add on top. Drizzle caramel sauce over everything." },
    { name: "Yoghurt bowl (milo)", cal: 516, c: 75, f: 11, p: 32, ing: [
      { item: "Yopro yoghurt", qty: 250, unit: "g" },
      { item: "Milo cereal", qty: 30, unit: "g" },
      { item: "Mixed berries", qty: 100, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Nut butter", qty: 20, unit: "g" }
    ], method: "Add Yopro to a bowl. Top with Milo cereal, mixed berries and sliced banana. Drizzle nut butter over the top." },
    { name: "Tropical smoothie", cal: 512, c: 85, f: 8, p: 26, ing: [
      { item: "Frozen pineapple", qty: 100, unit: "g" },
      { item: "Frozen mango", qty: 100, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Coconut water", qty: 150, unit: "ml" },
      { item: "Coconut yoghurt (Cocobella)", qty: 50, unit: "g" }
    ], method: "Add all ingredients to a blender. Blend on high until completely smooth. Pour and serve immediately." },
    { name: "Date banana smoothie", cal: 504, c: 69, f: 13, p: 30, ing: [
      { item: "Banana (frozen)", qty: 1, unit: "" },
      { item: "Dates", qty: 6, unit: "" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Peanut butter", qty: 20, unit: "g" }
    ], method: "Add all ingredients to a blender with a splash of water or almond milk. Blend until smooth and creamy. Add more liquid if too thick." },
    { name: "Protein cake (banana choc)", cal: 505, c: 68, f: 16, p: 30, ing: [
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Oat flour", qty: 30, unit: "g" },
      { item: "Baking powder", qty: 5, unit: "g" },
      { item: "Almond milk unsweetened", qty: 80, unit: "ml" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Chobani light", qty: 60, unit: "g" }
    ], method: "Mash banana well. Mix with protein powder, oat flour, baking powder and almond milk to form a thick batter. Pour into a greased mug or ramekin. Microwave 2–3 mins until cooked through (or bake at 175°C for 18 mins). Top with Chobani and chocolate squares." },
    { name: "Rice flour protein cake (berry coconut)", cal: 513, c: 64, f: 17, p: 33, ing: [
      { item: "Rice flour", qty: 30, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Strawberries/raspberries", qty: 150, unit: "g" },
      { item: "Yopro yoghurt", qty: 80, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 2, unit: "" },
      { item: "Coconut shredded", qty: 5, unit: "g" }
    ], method: "Preheat oven to 175°C. Mix rice flour, protein powder and baking powder. Stir in Yopro to form a batter. Fold in berries. Pour into a greased muffin tin or small dish. Top with chopped chocolate and shredded coconut. Bake 20 mins." },
    { name: "Rice flour cake (apple)", cal: 514, c: 73, f: 10, p: 33, ing: [
      { item: "Rice flour", qty: 50, unit: "g" },
      { item: "Macro Mike almond protein", qty: 40, unit: "g" },
      { item: "Baking powder", qty: 3, unit: "g" },
      { item: "Granny smith apple", qty: 1, unit: "" },
      { item: "Walnuts (chopped)", qty: 10, unit: "g" },
      { item: "Yopro yoghurt", qty: 80, unit: "g" },
      { item: "Sugar free caramel syrup", qty: 5, unit: "g" }
    ], method: "Preheat oven to 175°C. Mix rice flour, protein powder and baking powder. Stir in Yopro and caramel syrup. Fold in diced apple and walnuts. Bake in a greased tin for 20–22 mins until golden." },
    { name: "Frittata bake/muffins", cal: 515, c: 28, f: 27, p: 44, ing: [
      { item: "Egg", qty: 2, unit: "" },
      { item: "Short cut bacon", qty: 80, unit: "g" },
      { item: "Spinach", qty: 30, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Cherry tomatoes", qty: 50, unit: "g" }
    ], method: "Preheat oven to 180°C. Whisk eggs. Chop bacon and add to eggs with spinach, cheese and halved cherry tomatoes. Season well. Pour into greased muffin tin. Bake 18–20 mins until set and golden." },
  ],
  lunch: [
    { name: "Smash burger", cal: 648, c: 43, f: 28, p: 54, ing: [
      { item: "Extra lean beef mince", qty: 200, unit: "g" },
      { item: "Brioche bun", qty: 1, unit: "" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Lettuce", qty: 20, unit: "g" },
      { item: "Tomato", qty: 30, unit: "g" },
      { item: "Pickles", qty: 20, unit: "g" },
      { item: "Sugar reduced bbq sauce", qty: 15, unit: "g" }
    ], method: "Divide mince into two flat patties. Heat a pan or griddle to very high heat. Smash patties flat and cook 2–3 mins each side until well crusted. Add cheese to melt in last minute. Toast brioche bun. Assemble with lettuce, tomato, pickles and BBQ sauce." },
    { name: "Chicken caesar wrap", cal: 545, c: 36, f: 14, p: 63, ing: [
      { item: "Mission original white wrap 70g", qty: 1, unit: "" },
      { item: "Chicken breast (cooked)", qty: 200, unit: "g" },
      { item: "Cos lettuce", qty: 40, unit: "g" },
      { item: "Light caesar dressing", qty: 20, unit: "g" },
      { item: "Light tasty cheese", qty: 15, unit: "g" }
    ], method: "Slice cooked chicken. Lay wrap flat, spread caesar dressing over it. Add cos lettuce, chicken and cheese. Roll tightly, tucking in the sides as you go." },
    { name: "Rice paper rolls (chicken)", cal: 456, c: 52, f: 6, p: 46, ing: [
      { item: "Rice paper sheets", qty: 4, unit: "" },
      { item: "Chicken breast (cooked)", qty: 150, unit: "g" },
      { item: "Vermicelli noodles (cooked)", qty: 50, unit: "g" },
      { item: "Cucumber", qty: 50, unit: "g" },
      { item: "Carrot (julienned)", qty: 50, unit: "g" },
      { item: "Sweet chilli sauce", qty: 20, unit: "g" }
    ], method: "Dip rice paper sheets briefly in warm water until pliable. Lay flat and add noodles, sliced chicken, cucumber and carrot. Roll tightly, folding in the sides. Serve with sweet chilli sauce for dipping." },
    { name: "Tuna rice bowl", cal: 498, c: 62, f: 5, p: 50, ing: [
      { item: "Basmati rice (cooked)", qty: 150, unit: "g" },
      { item: "Tuna in springwater", qty: 185, unit: "g" },
      { item: "Cucumber", qty: 50, unit: "g" },
      { item: "Avocado", qty: 30, unit: "g" },
      { item: "Soy sauce", qty: 10, unit: "g" },
      { item: "Sesame seeds", qty: 5, unit: "g" }
    ], method: "Cook or reheat rice. Drain tuna. Add rice to a bowl, flake tuna over the top. Add diced cucumber and avocado. Drizzle with soy sauce and sprinkle sesame seeds." },
    { name: "Chicken & roast veg wrap", cal: 531, c: 38, f: 15, p: 58, ing: [
      { item: "Mission original white wrap 70g", qty: 1, unit: "" },
      { item: "Chicken breast (cooked)", qty: 180, unit: "g" },
      { item: "Mixed roast veg", qty: 100, unit: "g" },
      { item: "Light cream cheese", qty: 30, unit: "g" },
      { item: "Spinach", qty: 20, unit: "g" }
    ], method: "Preheat oven to 200°C. Toss mixed veg in a little oil and roast 20–25 mins. Warm wrap, spread cream cheese down the centre. Add sliced chicken, roast veg and spinach. Roll tightly." },
    { name: "Steak salad", cal: 487, c: 12, f: 18, p: 67, ing: [
      { item: "Lean beef steak", qty: 200, unit: "g" },
      { item: "Mixed salad leaves", qty: 80, unit: "g" },
      { item: "Cherry tomatoes", qty: 80, unit: "g" },
      { item: "Cucumber", qty: 60, unit: "g" },
      { item: "Balsamic dressing", qty: 15, unit: "g" }
    ], method: "Season steak well. Cook in a hot pan 3–4 mins each side for medium, or to your liking. Rest 3 mins then slice. Toss salad leaves, tomatoes and cucumber with balsamic dressing. Top with sliced steak." },
    { name: "Salmon sushi bowl", cal: 512, c: 58, f: 14, p: 40, ing: [
      { item: "Sushi rice (cooked)", qty: 150, unit: "g" },
      { item: "Smoked salmon", qty: 100, unit: "g" },
      { item: "Avocado", qty: 40, unit: "g" },
      { item: "Cucumber", qty: 50, unit: "g" },
      { item: "Soy sauce", qty: 10, unit: "g" },
      { item: "Sesame seeds", qty: 5, unit: "g" },
      { item: "Nori sheets", qty: 1, unit: "" }
    ], method: "Cook sushi rice and season with a little rice vinegar if desired. Add to a bowl. Top with smoked salmon, sliced avocado, cucumber and nori torn into pieces. Drizzle soy sauce and sprinkle sesame seeds." },
    { name: "Chicken souvlaki wrap", cal: 538, c: 42, f: 12, p: 62, ing: [
      { item: "Mission original white wrap 70g", qty: 1, unit: "" },
      { item: "Chicken breast (cooked)", qty: 200, unit: "g" },
      { item: "Tzatziki", qty: 40, unit: "g" },
      { item: "Tomato", qty: 40, unit: "g" },
      { item: "Cos lettuce", qty: 30, unit: "g" },
      { item: "Red onion", qty: 20, unit: "g" }
    ], method: "Warm the wrap. Spread tzatziki down the middle. Add sliced cooked chicken, tomato, cos lettuce and thinly sliced red onion. Roll firmly." },
  ],
  dinner: [
    { name: "Chicken & veg stir fry (noodles)", cal: 582, c: 52, f: 10, p: 68, ing: [
      { item: "Chicken breast", qty: 200, unit: "g" },
      { item: "Hokkien noodles", qty: 100, unit: "g" },
      { item: "Stir fry veg mix", qty: 150, unit: "g" },
      { item: "Soy sauce", qty: 15, unit: "g" },
      { item: "Oyster sauce", qty: 10, unit: "g" },
      { item: "Garlic (minced)", qty: 2, unit: "g" },
      { item: "Sesame oil", qty: 5, unit: "g" }
    ], method: "Cook hokkien noodles per packet. Slice chicken into strips and stir-fry in sesame oil with garlic over high heat 5–6 mins. Add stir fry veg and cook 3 more mins. Add noodles, soy sauce and oyster sauce, toss well and serve." },
    { name: "Beef mince tacos", cal: 601, c: 48, f: 22, p: 52, ing: [
      { item: "Extra lean beef mince", qty: 150, unit: "g" },
      { item: "Mini taco shells", qty: 3, unit: "" },
      { item: "Light sour cream", qty: 30, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Tomato salsa", qty: 40, unit: "g" },
      { item: "Cos lettuce", qty: 30, unit: "g" },
      { item: "Taco seasoning", qty: 5, unit: "g" }
    ], method: "Brown mince in a pan over medium-high heat, breaking it up as it cooks. Add taco seasoning and a splash of water, cook 2 more mins. Warm taco shells in oven. Fill with mince, salsa, cheese, lettuce and a dollop of sour cream." },
    { name: "Teriyaki salmon & rice", cal: 597, c: 60, f: 18, p: 48, ing: [
      { item: "Salmon fillet", qty: 150, unit: "g" },
      { item: "Basmati rice (cooked)", qty: 180, unit: "g" },
      { item: "Teriyaki sauce", qty: 20, unit: "g" },
      { item: "Broccoli", qty: 100, unit: "g" },
      { item: "Sesame seeds", qty: 5, unit: "g" }
    ], method: "Steam or microwave broccoli until tender. Cook salmon fillet in a pan over medium heat 3–4 mins each side. Brush with teriyaki sauce in the last minute. Serve over rice with broccoli, sprinkle with sesame seeds." },
    { name: "Chicken pesto pasta", cal: 614, c: 58, f: 16, p: 56, ing: [
      { item: "Chicken breast", qty: 180, unit: "g" },
      { item: "Pasta (dry)", qty: 80, unit: "g" },
      { item: "Pesto", qty: 20, unit: "g" },
      { item: "Cherry tomatoes", qty: 80, unit: "g" },
      { item: "Spinach", qty: 30, unit: "g" },
      { item: "Light tasty cheese", qty: 15, unit: "g" }
    ], method: "Cook pasta per packet. Dice chicken and cook in a pan until cooked through. Drain pasta and toss with pesto, chicken, halved cherry tomatoes and spinach. Top with grated cheese." },
    { name: "Beef bolognese", cal: 588, c: 54, f: 14, p: 58, ing: [
      { item: "Extra lean beef mince", qty: 150, unit: "g" },
      { item: "Pasta (dry)", qty: 80, unit: "g" },
      { item: "Tomato passata", qty: 150, unit: "g" },
      { item: "Onion", qty: 50, unit: "g" },
      { item: "Garlic (minced)", qty: 3, unit: "g" },
      { item: "Italian herbs", qty: 2, unit: "g" }
    ], method: "Dice onion and sauté in a pan until soft. Add garlic and mince, cook until browned. Add passata and Italian herbs. Simmer 15 mins. Cook pasta, drain and serve topped with bolognese sauce." },
    { name: "Greek chicken bake", cal: 561, c: 32, f: 16, p: 68, ing: [
      { item: "Chicken thigh (skinless)", qty: 250, unit: "g" },
      { item: "Cherry tomatoes", qty: 80, unit: "g" },
      { item: "Kalamata olives", qty: 20, unit: "g" },
      { item: "Feta cheese", qty: 30, unit: "g" },
      { item: "Lemon juice", qty: 15, unit: "g" },
      { item: "Baby potatoes", qty: 120, unit: "g" },
      { item: "Oregano", qty: 2, unit: "g" }
    ], method: "Preheat oven to 200°C. Halve baby potatoes and place in a baking dish with chicken thighs. Add cherry tomatoes and olives. Drizzle lemon juice over everything, sprinkle with oregano. Crumble feta on top. Bake 35–40 mins until chicken is cooked through." },
    { name: "Prawn fried rice", cal: 548, c: 62, f: 8, p: 54, ing: [
      { item: "Tiger prawns", qty: 200, unit: "g" },
      { item: "Basmati rice (cooked)", qty: 180, unit: "g" },
      { item: "Egg", qty: 1, unit: "" },
      { item: "Frozen peas & corn", qty: 80, unit: "g" },
      { item: "Soy sauce", qty: 15, unit: "g" },
      { item: "Sesame oil", qty: 5, unit: "g" },
      { item: "Spring onion", qty: 20, unit: "g" }
    ], method: "Cook rice and allow to cool. Heat sesame oil in a wok, add prawns and cook 2 mins. Push to the side, scramble the egg in the pan. Add rice, peas and corn, soy sauce and spring onion. Stir-fry everything together 3–4 mins." },
    { name: "Turkey meatball sub", cal: 579, c: 50, f: 14, p: 60, ing: [
      { item: "Turkey mince", qty: 200, unit: "g" },
      { item: "Sub roll", qty: 1, unit: "" },
      { item: "Tomato passata", qty: 80, unit: "g" },
      { item: "Light tasty cheese", qty: 20, unit: "g" },
      { item: "Italian herbs", qty: 2, unit: "g" },
      { item: "Egg", qty: 0.5, unit: "" }
    ], method: "Mix turkey mince with egg and Italian herbs, roll into small meatballs. Pan-fry in a little oil until browned all over, then simmer in passata 10 mins. Split and toast sub roll. Fill with meatballs and sauce, top with cheese and grill briefly to melt." },
  ],
  snack: [
    { name: "Protein shake + banana", cal: 253, c: 34, f: 4, p: 22, ing: [
      { item: "Macro Mike almond protein", qty: 30, unit: "g" },
      { item: "Banana", qty: 1, unit: "" },
      { item: "Almond milk unsweetened", qty: 200, unit: "ml" }
    ], method: "Add protein powder and almond milk to a shaker or blender. Shake or blend until smooth. Eat banana on the side." },
    { name: "Rice cakes + cottage cheese", cal: 198, c: 28, f: 2, p: 18, ing: [
      { item: "Rice cakes plain", qty: 4, unit: "" },
      { item: "Light cottage cheese", qty: 120, unit: "g" }
    ], method: "Spread cottage cheese evenly over each rice cake. Season with a little salt and pepper if desired." },
    { name: "Apple + PB", cal: 221, c: 30, f: 9, p: 5, ing: [
      { item: "Pink lady apple", qty: 1, unit: "" },
      { item: "Peanut butter", qty: 20, unit: "g" }
    ], method: "Slice apple into wedges. Serve with peanut butter for dipping." },
    { name: "Greek yoghurt + berries", cal: 185, c: 18, f: 3, p: 22, ing: [
      { item: "Chobani light", qty: 170, unit: "g" },
      { item: "Mixed berries", qty: 80, unit: "g" }
    ], method: "Spoon Chobani into a bowl. Top with mixed berries." },
    { name: "Boiled eggs + veggies", cal: 176, c: 5, f: 10, p: 16, ing: [
      { item: "Egg", qty: 2, unit: "" },
      { item: "Cucumber", qty: 80, unit: "g" },
      { item: "Cherry tomatoes", qty: 60, unit: "g" }
    ], method: "Place eggs in cold water, bring to a boil and cook 8–10 mins for hard boiled. Cool under cold water and peel. Serve with sliced cucumber and cherry tomatoes." },
    { name: "Tuna + crackers", cal: 214, c: 18, f: 4, p: 26, ing: [
      { item: "Tuna in springwater", qty: 95, unit: "g" },
      { item: "Vita-weat crackers", qty: 4, unit: "" }
    ], method: "Drain tuna. Serve on Vita-weat crackers." },
  ],
  funSnack: [
    { name: "Chobani flip", cal: 158, c: 20, f: 5, p: 10, ing: [{ item: "Chobani flip yoghurt", qty: 1, unit: "" },
      method: "Open the Chobani flip and mix the toppings into the yoghurt."]},
    { name: "Protein bar", cal: 200, c: 22, f: 7, p: 15, ing: [{ item: "Protein bar (eg. Quest/Aussie Bodies)", qty: 1, unit: "" },
      method: "Unwrap and eat."]},
    { name: "Rice cake PB choc", cal: 168, c: 22, f: 7, p: 5, ing: [
      { item: "Rice cakes plain", qty: 2, unit: "" },
      { item: "Peanut butter", qty: 15, unit: "g" },
      { item: "Dark chocolate Lindt/Coles square", qty: 1, unit: "" }
    ], method: "Spread peanut butter over rice cakes. Chop or break dark chocolate square and place on top." },
    { name: "Date ball (homemade)", cal: 142, c: 24, f: 4, p: 3, ing: [
      { item: "Pitted dates", qty: 3, unit: "" },
      { item: "Desiccated coconut", qty: 5, unit: "g" },
      { item: "Almond butter", qty: 8, unit: "g" }
    ], method: "Blend pitted dates and almond butter in a food processor until a sticky dough forms. Roll into balls and coat in desiccated coconut. Refrigerate 30 mins to firm up." },
    { name: "Kit Kat mini", cal: 73, c: 8, f: 3, p: 0, ing: [{ item: "Kit Kat mini fun size", qty: 1, unit: "" },
      method: "Enjoy as is."]},
    { name: "Twirl mini", cal: 75, c: 8, f: 4, p: 1, ing: [{ item: "Twirl mini", qty: 1, unit: "" },
      method: "Enjoy as is."]},
    { name: "Coles mini wafer", cal: 72, c: 9, f: 3, p: 0, ing: [{ item: "Coles mini wafer snack pack", qty: 1, unit: "pack" },
      method: "Enjoy as is."]},
  ],
};

// ============================================================
// INGREDIENT CATEGORY MAPPING
// ============================================================

const categorizeIngredient = (item) => {
  const l = item.toLowerCase();
  if (/frozen/.test(l)) return '🧊 Frozen';
  if (/almond milk|coconut water|coconut milk/.test(l)) return '🥛 Drinks & Milk';
  if (/egg|chobani|yopro|yoghurt|yogurt|cottage cheese|cream cheese|tasty cheese|feta|parmesan/.test(l)) return '🥚 Dairy & Eggs';
  if (/chicken|salmon|bacon|tuna|beef mince|steak|turkey|mince|prawn|smoked salmon|short cut|salmon fillet/.test(l)) return '🥩 Meat & Fish';
  if (/macro mike|protein powder|protein shake/.test(l)) return '💪 Protein Powder';
  if (/banana|apple|strawberr|berr|mango|pineapple|carrot|avocado|pumpkin|tomato|spinach|dates|pitted date|cucumber|lettuce|onion|spring onion|broccoli|veg|salad|cherry tom|capsicum|zucchini|potato|lemon/.test(l)) return '🥦 Fruit & Veg';
  if (/oat|bagel|wrap|crumpet|rice bubble|milo cereal|rice flour|oat flour|cocopop|flour|bread|pasta|noodle|rice cake|rice paper|sushi rice|basmati|hokkien|sub roll|brioche|taco shell|english muffin|vita-weat|cracker|vermicelli/.test(l)) return '🌾 Grains & Bread';
  if (/peanut butter|almond butter|nut butter|peanuts|almond|walnut|cashew|chia seed|coconut shredded|sesame seed|desiccated coconut|sunflower|pistachio/.test(l)) return '🥜 Nuts & Seeds';
  if (/honey|jam|sauce|syrup|spread|mayo|mustard|pesto|tzatziki|balsamic|dressing|bbq|soy sauce|oyster sauce|teriyaki|sweet chilli|salsa|taco season|passata|pickles|olive|caramel|natvia/.test(l)) return '🧴 Condiments & Sauces';
  if (/baking powder|coco powder|dark chocolate|lindt|coles square|italian herb|oregano|garlic|vanilla|salt|pepper|sesame oil|oil/.test(l)) return '🫙 Pantry & Baking';
  if (/kit kat|twirl|wafer|fun size|milo|rice bubbles|mayver/.test(l)) return '🍫 Snacks & Treats';
  return '📦 Other';
};

const CATEGORY_ORDER = [
  '🥩 Meat & Fish', '🥚 Dairy & Eggs', '🥦 Fruit & Veg', '🌾 Grains & Bread',
  '🥛 Drinks & Milk', '💪 Protein Powder', '🥜 Nuts & Seeds', '🧴 Condiments & Sauces',
  '🫙 Pantry & Baking', '🧊 Frozen', '🍫 Snacks & Treats', '📦 Other',
];

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

function buildPlan(targetCal, targetProtein, includePreworkout, seed, mealDb) {
  const rng = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const calTol = 75;
  const proteinTol = 8;
  let best = null;
  for (let attempt = 0; attempt < 800; attempt++) {
    const pre = includePreworkout ? pick(mealDb.preworkout) : null;
    const b = pick(mealDb.breakfast);
    const l = pick(mealDb.lunch);
    const d = pick(mealDb.dinner);
    const s = pick(mealDb.snack);
    const f = pick(mealDb.funSnack);
    const meals = [pre, b, l, d, s, f].filter(Boolean);
    const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);
    const totalP = meals.reduce((sum, m) => sum + m.p, 0);
    const calScore = Math.pow((totalCal - targetCal) / calTol, 2);
    const pScore = Math.pow((totalP - targetProtein) / proteinTol, 2);
    const score = calScore + pScore;
    if (!best || score < best.score) {
      best = { preworkout: pre, breakfast: b, lunch: l, dinner: d, snack: s, funSnack: f, totalCal, totalP, score };
      if (score < 0.5) break;
    }
  }
  return best;
}

// skippedDays: { dinner: 2 } = skip dinner on 2 of the days
function planTotals(plan, skippedDays = {}, dayCount = 1) {
  if (!plan) return { cal: 0, c: 0, f: 0, p: 0 };
  const slots = ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack'];
  return slots.reduce((acc, slot) => {
    const m = plan[slot];
    if (!m) return acc;
    const times = Math.max(0, dayCount - (skippedDays[slot] || 0));
    return { cal: acc.cal + m.cal * times, c: acc.c + m.c * times, f: acc.f + m.f * times, p: acc.p + m.p * times };
  }, { cal: 0, c: 0, f: 0, p: 0 });
}

function buildShoppingList(trainingPlan, restPlan, trainingDays, restDays, tSkippedDays, rSkippedDays) {
  const combined = {};
  const perMeal = [];
  const addMeals = (plan, dayCount, dayLabel, skippedDays) => {
    if (!plan || dayCount === 0) return;
    ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack'].forEach(slot => {
      const meal = plan[slot];
      if (!meal) return;
      const times = Math.max(0, dayCount - (skippedDays[slot] || 0));
      if (times === 0) return;
      const scaled = meal.ing.map(i => ({ item: i.item, qty: i.qty * times, unit: i.unit }));
      perMeal.push({ mealName: meal.name, slot, dayLabel, dayCount: times, ingredients: scaled });
      scaled.forEach(i => {
        const key = `${i.item}|${i.unit}`;
        if (!combined[key]) combined[key] = { item: i.item, qty: 0, unit: i.unit };
        combined[key].qty += i.qty;
      });
    });
  };
  addMeals(trainingPlan, trainingDays, 'Training', tSkippedDays);
  addMeals(restPlan, restDays, 'Rest', rSkippedDays);
  const combinedArr = Object.values(combined).sort((a, b) => a.item.localeCompare(b.item));
  return { combined: combinedArr, perMeal };
}

// ============================================================
// UI CONSTANTS
// ============================================================

const SLOT_META = {
  preworkout: { label: "Pre-workout", icon: "⚡" },
  breakfast: { label: "Breakfast", icon: "🌅" },
  lunch: { label: "Lunch", icon: "🥗" },
  dinner: { label: "Dinner", icon: "🍽️" },
  snack: { label: "Snack", icon: "🥯" },
  funSnack: { label: "Fun snack", icon: "🍫" },
};

const SECTION_LABELS = {
  preworkout: "Pre-workout", breakfast: "Breakfast", lunch: "Lunch",
  dinner: "Dinner", snack: "Snack", funSnack: "Fun Snack",
};

// ============================================================
// ADD RECIPE MODAL
// ============================================================

function AddRecipeModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [section, setSection] = useState('breakfast');
  const [cal, setCal] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [method, setMethod] = useState('');
  const [ings, setIngs] = useState([{ item: '', qty: '', unit: 'g' }]);
  const [error, setError] = useState('');

  const addIng = () => setIngs(i => [...i, { item: '', qty: '', unit: 'g' }]);
  const removeIng = (idx) => setIngs(i => i.filter((_, j) => j !== idx));
  const updateIng = (idx, field, val) => setIngs(i => i.map((ing, j) => j === idx ? { ...ing, [field]: val } : ing));

  const handleSave = () => {
    if (!name.trim()) return setError('Please enter a recipe name');
    if (!cal || !carbs || !fat || !protein) return setError('Please fill in all macro fields');
    const validIngs = ings.filter(i => i.item.trim());
    if (!validIngs.length) return setError('Add at least one ingredient');
    onSave({
      name: name.trim(),
      section,
      cal: parseInt(cal),
      c: parseInt(carbs),
      f: parseInt(fat),
      p: parseInt(protein),
      method: method.trim(),
      ing: validIngs.map(i => ({ item: i.item.trim(), qty: parseFloat(i.qty) || 1, unit: i.unit })),
      custom: true,
    });
    onClose();
  };

  const inp = (val, set, ph, type = 'text', small = false) => (
    <input
      type={type}
      placeholder={ph}
      value={val}
      onChange={e => set(e.target.value)}
      style={{
        width: '100%', border: '1.5px solid #d4e9e3', borderRadius: 8, padding: small ? '6px 10px' : '9px 12px',
        fontSize: 13, fontFamily: 'inherit', color: '#1a3a36', background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,58,54,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: 28, maxWidth: 520, width: '100%',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(26,58,54,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a3a36' }}>
            <BookOpen size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            Add Your Recipe
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a9692', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={labelStyle}>Recipe Name</label>
            {inp(name, setName, 'e.g. Choc peanut butter oats')}
          </div>
          <div>
            <label style={labelStyle}>Meal Section</label>
            <select value={section} onChange={e => setSection(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #d4e9e3', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', color: '#1a3a36', background: '#fff', outline: 'none' }}>
              {Object.entries(SECTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Macros (per serving)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[['Calories', cal, setCal], ['Carbs g', carbs, setCarbs], ['Fat g', fat, setFat], ['Protein g', protein, setProtein]].map(([ph, val, set]) => (
                <div key={ph}>
                  <div style={{ fontSize: 10, color: '#7a9692', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ph}</div>
                  {inp(val, set, '0', 'number', true)}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Ingredients</label>
            <div style={{ display: 'grid', gap: 6 }}>
              {ings.map((ing, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input placeholder="Item name" value={ing.item} onChange={e => updateIng(idx, 'item', e.target.value)}
                    style={{ flex: 2, border: '1.5px solid #d4e9e3', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontFamily: 'inherit', color: '#1a3a36', outline: 'none' }} />
                  <input type="number" placeholder="Qty" value={ing.qty} onChange={e => updateIng(idx, 'qty', e.target.value)}
                    style={{ flex: 1, border: '1.5px solid #d4e9e3', borderRadius: 8, padding: '6px 8px', fontSize: 12, fontFamily: 'inherit', color: '#1a3a36', outline: 'none' }} />
                  <select value={ing.unit} onChange={e => updateIng(idx, 'unit', e.target.value)}
                    style={{ flex: 1, border: '1.5px solid #d4e9e3', borderRadius: 8, padding: '6px 6px', fontSize: 12, fontFamily: 'inherit', color: '#1a3a36', background: '#fff', outline: 'none' }}>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="">each</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="cup">cup</option>
                  </select>
                  {ings.length > 1 && (
                    <button onClick={() => removeIng(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f4b8b8', padding: 4 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addIng} style={{ marginTop: 8, background: 'none', border: '1.5px dashed #d4e9e3', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#4a6864', fontFamily: 'inherit', width: '100%' }}>
              <Plus size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />Add ingredient
            </button>
          </div>
          <div>
            <label style={labelStyle}>Method / Instructions (optional)</label>
            <textarea value={method} onChange={e => setMethod(e.target.value)} placeholder="How to prepare this meal..." rows={3}
              style={{ width: '100%', border: '1.5px solid #d4e9e3', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', color: '#1a3a36', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ fontSize: 12, color: '#e07070', fontWeight: 500 }}>{error}</div>}
          <button onClick={handleSave} style={{
            background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700,
            fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Plus size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#4a6864', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };

// ============================================================
// DAILY MACRO TRACKER
// ============================================================

function DailyTracker({ trainingPlan, restPlan, tSkipped, rSkipped, trainingCal, trainingProtein, restCal, restProtein, customMeals }) {
  const [dayType, setDayType] = useState('training');
  const [logged, setLogged] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const target = { cal: dayType === 'training' ? trainingCal : restCal, p: dayType === 'training' ? trainingProtein : restProtein };
  const plan = dayType === 'training' ? trainingPlan : restPlan;
  const skipped = dayType === 'training' ? tSkipped : rSkipped;

  const totalLogged = logged.reduce((acc, m) => ({ cal: acc.cal + m.cal, p: acc.p + m.p, c: acc.c + m.c, f: acc.f + m.f }), { cal: 0, p: 0, c: 0, f: 0 });
  const calPct = Math.min(100, (totalLogged.cal / target.cal) * 100);
  const pPct = Math.min(100, (totalLogged.p / target.p) * 100);

  const addFromPlan = (meal) => {
    if (!meal) return;
    setLogged(l => [...l, { ...meal, logId: Date.now() + Math.random() }]);
    setShowPicker(false);
  };

  const allAvailable = [];
  if (plan) {
    ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack'].forEach(slot => {
      if (!skipped.includes(slot) && plan[slot]) {
        allAvailable.push({ ...plan[slot], slot });
      }
    });
  }
  const allMeals = Object.values(MEALS).flat().concat(customMeals);
  const uniqueOther = allMeals.filter(m => !allAvailable.find(a => a.name === m.name)).slice(0, 20);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Day type selector */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '18px 22px', boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {['training', 'rest'].map(t => (
            <button key={t} onClick={() => setDayType(t)} style={{
              flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: dayType === t ? '#1a3a36' : '#f5f0ec', color: dayType === t ? '#fff' : '#4a6864',
              fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
            }}>
              {t === 'training' ? '💪 Training Day' : '🛌 Rest Day'}
            </button>
          ))}
        </div>

        {/* Progress bars */}
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { label: 'Calories', val: totalLogged.cal, target: target.cal, pct: calPct, accent: '#f4b8b8', unit: '' },
            { label: 'Protein', val: totalLogged.p, target: target.p, pct: pPct, accent: '#c7a4d9', unit: 'g' },
          ].map(({ label, val, target: tgt, pct, accent, unit }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4a6864', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1a3a36' }}>
                  {val}{unit} <span style={{ fontSize: 11, color: '#7a9692', fontWeight: 500 }}>/ {tgt}{unit}</span>
                </span>
              </div>
              <div style={{ height: 10, background: '#eef3f1', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#4a9e7a' : accent, borderRadius: 5, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: 10, color: pct >= 100 ? '#4a9e7a' : '#7a9692', marginTop: 3, textAlign: 'right', fontWeight: 600 }}>
                {pct >= 100 ? '✓ Target reached!' : `${Math.round(tgt - val)}${unit} remaining`}
              </div>
            </div>
          ))}
        </div>

        {/* Mini macro row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #eef3f1' }}>
          {[['Carbs', totalLogged.c, '#f0c987'], ['Fat', totalLogged.f, '#b8d4f4'], ['Protein', totalLogged.p, '#c7a4d9']].map(([l, v, c]) => (
            <div key={l} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#7a9692', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3a36' }}>{v}g</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logged meals */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '18px 22px', boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a3a36' }}>
            <ClipboardList size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Today's Log
          </h3>
          <button onClick={() => setShowPicker(s => !s)} style={{
            background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Plus size={13} /> Add meal
          </button>
        </div>

        {showPicker && (
          <div style={{ marginBottom: 14, border: '1.5px solid #eef3f1', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: '#f9f5f1', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a9692' }}>From today's plan</div>
            {allAvailable.map(m => (
              <button key={m.name} onClick={() => addFromPlan(m)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'none', border: 'none',
                borderTop: '1px solid #f0f5f4', padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 16 }}>{SLOT_META[m.slot]?.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a36' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#7a9692' }}>{m.cal} cal · {m.p}g protein</div>
                </div>
                <Plus size={14} style={{ color: '#4a6864', flexShrink: 0 }} />
              </button>
            ))}
            {uniqueOther.slice(0, 6).length > 0 && (
              <>
                <div style={{ padding: '10px 14px', background: '#f9f5f1', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a9692', borderTop: '1px solid #eef3f1' }}>Other meals</div>
                {uniqueOther.slice(0, 6).map(m => (
                  <button key={m.name} onClick={() => addFromPlan(m)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    borderTop: '1px solid #f0f5f4', padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a36' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#7a9692' }}>{m.cal} cal · {m.p}g protein</div>
                    </div>
                    <Plus size={14} style={{ color: '#4a6864', flexShrink: 0 }} />
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {logged.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: '#a8b8b5', fontSize: 13 }}>
            No meals logged yet — tap "Add meal" to start tracking
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            {logged.map(m => (
              <div key={m.logId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f9f5f1', borderRadius: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a36' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#7a9692' }}>{m.cal} cal · P {m.p}g · C {m.c}g · F {m.f}g</div>
                </div>
                <button onClick={() => setLogged(l => l.filter(x => x.logId !== m.logId))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cfdedb', padding: 4 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        {logged.length > 0 && (
          <button onClick={() => setLogged([])} style={{ marginTop: 10, background: 'none', border: 'none', fontSize: 11, color: '#a8b8b5', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
            Clear log
          </button>
        )}
      </div>
    </div>
  );
}


// ============================================================
// RECIPE DETAIL MODAL
// ============================================================

function RecipeModal({ meal, onClose }) {
  const [servings, setServings] = useState(1);
  if (!meal) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,58,54,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 28, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(26,58,54,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
          <div>
            {meal.custom && <div style={{ fontSize: 10, fontWeight: 700, color: '#4a9e7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Custom Recipe</div>}
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a3a36', lineHeight: 1.25 }}>{meal.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a9692', padding: 4, flexShrink: 0, marginLeft: 12 }}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[['🔥', `${meal.cal} cal`, '#f4b8b8'], ['🥩', `${meal.p}g protein`, '#c7a4d9'], ['🌾', `${meal.c}g carbs`, '#f0c987'], ['💧', `${meal.f}g fat`, '#b8d4f4']].map(([icon, label, bg]) => (
            <div key={label} style={{ background: bg, borderRadius: 10, padding: '5px 11px', fontSize: 12, fontWeight: 700, color: '#1a3a36' }}>{icon} {label}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, background: '#f9f5f1', borderRadius: 14, padding: '12px 16px' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a3a36', flex: 1 }}>Servings</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setServings(s => Math.max(1, s - 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '2px solid #d4e9e3', background: '#fff', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#1a3a36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#1a3a36', minWidth: 28, textAlign: 'center' }}>{servings}</span>
            <button onClick={() => setServings(s => s + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '2px solid #d4e9e3', background: '#fff', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#1a3a36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a36', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Ingredients {servings > 1 && <span style={{ fontWeight: 400, color: '#7a9692', textTransform: 'none', letterSpacing: 0 }}>— {servings} servings</span>}
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {meal.ing.map((ing, i) => {
              const scaled = ing.qty * servings;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: i % 2 === 0 ? '#f9f5f1' : '#fff', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: '#1a3a36', fontWeight: 500 }}>{ing.item}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a3a36' }}>{fmtQty(scaled, ing.unit)}</span>
                    {servings > 1 && <div style={{ fontSize: 10, color: '#7a9692' }}>{fmtQty(ing.qty, ing.unit)} × {servings}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a36', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Method</div>
          {meal.method
            ? <div style={{ fontSize: 13, color: '#4a6864', lineHeight: 1.75, background: '#f9f5f1', borderRadius: 12, padding: '14px 16px', whiteSpace: 'pre-wrap' }}>{meal.method}</div>
            : <div style={{ fontSize: 12, color: '#a8b8b5', fontStyle: 'italic' }}>No method added for this recipe.</div>
          }
        </div>
        <button onClick={onClose} style={{ width: '100%', background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

// ============================================================
// PERSISTENT STATE HELPER
// ============================================================

function usePersisted(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const setPersisted = (updater) => {
    setValue(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [value, setPersisted];
}

function applyOverrides(plan, overrides, customMeals = []) {
  const out = { ...plan };
  const allMeals = [...Object.values(MEALS).flat(), ...customMeals];
  Object.entries(overrides).forEach(([slot, name]) => {
    const found = allMeals.find(m => m.name === name);
    if (found) out[slot] = found;
  });
  return out;
}

export default function MealPlanner() {
  const [trainingCal, setTrainingCal] = usePersisted('mp_trainingCal', 2541);
  const [trainingProtein, setTrainingProtein] = usePersisted('mp_trainingProtein', 179);
  const [restCal, setRestCal] = usePersisted('mp_restCal', 2188);
  const [restProtein, setRestProtein] = usePersisted('mp_restProtein', 172);
  const [totalDays, setTotalDays] = usePersisted('mp_totalDays', 7);
  const [trainingDayCount, setTrainingDayCount] = usePersisted('mp_trainingDayCount', 5);
  const [trainingSeed, setTrainingSeed] = usePersisted('mp_trainingSeed', 1);
  const [restSeed, setRestSeed] = usePersisted('mp_restSeed', 2);
  const [activeMode, setActiveMode] = useState('training');
  const [view, setView] = useState('combined');
  const [expanded, setExpanded] = useState({});
  const [swapping, setSwapping] = useState(null);
  const [trainingOverrides, setTrainingOverrides] = usePersisted('mp_trainingOverrides', {});
  const [restOverrides, setRestOverrides] = usePersisted('mp_restOverrides', {});

  // slot toggles (deselect meals)
  // Per-day skip counts: { dinner: 2 } = skip this slot on 2 days
  const [trainingSkippedDays, setTrainingSkippedDays] = usePersisted('mp_trainingSkippedDays', {});
  const [restSkippedDays, setRestSkippedDays] = usePersisted('mp_restSkippedDays', {});

  // custom recipes — persisted
  const [customMeals, setCustomMeals] = usePersisted('mp_customMeals', []);
  const [showAddRecipe, setShowAddRecipe] = useState(false);

  const [viewingRecipe, setViewingRecipe] = useState(null);

  // main tab
  const [mainTab, setMainTab] = useState('planner');

  const restDayCount = Math.max(0, totalDays - trainingDayCount);

  // Merge custom meals into MEALS db
  const effectiveMeals = useMemo(() => {
    const merged = { preworkout: [...MEALS.preworkout], breakfast: [...MEALS.breakfast], lunch: [...MEALS.lunch], dinner: [...MEALS.dinner], snack: [...MEALS.snack], funSnack: [...MEALS.funSnack] };
    customMeals.forEach(cm => { merged[cm.section] = [...(merged[cm.section] || []), cm]; });
    return merged;
  }, [customMeals]);

  const baseTraining = useMemo(() => buildPlan(trainingCal, trainingProtein, true, trainingSeed, effectiveMeals), [trainingCal, trainingProtein, trainingSeed, effectiveMeals]);
  const baseRest = useMemo(() => buildPlan(restCal, restProtein, false, restSeed, effectiveMeals), [restCal, restProtein, restSeed, effectiveMeals]);
  const trainingPlan = useMemo(() => baseTraining ? applyOverrides(baseTraining, trainingOverrides, customMeals) : null, [baseTraining, trainingOverrides, customMeals]);
  const restPlan = useMemo(() => baseRest ? applyOverrides(baseRest, restOverrides, customMeals) : null, [baseRest, restOverrides, customMeals]);

  const tTotals = planTotals(trainingPlan, trainingSkippedDays, trainingDayCount);
  const rTotals = planTotals(restPlan, restSkippedDays, restDayCount);
  const weekCal = tTotals.cal * trainingDayCount + rTotals.cal * restDayCount;
  const weekProtein = tTotals.p * trainingDayCount + rTotals.p * restDayCount;

  const { combined: shoppingCombined, perMeal: shoppingPerMeal } = useMemo(
    () => buildShoppingList(trainingPlan, restPlan, trainingDayCount, restDayCount, trainingSkippedDays, restSkippedDays),
    [trainingPlan, restPlan, trainingDayCount, restDayCount, trainingSkippedDays, restSkippedDays]
  );

  // Category-grouped shopping list
  const shoppingByCategory = useMemo(() => {
    const groups = {};
    shoppingCombined.forEach(i => {
      const cat = categorizeIngredient(i.item);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(i);
    });
    return CATEGORY_ORDER.filter(c => groups[c]).map(c => ({ category: c, items: groups[c] }));
  }, [shoppingCombined]);

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));
  const currentPlan = activeMode === 'training' ? trainingPlan : restPlan;
  const currentSlots = activeMode === 'training'
    ? ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack']
    : ['breakfast', 'lunch', 'dinner', 'snack', 'funSnack'];
  const currentDayCount = activeMode === 'training' ? trainingDayCount : restDayCount;
  const currentSkippedDays = activeMode === 'training' ? trainingSkippedDays : restSkippedDays;
  const setCurrentSkippedDays = activeMode === 'training' ? setTrainingSkippedDays : setRestSkippedDays;

  const slotSkipCount = (slot) => currentSkippedDays[slot] || 0;
  const setSlotSkip = (slot, n) => {
    setCurrentSkippedDays(s => {
      if (n <= 0) { const next = { ...s }; delete next[slot]; return next; }
      return { ...s, [slot]: Math.min(n, currentDayCount) };
    });
  };

  const swapMeal = (slot, mealName) => {
    if (activeMode === 'training') setTrainingOverrides(o => ({ ...o, [slot]: mealName }));
    else setRestOverrides(o => ({ ...o, [slot]: mealName }));
    setSwapping(null);
  };

  const shuffleAll = () => { setTrainingOverrides({}); setRestOverrides({}); setTrainingSeed(s => s + 1); setRestSeed(s => s + 1); };
  const shuffleCurrent = () => {
    if (activeMode === 'training') { setTrainingOverrides({}); setTrainingSeed(s => s + 1); }
    else { setRestOverrides({}); setRestSeed(s => s + 1); }
  };

  const removeCustomMeal = (idx) => {
    const removed = customMeals[idx];
    setCustomMeals(c => c.filter((_, i) => i !== idx));
    if (removed) {
      setTrainingOverrides(o => {
        const next = { ...o };
        Object.keys(next).forEach(k => { if (next[k] === removed.name) delete next[k]; });
        return next;
      });
      setRestOverrides(o => {
        const next = { ...o };
        Object.keys(next).forEach(k => { if (next[k] === removed.name) delete next[k]; });
        return next;
      });
    }
  };

  const addCustomRecipe = (recipe) => setCustomMeals(c => [...c, recipe]);

  const exportList = () => {
    const lines = [];
    lines.push(`MEAL PLAN & SHOPPING LIST — ${totalDays} day${totalDays > 1 ? 's' : ''}`);
    lines.push(`Training days × ${trainingDayCount}: ${tTotals.cal} cal / ${tTotals.p}g protein`);
    if (restDayCount > 0) lines.push(`Rest days × ${restDayCount}: ${rTotals.cal} cal / ${rTotals.p}g protein`);
    lines.push(`Period: ${weekCal.toLocaleString()} cal · ${weekProtein}g protein`);
    lines.push('');
    lines.push('SHOPPING LIST (by category):');
    shoppingByCategory.forEach(({ category, items }) => {
      lines.push(`\n${category}`);
      items.forEach(i => lines.push(`  ☐ ${i.item} — ${fmtQty(i.qty, i.unit)}`));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `meal-plan-${totalDays}days.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const TAB_BTN = (id, icon, label) => (
    <button key={id} onClick={() => setMainTab(id)} style={{
      flex: 1, padding: '11px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      background: mainTab === id ? '#1a3a36' : 'transparent', color: mainTab === id ? '#fff' : '#4a6864',
      fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      {icon}{label}
    </button>
  );

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif", background: 'linear-gradient(135deg, #c7e9e2 0%, #f5e8e0 100%)', minHeight: '100vh', padding: '32px 16px', color: '#1a3a36' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Pacifico&display=swap');
        * { box-sizing: border-box; }
        input[type="range"] { -webkit-appearance: none; width: 100%; height: 6px; background: #d4e9e3; border-radius: 3px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; background: #f4b8b8; border: 3px solid #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 6px rgba(26,58,54,0.2); }
        input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; background: #f4b8b8; border: 3px solid #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 6px rgba(26,58,54,0.2); }
        .meal-card { transition: transform 0.2s, box-shadow 0.2s; }
        .meal-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,58,54,0.12); }
        .btn { transition: all 0.15s; cursor: pointer; }
        .btn:hover { transform: translateY(-1px); }
        .skip-btn { opacity: 0.4; transition: all 0.2s; }
        .skip-btn:hover { opacity: 1; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Pacifico', cursive", fontSize: 18, color: '#1a3a36', marginBottom: 4, opacity: 0.7 }}>Fit with Jade</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: '#1a3a36' }}>Weekly Meal Planner</h1>
          <p style={{ color: '#4a6864', margin: '8px 0 0', fontSize: 15 }}>Calories + protein targets · custom prep days · one shopping list</p>
        </div>

        {/* MAIN TAB BAR */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', padding: 6, borderRadius: 14, boxShadow: '0 2px 10px rgba(26,58,54,0.06)' }}>
          {TAB_BTN('planner', <Target size={14} />, 'Meal Planner')}
          {TAB_BTN('tracker', <BarChart2 size={14} />, 'Daily Tracker')}
          {TAB_BTN('shopping', <ShoppingBasket size={14} />, 'Shopping List')}
          {TAB_BTN('recipes', <BookOpen size={14} />, `My Recipes${customMeals.length > 0 ? ` (${customMeals.length})` : ''}`)}
        </div>

        {/* ==================== PLANNER TAB ==================== */}
        {mainTab === 'planner' && (
          <>
            {/* Days control */}
            <div style={{ background: '#1a3a36', color: '#fff', borderRadius: 20, padding: '22px 26px', marginBottom: 20 }}>
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
                    <label style={{ fontSize: 12, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Training days</label>
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

            {/* Macro targets */}
            <div style={{ background: '#fff', borderRadius: 24, padding: '24px 28px', marginBottom: 20, boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 16 }}>
                <DayTypeControl icon={<Dumbbell size={16} />} label="Training days" accent="#f4b8b8"
                  cal={trainingCal} setCal={(v) => { setTrainingCal(v); setTrainingOverrides({}); }}
                  protein={trainingProtein} setProtein={(v) => { setTrainingProtein(v); setTrainingOverrides({}); }}
                  defaultCal={2541} defaultProtein={179} />
                <DayTypeControl icon={<Moon size={16} />} label="Rest days" accent="#a8d5ba"
                  cal={restCal} setCal={(v) => { setRestCal(v); setRestOverrides({}); }}
                  protein={restProtein} setProtein={(v) => { setRestProtein(v); setRestOverrides({}); }}
                  defaultCal={2188} defaultProtein={172} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" onClick={shuffleAll} style={{ flex: 1, background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 18px', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                  <Shuffle size={16} /> Shuffle all meals
                </button>
                <button className="btn" onClick={() => setShowAddRecipe(true)} style={{ flex: 1, background: '#f5e8e0', color: '#1a3a36', border: 'none', borderRadius: 12, padding: '12px 18px', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                  <Plus size={16} /> Add recipe
                </button>
              </div>
            </div>

            {/* Mode tabs */}
            {(trainingDayCount > 0 || restDayCount > 0) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: '#fff', padding: 6, borderRadius: 14, boxShadow: '0 2px 10px rgba(26,58,54,0.06)' }}>
                {trainingDayCount > 0 && (
                  <button onClick={() => { setActiveMode('training'); setSwapping(null); }} style={{ flex: 1, background: activeMode === 'training' ? '#1a3a36' : 'transparent', color: activeMode === 'training' ? '#fff' : '#1a3a36', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                    <Dumbbell size={14} /> Training meals × {trainingDayCount}
                    {Object.keys(trainingSkippedDays).length > 0 && <span style={{ background: '#f4b8b8', color: '#1a3a36', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 6px' }}>{Object.values(trainingSkippedDays).reduce((a,b)=>a+b,0)} skipped</span>}
                  </button>
                )}
                {restDayCount > 0 && (
                  <button onClick={() => { setActiveMode('rest'); setSwapping(null); }} style={{ flex: 1, background: activeMode === 'rest' ? '#1a3a36' : 'transparent', color: activeMode === 'rest' ? '#fff' : '#1a3a36', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                    <Moon size={14} /> Rest meals × {restDayCount}
                    {Object.keys(restSkippedDays).length > 0 && <span style={{ background: '#a8d5ba', color: '#1a3a36', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 6px' }}>{Object.values(restSkippedDays).reduce((a,b)=>a+b,0)} skipped</span>}
                  </button>
                )}
              </div>
            )}

            {/* Auto-switch modes */}
            {(() => {
              if (activeMode === 'training' && trainingDayCount === 0 && restDayCount > 0) setActiveMode('rest');
              if (activeMode === 'rest' && restDayCount === 0 && trainingDayCount > 0) setActiveMode('training');
              return null;
            })()}

            {/* Macro summary */}
            {currentPlan && (activeMode === 'training' ? trainingDayCount > 0 : restDayCount > 0) && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '18px 24px', marginBottom: 16, boxShadow: '0 4px 20px rgba(26,58,54,0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, alignItems: 'center' }}>
                <MacroStat icon={<Flame size={16} />} label="Calories" value={activeMode === 'training' ? tTotals.cal : rTotals.cal} target={activeMode === 'training' ? trainingCal : restCal} accent="#f4b8b8" />
                <MacroStat icon={<Beef size={16} />} label="Protein" value={`${activeMode === 'training' ? tTotals.p : rTotals.p}g`} target={`${activeMode === 'training' ? trainingProtein : restProtein}g`} accent="#c7a4d9" />
                <MacroStat icon={<Wheat size={16} />} label="Carbs" value={`${activeMode === 'training' ? tTotals.c : rTotals.c}g`} accent="#f0c987" />
                <MacroStat icon={<Droplet size={16} />} label="Fat" value={`${activeMode === 'training' ? tTotals.f : rTotals.f}g`} accent="#b8d4f4" />
                <button className="btn" onClick={shuffleCurrent} style={{ background: '#f5e8e0', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, color: '#1a3a36', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shuffle size={13} /> Shuffle
                </button>
              </div>
            )}

            {/* MEAL CARDS with per-day skip + recipe view */}
            {currentPlan && currentDayCount > 0 && (
              <div style={{ background: '#fff', borderRadius: 24, padding: 28, marginBottom: 20, boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
                <div style={{ marginBottom: 10, fontSize: 12, color: '#a8b8b5' }}>
                  Tap a meal name to view its full recipe · Use −/+ to skip days (e.g. skip dinner on 2 of 5 days)
                </div>
                <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                  {currentSlots.map(slot => {
                    const meal = currentPlan[slot];
                    if (!meal) return null;
                    const skipCount = slotSkipCount(slot);
                    const activeDays = Math.max(0, currentDayCount - skipCount);
                    const fullySkipped = activeDays === 0;
                    const isSwapping = swapping === slot;
                    const list = effectiveMeals[slot] || [];
                    return (
                      <div key={slot} className="meal-card" style={{ background: fullySkipped ? '#f9f9f7' : '#f9f5f1', borderRadius: 16, padding: '16px', border: fullySkipped ? '2px dashed #d4e9e3' : skipCount > 0 ? '2px solid #f0c987' : '2px solid transparent', opacity: fullySkipped ? 0.55 : 1, transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7a9692' }}>
                              {SLOT_META[slot].icon} {SLOT_META[slot].label}
                            </div>
                            <button onClick={() => setViewingRecipe(meal)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3, color: fullySkipped ? '#a8b8b5' : '#1a3a36', lineHeight: 1.25, textDecoration: fullySkipped ? 'line-through' : 'underline dotted #b0ccc9' }}>
                                {meal.name}
                                {meal.custom && <span style={{ fontSize: 9, background: '#c7e9e2', color: '#1a3a36', borderRadius: 4, padding: '1px 5px', marginLeft: 5, fontWeight: 700, verticalAlign: 'middle' }}>CUSTOM</span>}
                              </div>
                            </button>
                          </div>
                          <div style={{ background: fullySkipped ? '#eef3f1' : skipCount > 0 ? '#f0c987' : '#f5e8e0', color: '#1a3a36', padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>
                            {fullySkipped ? 'Off' : skipCount > 0 ? `${activeDays}/${currentDayCount} days` : `${meal.cal} cal`}
                          </div>
                        </div>
                        {!fullySkipped && (
                          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#4a6864', marginBottom: 10 }}>
                            <span style={{ fontWeight: 600 }}>P {meal.p}g</span>
                            <span>C {meal.c}g</span>
                            <span>F {meal.f}g</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: '#fff', borderRadius: 10, padding: '7px 10px', border: '1.5px solid #eef3f1' }}>
                          <span style={{ fontSize: 11, color: '#7a9692', flex: 1, fontWeight: 500 }}>
                            {fullySkipped ? 'All days off' : skipCount > 0 ? `Skip ${skipCount} day${skipCount > 1 ? 's' : ''}` : 'Skip days'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button onClick={() => setSlotSkip(slot, skipCount - 1)} disabled={skipCount === 0} style={{ width: 24, height: 24, borderRadius: 6, border: '1.5px solid #d4e9e3', background: skipCount === 0 ? '#f5f5f5' : '#fff', cursor: skipCount === 0 ? 'default' : 'pointer', fontSize: 14, fontWeight: 700, color: skipCount === 0 ? '#ccc' : '#1a3a36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a3a36', minWidth: 18, textAlign: 'center' }}>{skipCount}</span>
                            <button onClick={() => setSlotSkip(slot, skipCount + 1)} disabled={skipCount >= currentDayCount} style={{ width: 24, height: 24, borderRadius: 6, border: '1.5px solid #d4e9e3', background: skipCount >= currentDayCount ? '#f5f5f5' : '#fff', cursor: skipCount >= currentDayCount ? 'default' : 'pointer', fontSize: 14, fontWeight: 700, color: skipCount >= currentDayCount ? '#ccc' : '#1a3a36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          </div>
                        </div>
                        {!fullySkipped && (
                          !isSwapping ? (
                            <button className="btn" onClick={() => setSwapping(slot)} style={{ width: '100%', background: '#f5e8e0', border: 'none', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#1a3a36', fontFamily: 'inherit' }}>
                              Swap this meal
                            </button>
                          ) : (
                            <div>
                              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8, borderTop: '1px solid #eef3f1', paddingTop: 8 }}>
                                {list.map(m => (
                                  <button key={m.name} onClick={() => swapMeal(slot, m.name)} style={{ display: 'block', width: '100%', textAlign: 'left', background: m.name === meal.name ? '#f5e8e0' : 'transparent', border: 'none', padding: '6px 8px', fontSize: 12, cursor: 'pointer', borderRadius: 6, color: '#1a3a36', fontFamily: 'inherit' }}>
                                    {m.name === meal.name && <Check size={11} style={{ display: 'inline', marginRight: 4 }} />}
                                    <span style={{ fontWeight: 500 }}>{m.name}</span>
                                    {m.custom && <span style={{ fontSize: 9, background: '#c7e9e2', color: '#1a3a36', borderRadius: 3, padding: '1px 4px', marginLeft: 4, fontWeight: 700 }}>✦</span>}
                                    <span style={{ color: '#7a9692', marginLeft: 4 }}>· {m.cal} cal · {m.p}g p</span>
                                  </button>
                                ))}
                              </div>
                              <button onClick={() => setSwapping(null)} style={{ background: 'none', border: '1px solid #d4e9e3', borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer', color: '#4a6864', fontFamily: 'inherit' }}>
                                <X size={11} style={{ display: 'inline', marginRight: 4 }} />Cancel
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================== DAILY TRACKER TAB ==================== */}
        {mainTab === 'tracker' && (
          <DailyTracker
            trainingPlan={trainingPlan} restPlan={restPlan}
            tSkipped={Object.keys(trainingSkippedDays).filter(k => trainingSkippedDays[k] >= trainingDayCount)}
            rSkipped={Object.keys(restSkippedDays).filter(k => restSkippedDays[k] >= restDayCount)}
            trainingCal={trainingCal} trainingProtein={trainingProtein}
            restCal={restCal} restProtein={restProtein}
            customMeals={customMeals}
          />
        )}

        {/* ==================== SHOPPING LIST TAB ==================== */}
        {mainTab === 'shopping' && (
          <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <SectionHeader icon={<ShoppingBasket size={18} />} title={`Shopping list — ${totalDays} day${totalDays > 1 ? 's' : ''}`}
                sub={`${trainingDayCount > 0 ? `Training × ${trainingDayCount}` : ''}${trainingDayCount > 0 && restDayCount > 0 ? ' + ' : ''}${restDayCount > 0 ? `Rest × ${restDayCount}` : ''}`}
                noMargin />
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ display: 'flex', background: '#f5e8e0', borderRadius: 10, padding: 3 }}>
                  <button onClick={() => setView('combined')} style={tabBtn(view === 'combined')}>Combined</button>
                  <button onClick={() => setView('category')} style={tabBtn(view === 'category')}>By Category</button>
                  <button onClick={() => setView('permeal')} style={tabBtn(view === 'permeal')}>Per Meal</button>
                </div>
                <button className="btn" onClick={exportList} style={{ background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                  <Download size={13} />Export
                </button>
              </div>
            </div>

            {view === 'combined' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 6 }}>
                {shoppingCombined.map((i, idx) => <CheckItem key={idx} label={i.item} qty={fmtQty(i.qty, i.unit)} />)}
              </div>
            )}

            {view === 'category' && (
              <div style={{ display: 'grid', gap: 20 }}>
                {shoppingByCategory.map(({ category, items }) => (
                  <div key={category}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #eef3f1' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#1a3a36' }}>{category}</span>
                      <span style={{ fontSize: 11, color: '#7a9692', fontWeight: 500, background: '#f5e8e0', borderRadius: 999, padding: '2px 8px' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
                      {items.map((i, idx) => <CheckItem key={idx} label={i.item} qty={fmtQty(i.qty, i.unit)} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'permeal' && (
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
                          <button onClick={() => toggle(`${label}-${m.mealName}`)} style={{ width: '100%', background: '#f9f5f1', border: 'none', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: '#1a3a36' }}>
                              <span style={{ marginRight: 6 }}>{SLOT_META[m.slot].icon}</span>
                              {m.mealName}<span style={{ color: '#7a9692', fontWeight: 500, marginLeft: 8 }}>×{m.dayCount}</span>
                            </span>
                            {expanded[`${label}-${m.mealName}`] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          {expanded[`${label}-${m.mealName}`] && (
                            <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
                              {m.ingredients.map((i, ix) => <CheckItem key={ix} label={i.item} qty={fmtQty(i.qty, i.unit)} />)}
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

        {/* ==================== MY RECIPES TAB ==================== */}
        {mainTab === 'recipes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a3a36' }}>
                  <BookOpen size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />My Recipes
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#7a9692' }}>Custom meals available across your plan</p>
              </div>
              <button className="btn" onClick={() => setShowAddRecipe(true)} style={{ background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 18px', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', cursor: 'pointer' }}>
                <Plus size={14} /> Add Recipe
              </button>
            </div>

            {customMeals.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 24, padding: '48px 28px', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,58,54,0.08)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a3a36', marginBottom: 6 }}>No custom recipes yet</div>
                <div style={{ fontSize: 13, color: '#7a9692', marginBottom: 20 }}>Add your own meals with macros and instructions — they'll appear in the meal swap list</div>
                <button className="btn" onClick={() => setShowAddRecipe(true)} style={{ background: '#1a3a36', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <Plus size={14} /> Add your first recipe
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {customMeals.map((meal, idx) => (
                  <div key={idx} style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(26,58,54,0.08)', border: '2px solid #c7e9e2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#7a9692', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                          {SECTION_LABELS[meal.section]} · Custom
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3a36' }}>{meal.name}</div>
                      </div>
                      <button onClick={() => removeCustomMeal(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cfdedb', padding: 4, flexShrink: 0 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 12, marginBottom: 10 }}>
                      <span style={{ background: '#f4b8b8', borderRadius: 6, padding: '3px 8px', fontWeight: 700, color: '#1a3a36' }}>{meal.cal} cal</span>
                      <span style={{ color: '#4a6864' }}>P {meal.p}g · C {meal.c}g · F {meal.f}g</span>
                    </div>
                    {meal.method && (
                      <div style={{ fontSize: 12, color: '#7a9692', marginBottom: 10, borderLeft: '2px solid #c7e9e2', paddingLeft: 8, lineHeight: 1.5, fontStyle: 'italic' }}>
                        {meal.method.length > 100 ? meal.method.slice(0, 100) + '...' : meal.method}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#4a6864' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Ingredients:</div>
                      {meal.ing.map((i, j) => (
                        <div key={j} style={{ color: '#7a9692' }}>{i.item} — {fmtQty(i.qty, i.unit)}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 12, color: '#7a9692', marginTop: 24, lineHeight: 1.6 }}>
          Fit with Jade · {MEALS.preworkout.length} pre-workouts · {MEALS.breakfast.length} breakfasts · {MEALS.lunch.length} lunches · {MEALS.dinner.length} dinners · {MEALS.snack.length} snacks
          {customMeals.length > 0 && ` · ${customMeals.length} custom recipe${customMeals.length > 1 ? 's' : ''}`}
        </div>

      </div>

      {/* Add Recipe Modal */}
      {showAddRecipe && <AddRecipeModal onSave={addCustomRecipe} onClose={() => setShowAddRecipe(false)} />}
      {viewingRecipe && <RecipeModal meal={viewingRecipe} onClose={() => setViewingRecipe(null)} />}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function DayTypeControl({ icon, label, accent, cal, setCal, protein, setProtein, defaultCal, defaultProtein }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #eef3f1' }}>
        <div style={{ background: accent, width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a3a36' }}>{icon}</div>
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
      <div style={{ background: accent, width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a3a36' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, color: '#7a9692', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1a3a36' }}>
          {value}{target && <span style={{ fontSize: 11, color: '#7a9692', fontWeight: 500 }}> / {target}</span>}
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
    <button onClick={() => setChecked(c => !c)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', padding: '6px 8px', cursor: 'pointer', textAlign: 'left', borderRadius: 8, fontFamily: 'inherit', width: '100%' }}>
      <div style={{ width: 18, height: 18, borderRadius: 5, border: '2px solid ' + (checked ? '#1a3a36' : '#cfdedb'), background: checked ? '#1a3a36' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
        {checked && <Check size={12} color="#fff" />}
      </div>
      <div style={{ flex: 1, fontSize: 13, color: checked ? '#a8b8b5' : '#1a3a36', textDecoration: checked ? 'line-through' : 'none' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: '#7a9692', fontWeight: 600, marginLeft: 8 }}>{qty}</span>
      </div>
    </button>
  );
}

function tabBtn(active) {
  return { background: active ? '#1a3a36' : 'transparent', color: active ? '#fff' : '#1a3a36', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
}
