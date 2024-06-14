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
                <FormControl key={label} sx={{ marginBottom: '0.5rem', height: '3rem', }}>
                    <FormLabel
                        sx={{
                            fontSize: '0.7rem',
                            paddingBottom: '0.1rem',
                            textAlign: 'center',
                        }}
                    >
                        {label}
                    </FormLabel>
                    <OutlinedInput
                        inputProps={{
                            min: 0,
                            style: {
                                textAlign: 'center',
                            }
                        }}
                        onClick={() => handleInputClick(label)}
                        size="small"
                        value={value === 0 ? "" : value}
                        onChange={(e) => handleInputChange(side, label, parseFloat(e.target.value))}
                        type="number"
                        sx={{
                            width: '4rem',
                            height: '2rem',
                            fontSize: '0.5rem',
                        }}
                    />
                </FormControl>
            ))}
        </Box>
    );
}

export default MeasurementInput;
