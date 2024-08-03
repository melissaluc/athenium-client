import { Box, Container, Typography} from "@mui/material"; 
import {useState, useEffect, useRef, useContext} from "react"
import * as echarts from 'echarts';
// import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import MealList from "../components/MealList";
import { startOfWeek, endOfWeek, format, eachDayOfInterval, isWithinInterval} from 'date-fns';
import WeeklyNutritionSummary from "../components/WeeklyNutritionSummary";
import { useTheme } from "@emotion/react";
import AddFoodModal from "../components/Modals/AddFoodModal";
import axiosInstance from "../utils/axiosConfig";

function getLocalDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; 
    const localDate = new Date(now.getTime() - offset).toISOString().split('T')[0];
    return localDate;
}

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

    data.forEach(day => {
        const datetimestamp = day.datetimestamp
        const date = new Date(datetimestamp * 1000); // unix timestamp to Date obj
        const { start } = getWeekRange(date);
        const weekKey = format(start, 'yyyy-MM-dd');

        if (!groupedData[weekKey]) {
            groupedData[weekKey] = {
                totalCalories: 0,
                days: {}
            };
        }

        const dayKey = format(date, 'yyyy-MM-dd');
        const dailyCalories = day.totals.macros_cal.protein +
            day.totals.macros_cal.carbs +
            day.totals.macros_cal.fat;

        groupedData[weekKey].days[dayKey] = {
            date: date,
            totalCalories: dailyCalories,
            macros_g: day.totals.macros_g,
        }

        groupedData[weekKey].totalCalories += dailyCalories;
    });

    return groupedData;
};

