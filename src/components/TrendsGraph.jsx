import { Box, Typography } from "@mui/material"; 
import * as echarts from 'echarts';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import { useEffect, useState } from "react";

// Helper function to get macro calories
const getMacroCalories = (macro) => {
    switch(macro) {
        case 'protein':
            return 4;
        case 'carbs':
            return 4;
        case 'fat':
            return 9;
        default:
            return 0; 
    }
}

// Helper function to extract data
const extractData = (groupData, attribute, groupTitle, toggleGraph) => {
    const extractedData = groupData.map(entry => ({
        timestamp: entry.timestamp,
        value: entry[attribute]
    }));


    if (groupTitle === "nutrition") {
        if (toggleGraph === false) {
            return extractedData
                .filter(entry => attribute !== "calories") 
                .map(entry => ({
                    timestamp: entry.timestamp,
                    value: entry.value * getMacroCalories(attribute)
                }));
        } else {
            // If toggleGraph is true, return values as is and exclude "calories"
            return extractedData
                .filter(entry => attribute !== "calories") 
                .map(entry => ({
                    timestamp: entry.timestamp,
                    value: entry.value
                }));
        }
    } 


    return extractedData;
}


// Function to generate ECharts options
const generateOptions = (groupTitle, selectOptions, toggleGraph, groupData, hideLegend, hideXAxisLabels) => {
    switch (groupTitle) {
        case "nutrition":
            return {
                legend: {
                    data: selectOptions.filter(option => option !== "calories"),
                    show: !hideLegend
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    data: groupData.map(entry => new Date(entry.timestamp * 1000).toLocaleDateString()),
                    axisLabel: {
                        show: !hideXAxisLabels
                    }
                },
                yAxis: {},
                series: selectOptions.map(option => ({
                    name: option,
                    type: 'bar',
                    stack: toggleGraph ? null : 'nutrition',
                    data: extractData(groupData, option, groupTitle, toggleGraph)
                }))
            };
        case "strength":
            return {
                legend: {
                    data: Object.values(selectOptions).flatMap(exercises => exercises),
                    show: !hideLegend
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'time',
                    axisLabel: {
                        formatter: value => new Date(value).toLocaleDateString(),
                        show: !hideXAxisLabels
                    }
                },
                yAxis: {},
                series: Object.values(groupData).flatMap(muscleGroup => muscleGroup.map(exercise => ({
                    name: exercise.exercise,
                    type: 'line',
                    data: toggleGraph? exercise.data.map(entry => [entry.timestamp * 1000, entry.relative_strength]) : exercise.data.map(entry => [entry.timestamp * 1000, entry.lift])
                })))
            };
        default:
            return {
                legend: {
                    data: selectOptions,
                    show: !hideLegend
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    data: groupData.map(entry => new Date(entry.timestamp * 1000).toLocaleDateString()),
                    axisLabel: {
                        show: !hideXAxisLabels
                    }
                },
                yAxis: {},
                series: selectOptions.map(option => ({
                    name: option,
                    type: 'line',
                    data: extractData(groupData, option, groupTitle, toggleGraph)
                }))
            };
    }
}

function TrendsGraph ({groupTitle, groupData, selectOptions, toggleGraph, setToggleText}) {
    const [hideLegend, setHideLegend] = useState(true);
    const [hideXAxisLabels, setHideXAxisLabels] = useState(true);

    const handleSetToggleText = (text) => {
        setToggleText(text)
    }


    useEffect(() => {
        echarts.use([SVGRenderer, CanvasRenderer]);
        const chart = echarts.init(document.getElementById(`TrendChart${groupTitle}`), null, { renderer: 'svg' });
        chart.setOption(generateOptions(groupTitle, selectOptions, toggleGraph, groupData, hideLegend, hideXAxisLabels));
        return () => {
            chart.dispose();
        };
    }, [groupTitle, groupData, selectOptions, toggleGraph, hideLegend, hideXAxisLabels]);

    return (
        <>  
            {groupTitle === "strength" || groupTitle === "nutrition" ?
                <Typography variant="h6">
                    {groupTitle === "strength" ? (toggleGraph ? "Relative Strength" : "Lift in lbs") : (toggleGraph ? "Macros" : "Caloric Intake")}
                </Typography> :
                null
            }
            <Box id={`TrendChart${groupTitle}`} sx={{ width: '100%', height: '400px' }}></Box>
        </>
    )
}

export default TrendsGraph
