/**
 * Image imports — Next.js bundles these from src/assets/ and provides working URLs.
 * Ensure these files exist in the same folder: hero-food.jpg, food-*.jpg
 */
import heroFoodImg from "./hero-food.jpg";
import foodCoffeeImg from "./food-coffee.jpg";
import foodAvocadoToastImg from "./food-avocado-toast.jpg";
import foodCroissantImg from "./food-croissant.jpg";
import foodSmoothieBowlImg from "./food-smoothie-bowl.jpg";
import foodSaladImg from "./food-salad.jpg";
import foodMatchaImg from "./food-matcha.jpg";
import foodEggsBenedictImg from "./food-eggs-benedict.jpg";
import foodPistachioTartImg from "./food-pistachio-tart.jpg";

export const images = {
  heroFood: heroFoodImg.src,
  foodCoffee: foodCoffeeImg.src,
  foodAvocadoToast: foodAvocadoToastImg.src,
  foodCroissant: foodCroissantImg.src,
  foodSmoothieBowl: foodSmoothieBowlImg.src,
  foodSalad: foodSaladImg.src,
  foodMatcha: foodMatchaImg.src,
  foodEggsBenedict: foodEggsBenedictImg.src,
  foodPistachioTart: foodPistachioTartImg.src,
} as const;
