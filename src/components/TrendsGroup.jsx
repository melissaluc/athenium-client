import { Box, Button, IconButton, Chip, Stack, Typography } from "@mui/material"; 
import { useEffect, useState } from "react";
import TrendsGraph from "./TrendsGraph";
import { useTheme } from "@emotion/react";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


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
                        const timestamp = entry.timestamp
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
                <Button fontWeight='bold' spacing='10rem' onClick={() => setShowOptions(prev => !prev)}>
                    <Typography >{groupTitle.replace(/_/g, " ").toUpperCase()}</Typography>
                    {!showOptions ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                </Button>
                {groupTitle !== "measurements" && (
                    <IconButton color={toggleGraph? 'primary' : 'default'} onClick={() => setToggleGraph(prev => !prev)}> {toggleGraph? <ToggleOnIcon /> : <ToggleOffIcon /> }</IconButton>
                )}
            </Box>
            {/* TODO: break into components to control show or no show subOptions */}
            {showOptions && (
                <Stack direction="row" spacing={1} sx={{
                    // display: 'flex',
                    
                    // flexWrap: groupTitle !== "strength" ? 'wrap' : 'nowrap',
                    flexWrap:'wrap'
                    // flexDirection: groupTitle !== "strength" ? 'row' : 'column',
                    // gap: '0.5rem'
                }}>
                    {groupTitle !== "strength" && groupAttributes.filter(attribute => !attribute.endsWith("_diff") && attribute !== "calories").map((metric) => (
                                <Chip
                                    key={metric}
                                    color='primary'
                                    variant={selectOptions.includes(metric) ? "contained": "outlined"}
                                    label={metric.replace(/_/g, ' ')}
                                    onClick={() => handleOptions(metric)}
                                />
                    ))}

                    {groupTitle === "strength" && Object.keys(groupAttributes).map((key) => (
                        <Box key={key}>
                            <Typography onClick={() => setShowSubOptions(prev => !prev)}>
                                <Button>{key.replace(/_/g, ' ')} </Button>
                            </Typography>
                            <Stack direction="column" spacing={1}>
                                {showSubOptions &&
                                    groupAttributes[key].map((metric) => (
                                            <Chip
                                            key={metric}
                                            color='primary'
                                            variant={selectOptions.includes(metric) ? "contained": "outlined"}
                                            label={metric}
                                            onClick={() => handleOptions(metric)}
                                            
                                            />
                                    ))
                                }
                            </Stack>
                        </Box>
                    ))}
                </Stack>
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
