import { Box, Container, Stack} from "@mui/material"; 
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SortPopover from "../components/Popovers/SortPopover";
import WorkoutCard from "../components/Cards/WorkoutCard/WorkoutCard";
import WorkoutModal from "../components/Modals/WorkoutModal"
import {IconButton ,InputBase ,Divider} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";


import { useWorkoutContext } from '../Contexts/WorkoutContext';


function WorkoutPage(){
    const {activeViewWorkoutData, onFilter, onSort} = useWorkoutContext();
    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (value) => {
        console.log('Searching for workout name like: ', value);
        onFilter(value);
    };

    const onChange = (e) => {
        const newSearchValue = e.target.value;
        setSearchValue(newSearchValue);

        if (newSearchValue === '') {  
            handleSearch(''); 
        }
    };

    return (
        <Container sx={{display:'flex', flexDirection:'column', alignItems:'center', gap:'2rem', maxWidth:'500px', pb:'2vh'}}>
            <Box sx={{ width:'100%', padding:'2%', display:'flex', justifyContent:'center'}}>
                <WorkoutModal buttonText={'+ Add Workout'}/>
            </Box>

            {/* Filter + sort */}
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
                <Box
                    fullWidth
                    component="form"
                    sx={{ border:'1px gray solid', borderRadius:'20px', p: '2px 4px', display: 'flex', alignItems: 'center',flex: 1 }}
                    >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search for a Workout"
                        onChange={onChange}
                        inputProps={{ 'aria-label': 'Search for a workout' }}
                        value={searchValue}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={()=>handleSearch(searchValue)}>
                        <SearchIcon />
                    </IconButton>
                </Box>
                <SortPopover buttonDisplay={<SwapVertIcon/>} onSort={onSort}/>
            </Box>
            <Stack spacing={2} width='100%'>
                {activeViewWorkoutData.map((workout)=>{
                    return <WorkoutCard key={workout.workout_id} workout={workout}/>

                })

                }
            </Stack>


    
        </Container>
    )

}

export default WorkoutPage;