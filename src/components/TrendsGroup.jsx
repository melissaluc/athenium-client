import { Box, Button, IconButton, Chip, Stack, Typography, ListItem, Paper } from "@mui/material"; 
import { useEffect, useState } from "react";
import TrendsGraph from "./TrendsGraph";
import { useTheme } from "@emotion/react";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircleIcon from '@mui/icons-material/Circle';


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
                <Paper 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        boxShadow:'none',
                        m: 0,
                    }}
                >
                    {groupTitle !== "strength" && groupAttributes.filter(attribute => !attribute.endsWith("_diff") && attribute !== "calories").map((metric) => {
                       const chipColor = theme.palette?.[groupTitle]?.[metric] || 'primary';
                       return <Chip
                                        key={metric}
                                        // icon={<CircleIcon sx={{color:chipColor}}/>}
                                        variant={selectOptions.includes(metric) ? "contained": "outlined"}
                                        label={metric.replace(/_/g, ' ')}
                                        onClick={() => handleOptions(metric)}
                                        sx={{
                                            color:chipColor,
                                            fontFamily:'silkscreen',
                                            border:`1px solid ${chipColor}`
                                        }}
                                    />
      
                    }
                    )}

                    {groupTitle === "strength" && Object.keys(groupAttributes).map((key) => (
                        <Box key={key}>
                            <Button 
                                startIcon={<CircleIcon sx={{color:theme.palette?.[groupTitle]?.[key]}}/>}
                                onClick={() => setShowSubOptions(prev => !prev)}>{key.replace(/_/g, ' ')} </Button>
                            <Stack direction="column" spacing={1}>
                                {showSubOptions &&
                                    groupAttributes[key].map((metric) => {
                                            return <Chip
                                            key={metric}
                                            color='primary'
                                            variant={selectOptions.includes(metric) ? "contained": "outlined"}
                                            label={metric}
                                            onClick={() => handleOptions(metric)}
                                            
                                            />
                                })
                                }
                            </Stack>
                        </Box>
                    ))}
                </Paper>
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
