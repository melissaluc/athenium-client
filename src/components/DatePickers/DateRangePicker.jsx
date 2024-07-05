import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Box, Button } from "@mui/material";

function DateRangePicker({ handleSelectDate, handleClose }) {
    const initialDateRange = [
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ];

    const [dateRange, setDateRange] = useState(initialDateRange);

    const handleSelectRange = (ranges) => {
        if (ranges.selection) {
            setDateRange([ranges.selection]);
        }
    };

    const handleCancel = () => {
        // Reset dateRange state
        setDateRange(initialDateRange);

        // Close the DateRangePicker
        if (handleClose) {
            handleClose();
        }
    };

    const handleSetDateRange = () => {
        // Call handleSelectDate with the selected date range
        if (handleSelectDate) {
            handleSelectDate({
                start: dateRange[0].startDate,
                end: dateRange[0].endDate
            });
        }

        // Close the DateRangePicker
        if (handleClose) {
            handleClose();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems:'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <DateRange
                    editableDateInputs
                    onChange={handleSelectRange}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width:'50%', marginTop: '10px' }}>
                <Button onClick={handleSetDateRange}>Set Date Range</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </Box>
        </Box>
    );
}

export default DateRangePicker;
