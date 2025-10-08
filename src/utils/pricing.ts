import { MealPricing } from '../types';

export const MEAL_PRICING: MealPricing = {
  lunchOnly: 50, // Special rate for lunch-only tokens
  lunchDinner: 80,
  special15Day: 1300,
  special30Day: 2500
};

// Individual meal costs for cancellation calculations
export const INDIVIDUAL_MEAL_COST = {
  lunch: 40,
  dinner: 40
};

export const calculateTokenPrice = (duration: 5 | 7 | 15 | 30, mealType: 'lunch' | 'lunch_dinner'): number => {
  if (mealType === 'lunch_dinner' && duration === 15) {
    return MEAL_PRICING.special15Day;
  }
  
  if (mealType === 'lunch_dinner' && duration === 30) {
    return MEAL_PRICING.special30Day;
  }
  
  const dailyRate = mealType === 'lunch' ? MEAL_PRICING.lunchOnly : MEAL_PRICING.lunchDinner;
  return dailyRate * duration;
};

export const calculateRefund = (mealType: 'lunch' | 'dinner' | 'both'): number => {
  const refundRate = 0.9; // 90% refund
  
  if (mealType === 'lunch') {
    return INDIVIDUAL_MEAL_COST.lunch * refundRate;
  }
  
  if (mealType === 'dinner') {
    return INDIVIDUAL_MEAL_COST.dinner * refundRate;
  }
  
  return (INDIVIDUAL_MEAL_COST.lunch + INDIVIDUAL_MEAL_COST.dinner) * refundRate;
};