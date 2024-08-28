import {Box, Divider, Typography} from '@mui/material'
import { styled } from '@mui/system';

function SectionDivider ({sectionName}) {
    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));
    return (
        <Root>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="body1" sx={{ flexShrink: 0}}>
            {sectionName}
            </Typography>
            <Divider
                sx={{ flexGrow: 1, marginLeft: 1 }} 
                orientation="horizontal"
                component="div"
                role="presentation"
                aria-hidden="true"
            /></Box>
        </Root>
    )
}

export default SectionDivider;