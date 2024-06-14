import { Box, Typography} from "@mui/material"; 
import FoodItem from './FoodItem'



function MealList ({mealName, foodList}) {
   

    const sumMealCalories = (foodList) => {
        return foodList.reduce((acc, foodItem) => {
            return acc + foodItem.calories;
        }, 0);
    }

    const totalCalories = Math.round(sumMealCalories(foodList))

    return (
        <Box sx={{marginBottom:'1rem'}}>
        <Box sx={{borderBottom:'2px solid black', display:'flex', justifyContent:'space-between'}}>
            <Typography fontWeight="bold">{mealName.replace(/_+/g, " ").toUpperCase()}</Typography>
            <Typography fontWeight="bold">{totalCalories} cal</Typography>
        </Box>
        {
            foodList && 
            foodList.map((item, index)=>{
                const {food_name, quantity, protein, carbs, fat, calories, uom} = item
                return <FoodItem 
                        key={index} 
                        foodName={food_name} 
                        protein={protein} 
                        carbs={carbs} fat={fat} 
                        calories={calories}  
                        quantity={quantity} 
                        uom={uom}
                        />

            })
        }

    </Box>
    )
}


export default MealList;