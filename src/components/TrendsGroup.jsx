import { Box, Container, Typography, Button } from "@mui/material"; 
import { useEffect, useState } from "react";
import TrendsGraph from "./TrendsGraph"





function TrendsGroup ({
                        groupTitle,
                        groupAttributes,
                        groupData
                    }){
    


    const [selectMetrics, setSelectMetrics] =useState([])
    const [showOptions, setShowOptions] = useState(false)
    // const [showOptions, setShowOptions] = useState({options: false, suboptions: false})
    const [showSubOptions, setShowSubOptions] = useState(false)
    const [selectOptions, setSelectOptions] = useState(groupAttributes);
    const [toggleGraph, setToggleGraph] = useState(false)



    // const handleAddOption = () => {
    //     if
    // }

    return (

        <Box sx={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <Box  sx={{display:'flex', justifyContent:'space-between'}}>
                <Button fontWeight={'bold'} onClick={()=>{setShowOptions(prev => !prev)}}>
                    {groupTitle.replace(/_/g, " ").toUpperCase()}
                </Button>
                {groupTitle === "nutrition" | groupTitle === "strength" ?
                    <Button onClick={()=>{setToggleGraph(prev => !prev)}}>toggle</Button> : null

                }
            </Box>

            {showOptions && <Box sx={{
                display:'flex', 
                flexWrap: groupTitle!="strength"? 'wrap': 'nowrap', 
                flexDirection:groupTitle!="strength"? 'row': 'column',
                gap:'0.5rem'}}>
                {groupTitle!="strength" && groupAttributes.map((metric)=>{
                    
                    return (
                        <Box key={metric} sx={{border:'1px solid blue', padding:'0.2rem'}} onClick={()=>{}}>
                            <Button>{metric}</Button>
                        </Box>
                    )
                })}
                {
                    groupTitle==="strength" && Object.keys(groupAttributes).map((key)=>{
                        return (
                            <Box key={key}>
                                <Box sx={{border:'1px solid blue', padding:'0.2rem'}} onClick={()=>{setShowSubOptions(prev => !prev)}}>
                                    <Button>{key}</Button>
                                </Box>
                                <Box>
                                    {showSubOptions &&   
                                        groupAttributes[key].map((item)=>{
                                            return (
                                                <Box key={item} sx={{border:'1px solid blue', padding:'0.2rem'}} onClick={()=>{}}>
                                                    <Button>
                                                        {item}
                                                    </Button>
                                                </Box>
                                            )
                                        })
                                        
                                    }
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>}
            <Box>
                
                <TrendsGraph groupTitle={groupTitle} groupData={groupData} selectOptions={selectOptions} toggleGraph={toggleGraph}/>
    
            </Box>
        </Box>
    )
}

export default TrendsGroup;