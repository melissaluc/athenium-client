import { Box, OutlinedInput, FormControl, FormLabel } from '@mui/material';

function MeasurementInput({ inputs, handleInputChange, handleInputClick, side }) {
    return (

        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems:'center',
            gap:"-2rem"
            }}>
            {Object.entries(inputs).map(([label, value]) => (
                <FormControl key={label} sx={{ marginBottom: '0.5rem', height: '3rem',}}>
                    <FormLabel
                        
                        sx={{
                            fontSize: '0.7rem',
                            paddingBottom: '0.1rem',
                            // marginBottom: '-0.8rem',
                            // marginRight: '0.5rem',
                            textAlign: 'center'
                        }}
                    >
                        {label}
                    </FormLabel>
                    <OutlinedInput
                        inputProps={{
                            min: 0, 
                            style: { 
                                textAlign: 'center',
                                
                            }}}
                        onClick={() => handleInputClick(label)}
                        size="small"
                        // variant="outlined"
                        value={value}
                        onChange={(e) => handleInputChange(side, label, e.target.value)}
                        sx={{ fontSize: '0.6rem', width: '3.5rem', height: '1rem' }}
                    />
                </FormControl>
            ))}
        </Box>

    );
}

export default MeasurementInput;