function NutritionPage() {
    const theme = useTheme();
    const caloriesBarChartRef = useRef(null);
    const caloriesDoughnutChartRef = useRef(null);
    const [fullData, setFullData] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    // data to be rendered by charts
    const [selectedData, setSelectedData] = useState({});
    const [todayMacros, setTodayMacros] = useState({
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalCalories: 0
    })
    const [barChartDataSeries, setBarChartDataSeries] = useState([])
    // data below the charts
    const [groupedData, setGroupedData] = useState({});


    const { start, end } = getWeekRange(selectedData.datetimestamp ? new Date(selectedData.datetimestamp * 1000) : new Date());
    const weekDates = eachDayOfInterval({ start, end });
    let chartDays = weekDates.map(date => {
        const dayName = format(date, 'EEEE')
        return dayName
            });


    useEffect(() => {
        
        if (selectedData && selectedData.meals) {
            const newMacros = {
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                totalCalories: 0
            };

            Object.values(selectedData.meals).forEach(meal => {
                meal.forEach(foodItem => {
                    newMacros.totalProtein += foodItem.protein || 0;
                    newMacros.totalCarbs += foodItem.carbs || 0;
                    newMacros.totalFat += foodItem.fat || 0;
                    newMacros.totalCalories += foodItem.calories || (foodItem.protein * 4 + foodItem.carbs * 4 + foodItem.fat * 9) || 0;
                });
            });

            setTodayMacros(newMacros)
        }

    
        if (fullData && fullData.length > 0) {
            let newBarChartDataSeries = [];
            const filteredData = fullData.filter(entry => {
                const entryDate = new Date(entry.datetimestamp * 1000);
                return isWithinInterval(entryDate, { start, end });
            });
    
            newBarChartDataSeries = weekDates.map(date => {
                const entry = filteredData.find(data => format(new Date(parseInt(data.datetimestamp)* 1000), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
                return {
                    value: [
                        entry?.totals?.macros_cal?.protein || 0,
                        entry?.totals?.macros_cal?.carbs || 0,
                        entry?.totals?.macros_cal?.fat || 0,
                    ]
                };
            })
            setBarChartDataSeries(newBarChartDataSeries)
            
            
        }
    },[])
    


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/nutrition`);
                const data = response.data;

                setFullData(data);

                const today = getLocalDate()
                console.log('today: ', today)

                const todayData = data.filter(entry => {
                    const entryDate = new Date(parseInt(entry.datetimestamp) * 1000).toISOString().split('T')[0];
                    console.log('entryDate: ', entryDate)
                    return entryDate === today;
                });
                console.log('todayData', todayData)
                const historicalDataWithoutToday = data.filter(entry => {
                    const entryDate = new Date(parseInt(entry.datetimestamp) * 1000).toISOString().split('T')[0];
                    console.log('entryDate: ', entryDate)
                    return entryDate !== today;
                });
                
                console.log('historical', historicalDataWithoutToday)
                console.log('today', todayData)
                setHistoricalData(historicalDataWithoutToday);

                if (todayData) {
                    setSelectedData(todayData);
                    console.log('selectedData set ', selectedData)
                } else {
                    setSelectedData({
                        datetimestamp: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
                        meals: {},
                        totals: {
                            macros_cal: {
                                protein: null,
                                carbs: null,
                                fat: null
                            },
                            macros_g: {
                                protein: null,
                                carbs: null,
                                fat: null
                            }
                        }
                    });
                }

                const groupedData = groupDataByWeek(data);
                setGroupedData(groupedData);
        

            } catch (error) {
                console.error("Error fetching nutrition data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (caloriesBarChartRef.current && caloriesDoughnutChartRef.current) {
            const caloriesBarChart = echarts.init(caloriesBarChartRef.current, null, { renderer: 'svg' });
            const caloriesDoughnutChart = echarts.init(caloriesDoughnutChartRef.current, null, { renderer: 'svg' });
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
                        itemStyle: {normal: {color: theme.palette.macros.protein}},
                        type: 'bar',
                        stack: 'stack',
                        data: barChartDataSeries.map(macro => macro.value[0])
                    },
                    {
                        name: 'Carbs',
                        itemStyle: {normal: {color: theme.palette.macros.carbs}},
                        type: 'bar',
                        stack: 'stack',
                        data: barChartDataSeries.map(macro => macro.value[1])
                    },
                    {
                        name: 'Fat',
                        itemStyle: {normal: {color: theme.palette.macros.fat}},
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
                            {value: todayMacros.totalProtein, name: 'Protein', itemStyle: {color:theme.palette.macros.protein}},
                            {value: todayMacros.totalCarbs, name: 'Carbs', itemStyle: {color: theme.palette.macros.carbs}},
                            {value: todayMacros.totalFat, name: 'Fat', itemStyle: {color: theme.palette.macros.fat}}
                        ]
                    }
                ]
            };
            caloriesBarChart.setOption(barChartOptions);
            caloriesDoughnutChart.setOption(doughnutChartOptions);

            return () => {
                caloriesBarChart.dispose();
                caloriesDoughnutChart.dispose();
            };
        }
    }, [fullData, historicalData, selectedData, todayMacros, barChartDataSeries, chartDays, theme.palette.macros]);


    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <AddFoodModal selectedDate={selectedData?.datetimestamp} setSelectedData={setSelectedData} />
            </Box>

            <Box sx={{ margin: '2rem 0', borderBottom: '2px solid black' }}>
                <Typography fontWeight='bold'>7 Day Week Caloric Intake</Typography>
                <Typography variant="body1">
                    {(start & end )&&`Week ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`}
                </Typography>
            </Box>

            <Box ref={caloriesBarChartRef} sx={{ width: '100%', height: '400px' }}></Box>

            <Box className='select-date-meal' sx={{ margin: '2rem 0' }}>
                <Box sx={{ borderBottom: '2px solid black' }}>
                    <Typography fontWeight='bold'>Today {format(new Date(), 'MMM dd, yyyy')}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent:'center' }}>
                    {todayMacros.totalCalories? (
                        <Box ref={caloriesDoughnutChartRef} sx={{ width: '100%', height: '100px' }}></Box>
                    ) : (
                        <Box sx={{display:'flex',alignItems:'center',padding:'2rem', margin:'1rem'}}>
                            <Typography>No food logged</Typography>
                        </Box>
                    )}
                </Box>

                {Object.entries(selectedData?.meals || {}).map(([meal, foodList, index]) => (
                    <MealList key={index} mealName={meal} foodList={foodList} />
                ))}
            </Box>

            {Object.entries(groupedData).map(([key, value]) => (
                <WeeklyNutritionSummary key={key} week={key} data={value} />
            ))}
        </Container>
    );
}

export default NutritionPage;