import { Box, Container, Typography, Button, TextField, IconButton, InputBase, FormControl, FormGroup } from "@mui/material"; 
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useState, useEffect } from 'react';


// Function to perform conversions
function convertGramsToOtherUnits(grams) {
    const gramsToMilligrams = 1000;
    const gramsToKilograms = 0.001;
    const gramsToPounds = 0.00220462;
    const gramsToFluidOuncesWater = 0.03527396;
    const gramsToTeaspoonsSugar = 0.24;
    const gramsToTablespoonsFlour = 0.067628;

    return {
        mg: grams * gramsToMilligrams,
        kg: grams * gramsToKilograms,
        lbs: grams * gramsToPounds,
        oz: grams * gramsToFluidOuncesWater,
        tsp: grams * gramsToTeaspoonsSugar,
        tbsp: grams * gramsToTablespoonsFlour,
    };
}


function AddFood({selectedDate, setSelectedData, handleClose}) {

    const [searchFoodName, setSearchFoodName] = useState('');
    const [foodDataList, setFoodDataList] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiID = process.env.REACT_APP_API_ID;
    const base_nutrition_api_url = process.env.REACT_APP_NUTRITION_API_BASE_URL;
    const base_api_url = process.env.REACT_APP_API_BASE_URL;
    const [quantityInput, setQuantityInput] = useState('');
    const [assignFood, setAssignFood] = useState({
        meal: "breakfast",
        serving: {
            uom: 'g', 
            quantity: 100,
        },
        nutrition: {
            uom: 'g',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
        },
    });

    // Define options for rendering
    const options = {
        meal: [
            "breakfast",
            "morning_snack",
            "lunch",
            "afternoon_snack",
            "dinner",
            "evening_snack",
        ],
        uom: [
            "g",
            "mg",
            "kg",
            "lbs",
            "oz",
            "tsp",
            "tbsp"
        ]
    };


    useEffect(() => {
        if (selectedFood) {
            // Update nutrition based on the selected food's values for 100g
            const { ENERC_KCAL, PROCNT, CHOCDF, FAT } = selectedFood.nutrients;
            setAssignFood(prevState => ({
                ...prevState,
                nutrition: {
                    ...prevState.nutrition,
                    calories: ENERC_KCAL,
                    protein: PROCNT,
                    carbs: CHOCDF,
                    fat: FAT,
                },
            }));
        }
    }, [selectedFood]);

    const handleSearchInputChange = (e) => {
        setSearchFoodName(e.target.value);
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
    };

    const handleQuantityInput = (e) => {
        const value = e.target.value;
        setQuantityInput(value);
        const quantity = parseFloat(value);
        setAssignFood(prevState => ({
            ...prevState,
            serving: { ...prevState.serving, quantity: isNaN(quantity) ? 0 : quantity },
        }));
    };

    const handleGroupSelection = (group, key) => {
        setAssignFood(prevState => {
            let updatedState = { ...prevState };
            if (group === 'serving.uom') {
                // If the group is for selecting uom, update nutrition values based on the new uom
                const selectedFoodNutrition = selectedFood.nutrients;
                const quantity = prevState.serving.quantity;
                const nutrition = calculateMacros(selectedFoodNutrition, quantity, key);
                updatedState = {
                    ...prevState,
                    nutrition: { ...nutrition },
                    serving: { ...prevState.serving, [group.split('.')[1]]: key }
                };
            } else {
                updatedState = {
                    ...prevState,
                    [group]: key
                };
            }
            console.log(updatedState)
            return updatedState;
        });
    };
    

    const handleSearch = () => {
        const encodedFoodName = encodeURIComponent(searchFoodName);
        axios.get(`${base_nutrition_api_url}?app_id=${apiID}&app_key=${apiKey}&ingr=${encodedFoodName}`)
            .then(response => {
                console.log(response.data?.hints);
                setFoodDataList(response.data?.hints);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const calculateMacros = (nutrients, quantity, uom) => {
        const factor = quantity / (uom==='g'? 100 : convertGramsToOtherUnits(100)[uom])
        return {
            calories: nutrients.ENERC_KCAL * factor,
            protein: nutrients.PROCNT * factor,
            carbs: nutrients.CHOCDF * factor,
            fat: nutrients.FAT * factor,
        };
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        
        const dataToSend = {
            food_name: selectedFood.label,
            protein: Math.round(assignFood.nutrition.protein),
            carbs: Math.round(assignFood.nutrition.carbs),
            fat: Math.round(assignFood.nutrition.fat),
            calories: Math.round(assignFood.nutrition.calories),
            quantity: assignFood.serving.quantity,
            uom: assignFood.serving.uom,
        };

        axios.post(`${base_api_url}nutrition/39b17fed-61d6-492a-b528-4507290d5423/`, 
        {
            datetimestamp:selectedDate ? selectedDate : new Date().toISOString().split('T')[0],
            meal_name:assignFood.meal,
            data:dataToSend

        })
            .then(response => {
                console.log(response)
            })
            .catch(error => console.error(error))
    
        setSelectedData((prevData) => {
            console.log('prevData',prevData)
            const updatedData = { ...prevData };
    
            // Check if the selected meal already exists in the data
            if (updatedData.meals[assignFood.meal]) {
                // If the meal exists, push the new entry to its array
                updatedData.meals[assignFood.meal].push(dataToSend);
            } else {
                // If the meal doesn't exist, create a new array and add the new entry
                updatedData.meals[assignFood.meal] = [dataToSend];
            }
    
            return updatedData;
        });
    
        handleClose();
    };
    
    

    return (
        <Container>
            <Box>
                {selectedFood ? (
                    <Box>
                        <Box>
                            <Typography variant="h6">{selectedFood.label}</Typography>
                            {selectedFood.brand && <Typography>{selectedFood.brand}</Typography>}
                            <FormControl>
                                <FormGroup
                                    row
                                    aria-label="select-meal"
                                    name="select-meal"
                                    value={null}
                                    onChange={() => { }}
                                >
                                    {options.meal.map((meal) => (
                                        <Button key={meal} onClick={() => {handleGroupSelection('meal', meal)}}>
                                            {meal.replace(/_+/g, " ")}
                                        </Button>
                                    ))}
                                </FormGroup>
                                <Box>
                                    <Box>
                                        <Typography>Protein: {Math.round(assignFood.nutrition.protein)} g</Typography>
                                        <Typography>Carbs: {Math.round(assignFood.nutrition.carbs)} g</Typography>
                                        <Typography>Fat: {Math.round(assignFood.nutrition.fat)} g</Typography>
                                        <Typography>Calories: {Math.round(assignFood.nutrition.calories)} cal</Typography>
                                    </Box>
                                    <Button disabled={!quantityInput} onClick={()=>handleGroupSelection('serving.uom',assignFood.serving.uom)}>Re-calculate</Button>
                                </Box>
                                <TextField name='quantity' label='Quantity' onChange={handleQuantityInput} sx={{ width: '6rem' }} value={assignFood.serving.quantity}></TextField><Typography>{assignFood.serving.uom}</Typography>
                                <FormGroup
                                    row
                                    aria-label="select-quantity"
                                    name="select-quantity"
                                    value={null}
                                    onChange={() => { }}
                                >
                                    {/* User change UoM */}
                                    {options.uom.map((uom) => (
                                        <Button key={uom} onClick={() => {handleGroupSelection('serving.uom', uom);}}>
                                            {uom}
                                        </Button>
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Box>
                        <Box>
                        <Box>
                            <Button type='submit' onClick={handleOnSubmit}>Add</Button>
                            <Button onClick={() => {setSelectedFood(null); setFoodDataList([]);}}>Cancel</Button>
                        </Box>
                     </Box>
                </Box>
                ) : (
                    <Box>
                        <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <Typography>Add Food</Typography>
                            <Button onClick={() => {setSelectedFood(null); handleClose();}}>Cancel</Button>
                        </Box>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search-food' }}
                            onChange={handleSearchInputChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch} disabled={!searchFoodName.trim()}>
                            <SearchIcon />
                        </IconButton>
                        {foodDataList.map((food) => {
                            const { ENERC_KCAL, PROCNT, CHOCDF, FAT } = food.food.nutrients;
                            return (
                                <Box
                                    key={`${food.food.label.replace(/\s+/g, '-')}-${food.food?.brand?.replace(/\s+/g, '-')}`.toLowerCase()}
                                    onClick={() => handleSelectFood(food.food)}
                                >
                                    <Typography>{food.food.label}</Typography>
                                    <Box sx={{ display: 'flex', gap: '2rem' }}>
                                        <Typography>{Math.round(parseFloat(ENERC_KCAL))}</Typography>
                                        <Typography>{Math.round(parseFloat(PROCNT))}</Typography>
                                        <Typography>{Math.round(parseFloat(CHOCDF))}</Typography>
                                        <Typography>{Math.round(parseFloat(FAT))}</Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default AddFood;
