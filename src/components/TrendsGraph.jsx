import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material"; 
import * as echarts from 'echarts';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import { useEffect, useState, useContext } from "react";
import {convertLbtoKg, convertCmtoIn} from '../utils/utils'
import { UserDataContext } from '../Contexts/UserDataContext';


// Helper function to get macro calories
// const getMacroCalories = (macro) => {
//     switch(macro) {
//         case 'protein':
//             return 4;
//         case 'carbs':
//             return 4;
//         case 'fat':
//             return 9;
//         default:
//             return 0; 
//     }
// }

// Helper function to generate x-axis labels based on selectDateRange
const generateXAxisLabels = (startTimestamp, endTimestamp) => {
    const xAxisLabels = [];
    const currentDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);

    while (currentDate <= endDate) {
        xAxisLabels.push(currentDate.toLocaleDateString());
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return xAxisLabels;
}

// Helper function to extract data
const extractData = (groupData, attribute, groupTitle, toggleGraph, theme, userData) => {
    // console.log('extractData ',attribute)
    if (groupTitle === "nutrition") {
        // For nutrition groupTitle
        if (toggleGraph === false) {
            // When toggleGraph is false, calculate values for non-calories attributes
            return groupData
                .filter(entry => attribute !== "calories") 
                .map(entry => ({
                    timestamp: entry.timestamp,
                    value: entry[attribute], 
                    itemStyle: { color: theme.palette.macros[attribute] } 
                }));
        } else {
            // When toggleGraph is true, return values as is and exclude 'calories' attribute
            return groupData
                .map(entry => ({
                    timestamp: entry.timestamp,
                    value: entry[attribute],
                    itemStyle: { color: theme.palette.macros[attribute] } 
                }));
        }
    } else {
        // For non-nutrition groupTitle
        if (toggleGraph === true) {
            // When toggleGraph is true, include only attributes ending with '_diff'
            return groupData
            .filter(entry => attribute.endsWith('_diff')) 
            .map(entry => {


                return {
                timestamp: entry.timestamp,
                value: entry[attribute],
                itemStyle: {
                    color: groupTitle === 'strength'
                        ? theme.palette[groupTitle][entry.group]
                        : theme.palette[groupTitle][attribute],
                }
            }
            }    
        );
        
        } else {
            // When toggleGraph is false, exclude attributes ending with '_diff'
            return groupData
            .filter(entry => !attribute.endsWith('_diff'))
            .map(entry => {
                let value = entry[attribute]
                if (['lean_muscle_mass','weight'].includes(attribute)){
                    value = userData.uom.body_mass.uom === 'lb' ? entry[attribute] :convertLbtoKg(entry[attribute])

                } else if (groupTitle === 'measurements') {
                    value = userData.uom.girth_measurements.uom === 'cm'? entry[attribute] : convertCmtoIn(entry[attribute])

                }
                console.log('entry[attribute]', attribute)
                return {
                timestamp: entry.timestamp,
                value: value,
                itemStyle: {
                    color: groupTitle === 'strength'
                        ? (entry.group ? theme.palette[groupTitle][entry.group] : theme.palette[groupTitle][attribute])
                        : theme.palette[groupTitle][attribute]
                },

            }
            }
        );
        }
        
    }
};



// Function to generate ECharts options
const generateOptions = (groupTitle, attributes, toggleGraph, groupData, hideLegend, hideXAxisLabels, theme,xAxisData, xAxisType, userData ) => {

    switch (groupTitle) {
        case "nutrition":
            return {
                legend: {
                    data: attributes.filter(option => option !== "calories"),
                    show: !hideLegend
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    data: xAxisData,
                    axisLabel: {
                        formatter: value => new Date(value).toLocaleDateString(),
                        show: hideXAxisLabels
                    }
                },
                yAxis: {},
                series: attributes.map(option => ({
                    name: option,
                    type: 'bar',
                    stack: toggleGraph ? null : 'nutrition',
                    data: extractData(groupData, option, groupTitle, toggleGraph, theme, userData)
                }))
            };
        case "strength":
                console.log('strength data: ', groupData)
                return {
                    legend: {
                        data: Object.values(attributes).flatMap(exercises => exercises),
                        show: !hideLegend
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: xAxisType,
                        data: xAxisData,
                        axisLabel: {
                            formatter: value => new Date(value).toLocaleDateString(),
                            show: hideXAxisLabels
                        }
                    },
                    yAxis: {},
                    series: Object.entries(groupData).flatMap(([muscleGroup, exercises]) => {
                        return Object.entries(exercises)
                            .filter(([exerciseName]) => attributes.includes(exerciseName))
                            .flatMap(([exerciseName, exerciseData]) => {
                                const color = theme.palette[groupTitle][exerciseName]
                                return {
                                    name: exerciseName,
                                    type: 'line',
                                    data: toggleGraph ? 
                                        exerciseData.map(entry => [entry.timestamp, entry.relative_strength]) : 
                                        exerciseData.map(entry => [entry.timestamp, userData.uom.lift_weight.uom === 'lb' ? entry.lift : convertLbtoKg(entry.lift)]),
                                    itemStyle: {
                                        color
                                    }
                                };
                            });
                    })
                }
        default:
            return {
                legend: {
                    data: attributes,
                    show: !hideLegend
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        formatter: value => new Date(value).toLocaleDateString(),
                        show: hideXAxisLabels
                        
                    }
                },
                yAxis: {},
                series: attributes.map(option => ({
                    name: option,
                    type: toggleGraph ? 'bar' :'line',
                    data: extractData(groupData, option, groupTitle, toggleGraph, theme, userData),
                    lineStyle: {
                        color: groupTitle === 'strength'
                            ? (groupData.group ? theme.palette[groupTitle][groupData.group] : theme.palette[groupTitle][option])
                            : theme.palette[groupTitle][option]
                    }
                }))
            };
    }
}

