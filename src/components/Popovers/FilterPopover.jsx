import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Popover, Button, Box, ClickAwayListener } from '@mui/material';

function FilterPopover({ data, buttonDisplay, onFilter }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [lastFilteredValue, setLastFilteredValue] = useState('');
    const [filterValue, setFilterValue] = useState(lastFilteredValue);

    useEffect(() => {
        setFilterValue(lastFilteredValue);
    }, [lastFilteredValue]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setLastFilteredValue(filterValue);
    };

    const handleClickAway = () => {
        handleClose();
    };

    const handleInputChange = (event, value) => {
        setFilterValue(value);
        onFilter(value);
    };

    const workoutNames = data.map((item) => item.workout_name);

    return (
        <Box>
            <Button onClick={handleClick}>
                {buttonDisplay}
            </Button>
            <Popover
                id="filter-popover"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Stack
                        sx={{
                            width: '70vw',
                            height: 'auto',
                            paddingTop: '1rem',
                        }}
                    >
                        <Autocomplete
                            value={filterValue}
                            onInputChange={handleInputChange}
                            options={workoutNames}
                            renderInput={(params) => (
                                <TextField {...params} label="Search Workout Name" variant="outlined" />
                            )}
                        />
                    </Stack>
                </ClickAwayListener>
            </Popover>
        </Box>
    );
}

export default FilterPopover;
