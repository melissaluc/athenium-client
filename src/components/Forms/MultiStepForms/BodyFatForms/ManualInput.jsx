import { Typography, Box} from "@mui/material";
import CustomInput from "../../InputFields/CustomInput";

function ManualInput({data, handleChange}) {



   return (
            <Box width='80%'>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>MANUAL INPUT</Typography>
            <CustomInput 
                    fieldName={'body_fat_percentage'}
                    inputLabel={'BF'}
                    options={null}
                    addStyle={{marginBottom:'2vh'}}
                    id={'body-mass'}
                    placeholderText={'Enter your Body Fat %'} 
                    defaultValue={'%'}
                    inputValue={data.body_fat_percentage}
                    onChange={handleChange}
                    />
        </Box>
   )
}

export default ManualInput;