function TrendsGraph ({groupTitle, groupData, selectOptions, toggleGraph, setToggleText, groupAttributes, dateRange}) {
    const [hideLegend, setHideLegend] = useState(true);
    const [hideXAxisLabels, setHideXAxisLabels] = useState(true);
    const [attributes, setAttributes] = useState(groupAttributes)
    const [xAxisType, setXAxisType] = useState('category')
    const theme = useTheme()
    const {userData} = useContext(UserDataContext)

    const handleSetToggleText = (text) => {
        setToggleText(text)
    }

    const generateXAxisData = (groupData, dateRange) => {
        if (Array.isArray(groupData) && groupData.length > 0) {
            return groupData.map(entry => new Date(entry.timestamp * 1000));
        } else if (Object.entries(groupData).length > 0) {
            const timestamps = [];
            Object.values(groupData).forEach(exercises => {
                Object.values(exercises).forEach(exerciseData => {
                    exerciseData.forEach(entry => {
                        timestamps.push(new Date(entry.timestamp * 1000));
                    });
                });
            });
            if(timestamps.length <1) {
                setXAxisType('category')
                return generateXAxisLabels(dateRange.start, dateRange.end);
                
            } else {
                setXAxisType('time')
                return timestamps;
            }
        } else {
            // If groupData is empty or not provided, generate x-axis labels based on dateRange
            return generateXAxisLabels(dateRange.start, dateRange.end);
        }
    };
    
    

    useEffect(()=>{
        console.log('attributes:', attributes);
        if(selectOptions.length > 0){
            setAttributes(selectOptions)   
        } else {
            setAttributes(groupAttributes)   
        }

    },[selectOptions, groupAttributes])

    useEffect(() => {
        console.log('groupDataGraph: ',groupData)
        echarts.use([SVGRenderer, CanvasRenderer]);
        const chart = echarts.init(document.getElementById(`TrendChart${groupTitle}`), null, { renderer: 'svg' });
        const xAxisData = generateXAxisData(groupData, dateRange);
        console.log('GroupTitle: ', groupTitle)
        console.log('xAxis: ', xAxisData)
        chart.setOption(generateOptions(groupTitle, attributes, toggleGraph, groupData, hideLegend, hideXAxisLabels, theme, xAxisData,xAxisType, userData));
   
        return () => {
            chart.dispose();
        };
    }, [groupTitle, groupData, attributes, toggleGraph, hideLegend, hideXAxisLabels, dateRange]);

    return (
        <>  
            {groupTitle === "strength" || groupTitle === "nutrition" ?
                <Typography variant="h6">
                    {groupTitle === "strength" ? (toggleGraph ? "Relative Strength" : `Lift Weight in ${userData.uom.lift_weight.uom}`) : (toggleGraph ? "Macros" : "Caloric Intake")}
                </Typography> :
                ( groupTitle === "body_composition" ?
                    <Typography variant="h6">
                        {toggleGraph ? "Change in Body Composition" : null}
                    </Typography>

                : ( groupTitle === "measurements"? 
                    <Typography variant="h6">
                    {`In ${userData.uom.girth_measurements.uom === 'cm' ? 'cm' : 'inches'}`}
                    </Typography>
                    : null
                ))
            }
            <Box id={`TrendChart${groupTitle}`} sx={{ width: '100%', height: '400px' }}></Box>
        </>
    )
}

export default TrendsGraph
