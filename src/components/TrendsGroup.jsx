import { Box, Button } from "@mui/material"; 
import { useEffect, useState } from "react";
import TrendsGraph from "./TrendsGraph";
import { useTheme } from "@emotion/react";

function TrendsGroup({ dateRange, groupTitle, groupAttributes, groupData}) {
    const theme = useTheme();
    const [selectOptions, setSelectOptions] = useState([]);
    const [toggleGraph, setToggleGraph] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showSubOptions, setShowSubOptions] = useState(false);
    const [filteredGroupData, setFilteredGroupData] = useState(null)

    const flattenGroupAttributes = (groupAttributes) => {
        const flatten =  Object.values(groupAttributes) // 
            .flatMap(muscleGroup => muscleGroup) 

            return flatten
    };

    useEffect(() => {
        // Ensure dateRange has start and end timestamps
        if (!dateRange || !dateRange.start || !dateRange.end) {
            return;
        }

        // Filter groupData based on the type of groupTitle
        if (Array.isArray(groupData)) {
            const filteredData = groupData.filter(entry => {
                const timestamp = new Date(entry.timestamp * 1000);
                return timestamp >= dateRange.start && timestamp <= dateRange.end;
            });
            setFilteredGroupData(filteredData);
        } else {
            const filteredData = {};
            Object.keys(groupData).forEach(categoryName => {
                const category = groupData[categoryName];
                filteredData[categoryName] = {};

                Object.keys(category).forEach(exerciseName => {
                    const exerciseData = category[exerciseName];
                    const filteredExerciseData = exerciseData.filter(entry => {
                        const timestamp = new Date(entry.timestamp * 1000);
                        return timestamp >= dateRange.start && timestamp <= dateRange.end;
                    });
                    filteredData[categoryName][exerciseName] = filteredExerciseData;
                });
            });
            setFilteredGroupData(filteredData);
        }
    }, [groupData, dateRange]);


    const handleOptions = (metric) => {

        const index = selectOptions.indexOf(metric);

        if (index === -1) {
            setSelectOptions(prev => [...prev, metric]);
        } else {
            setSelectOptions(prev => prev.filter(option => option !== metric));
        }
    }
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${theme.palette.primary.main}` }}>
                <Button fontWeight='bold' onClick={() => setShowOptions(prev => !prev)}>
                    {groupTitle.replace(/_/g, " ").toUpperCase()}
                </Button>
                {groupTitle !== "measurements" && (
                    <Button onClick={() => setToggleGraph(prev => !prev)}>Toggle</Button>
                )}
            </Box>

            {showOptions && (
                <Box sx={{
                    display: 'flex',
                    flexWrap: groupTitle !== "strength" ? 'wrap' : 'nowrap',
                    flexDirection: groupTitle !== "strength" ? 'row' : 'column',
                    gap: '0.5rem'
                }}>
                    {groupTitle !== "strength" && groupAttributes.filter(attribute => !attribute.endsWith("_diff") && attribute !== "calories").map((metric) => (
                            <Button
                                key={metric}
                                sx={{ 
                                border: '1px solid blue', 
                                padding: '0.2rem',
                                backgroundColor: selectOptions.includes(metric) ? 'purple' : 'transparent',
                                color: selectOptions.includes(metric) ? 'white' : 'initial', }}
                                onClick={() => handleOptions(metric)}
                            >{metric.replace(/_/g, ' ')}</Button>
                    ))}

                    {groupTitle === "strength" && Object.keys(groupAttributes).map((key) => (
                        <Box key={key}>
                            <Box sx={{ border: '1px solid blue', padding: '0.2rem' }} onClick={() => setShowSubOptions(prev => !prev)}>
                                <Button>{key.replace(/_/g, ' ')}</Button>
                            </Box>
                            <Box>
                                {showSubOptions &&
                                    groupAttributes[key].map((metric) => (
                                            <Button
                                            key={metric}
                                            sx={{
                                                border: '1px solid blue',
                                                padding: '0.2rem',
                                                margin:'0.5rem 0.5rem 0.5rem 0',
                                                backgroundColor: selectOptions.includes(metric) ? 'purple' : 'transparent',
                                                color: selectOptions.includes(metric) ? 'white' : 'initial',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleOptions(metric)}
                                            
                                            >{metric}</Button>
                                    ))
                                }
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            <Box>
                
                <TrendsGraph
                    groupTitle={groupTitle}
                    groupData={filteredGroupData? filteredGroupData: groupData}
                    selectOptions={selectOptions}
                    groupAttributes={groupTitle!=='strength' ?groupAttributes : flattenGroupAttributes(groupAttributes)}
                    toggleGraph={toggleGraph}
                    dateRange={dateRange}
                />
            </Box>
        </Box>
    )
}

export default TrendsGroup;
