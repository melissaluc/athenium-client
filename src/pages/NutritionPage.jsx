import { Box, Container, Typography, Button} from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import {useEffect} from "react"
import * as echarts from 'echarts';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import nutritionData from '../data/nutrition.json'
import MealList from "../components/MealList";
import { startOfWeek, endOfWeek, format } from 'date-fns';
import WeeklyNutritionSummary from "../components/WeeklyNutritionSummary";


const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // special case for 11th-13th
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Sun
    const end = endOfWeek(start, { weekStartsOn: 0 }); // Sat
    return { start, end };
};


const groupDataByWeek = (data) => {
    const groupedData = {};

    Object.keys(data).forEach(timestamp => {
        const date = new Date(timestamp * 1000); // unix timestamp to Date obj
        const { start } = getWeekRange(date);
        const weekKey = format(start, 'yyyy-MM-dd');

        if (!groupedData[weekKey]) {
            groupedData[weekKey] = {
                totalCalories: 0,
                days:{}
            };
        }

        const dayKey = format(date, 'yyyy-MM-dd');
        const dailyCalories = data[timestamp].macros_cal.protein +
                              data[timestamp].macros_cal.carbs +
                              data[timestamp].macros_cal.fat;

        groupedData[weekKey].days[dayKey] = {
            date: date,
            totalCalories: dailyCalories,
            macros_g: data[timestamp].macros_g,


        }

        groupedData[weekKey].totalCalories += dailyCalories;

    });

    return groupedData;
};


function NutritionPage(){
    // Date formatting
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()]; 
    const day = date.getDate();
    const year = date.getFullYear();
    const dayWithSuffix = day + getOrdinalSuffix(day);
    const { start:startDate, end:endDate } = getWeekRange(date);
    // Group data
    const groupedData = groupDataByWeek(nutritionData.historical)
    
    const todayMacros = {
        totalProtein: 0,
        totalCarbs:0,
        totalFat:0,
        totalCalories:0
    }
    Object.values(nutritionData.today.meals).forEach(meal => {
        meal.forEach(foodItem => {
            todayMacros.totalProtein += foodItem.protein;
            todayMacros.totalCarbs += foodItem.carbs;
            todayMacros.totalFat += foodItem.fat;
            todayMacros.totalCalories += foodItem.calories? foodItem.calories : (foodItem.protein*4 + foodItem.carbs*4 + foodItem.fat*9)
        });
    });

    // Chart data
    // TODO: limit data view to current week or plot the last 7 days including today
    const chartDays = Object.keys(nutritionData.historical).map(unixTime => new Date(parseInt(unixTime)*1000).toLocaleDateString())
    const barChartDataSeries = Object.values(nutritionData.historical).map(entry => ({value: [
                                                                            entry.macros_cal.protein,
                                                                            entry.macros_cal.carbs,
                                                                            entry.macros_cal.fat,
                                                                            ]}))
    
        

    // Echarts
    echarts.use([SVGRenderer, CanvasRenderer]);
    
    const barChartOptions = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Protein', 'Carbs', 'Fat']
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0, // Show all labels
                rotate: 90  // Rotate labels to be vertical
            },
            data: chartDays
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Protein',
                itemStyle: {normal: {color: "#6C4B5E"}},
                type: 'bar',
                stack: 'stack',
                data: barChartDataSeries.map(macro => macro.value[0])
            },
            {
                name: 'Carbs',
                itemStyle: {normal: {color: '#D7907B'}},
                type: 'bar',
                stack: 'stack',
                data: barChartDataSeries.map(macro => macro.value[1])
            },
            {
                name: 'Fat',
                itemStyle: {normal: {color: '#B3679B'}},
                type: 'bar',
                stack: 'stack',
                data: barChartDataSeries.map(macro => macro.value[2])
            },
        ],
    };

    const doughnutChartOptions = {
        legend: {
            orient: 'vertical',
            top: 'center',
            right: '1rem',
            formatter: function (name) {
                if (!todayMacros) {
                    // If there's no data available for the day
                    return "No food logged for the day";
                }

                let value;
                switch(name) {
                    case 'Protein':
                        value = `${todayMacros.totalProtein}g (${((todayMacros.totalProtein / todayMacros.totalCalories) * 100).toFixed(2)}%)`;
                        break;
                    case 'Carbs':
                        value = `${todayMacros.totalCarbs}g (${((todayMacros.totalCarbs / todayMacros.totalCalories) * 100).toFixed(2)}%)`;
                        break;
                    case 'Fat':
                        value = `${todayMacros.totalFat}g (${((todayMacros.totalFat / todayMacros.totalCalories) * 100).toFixed(2)}%)`;
                        break;
                    default:
                        value = null
                        break
                }
                return `${name}: ${value}`;
            }
        },
        series: [
            {
                name: 'Calories',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: { focus: 'none' },
                labelLine: {
                    show: false
                },
                data: [
                    {value: todayMacros.totalProtein, name: 'Protein', itemStyle: {color: "#6C4B5E"}},
                    {value: todayMacros.totalCarbs, name: 'Carbs', itemStyle: {color: '#D7907B'}},
                    {value: todayMacros.totalFat, name: 'Fat', itemStyle: {color: '#B3679B'}}
                ]
            }
        ]
    };

    useEffect(() => {
        const caloriesBarChart = echarts.init(document.getElementById('caloriesBarChart'),  null, { renderer: 'svg' });
        const caloriesDoughnutChart= echarts.init(document.getElementById('caloriesDoughnutChart'),  null, { renderer: 'svg' });
        caloriesBarChart.setOption(barChartOptions);
        caloriesDoughnutChart.setOption(doughnutChartOptions);
        return () => {
            caloriesBarChart.dispose();
            caloriesDoughnutChart.dispose();
        };
    }, []);
    


    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Nutrition</Typography>
                <DrawerNavBar />
            </Box>

            <Button sx={{width:"100%"}}>+ Add Food</Button>
            <Box sx={{margin:'2rem 0', borderBottom:'2px solid black'}}>
                <Typography fontWeight='bold'>Caloric Intake - Last 7 Days</Typography>
                {/* <Typography variant='h6'>{`Week ${format(new Date(startDate),'MMM dd, yyyy')} - ${format(new Date(endDate),'MMM dd, yyyy')}`}</Typography> */}
            </Box>

            <Box id="caloriesBarChart" sx={{ width: '100%', height: '400px'}}></Box>



            <Box sx={{margin:'2rem 0'}}>
                <Box sx={{borderBottom:'2px solid black'}}>
                    <Typography fontWeight='bold'>Today {`${month} ${dayWithSuffix}, ${year}`}</Typography>
                </Box>

                <Box sx={{display:'flex'}}>
                    <Box id="caloriesDoughnutChart" sx={{ width: "100%", height: '20vh'}}></Box>
                </Box>
   
                {
                    Object.entries(nutritionData.today.meals).map(([meal, foodList, index])=>{
                        return <MealList mealName={meal} foodList={foodList}/>
                    })
                }
            </Box>

            {
                Object.entries(groupedData).map(([key, value])=>{
                    return <WeeklyNutritionSummary week={key} data={value}/>
                })


            }

        </Container>
    )

}

export default NutritionPage;