
import { useParams, useNavigate } from "react-router-dom";
import { Button, Box, Container, Stack, Typography, Menu, MenuItem} from "@mui/material";
import { useStrengthLevelContext } from "../Contexts/StrengthLevelContext";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { getProgressColour } from '../utils/utils'
import {
    GridRowModes,
    DataGrid,
    useGridApiRef,
    GRID_DATE_COL_DEF,
    getGridDateOperators,
  } from '@mui/x-data-grid';
import { useTheme } from "@mui/system";
import PageLoadingProgress from "../components/Loading/Progress/PageLoadingProgress";
import { v4 as uuidv4 } from 'uuid'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import InputBase from '@mui/material/InputBase';
// import { enUS as locale } from 'date-fns/locale';
// import { styled } from '@mui/material/styles';
// const dateAdapter = new AdapterDateFns({ locale });


function ToolBar(props) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl);
    


    const handleCloseActions = () => {
        setAnchorEl(null);
    };

    const handleOpenActions = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelectActions = (action) => {
        if (action === 'delete-records') {
            console.log('delete records');
            props.deleteSelectRecords()
        } else if (action === 'add-record') {
            props.handleAddRecord ()
            console.log('add record');
        }
        handleCloseActions(); 
    };

    const handleSave = () =>{
        console.log('Handling save')
        props.saveChanges()
    }

 

    return(

        <Stack direction='row' justifyContent={'space-between'}>
            { 
                props.editMode ?
                <>
                    <Stack direction={'row'}>
                        <Button color="primary" onClick={props.handleCancel}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Stack>
                    <Button 
                        aria-controls={open ? "strength-log-actions" : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleOpenActions}
                        >
                            Actions
                    </Button>
                        <Menu id="strength-log-actions" 
                            anchorEl={anchorEl} 
                            open={open} 
                            onClose={handleCloseActions}
                            autoFocusItem={open}
                            >
                            <MenuItem onClick={()=>handleSelectActions('add-record')}>Add Record</MenuItem>
                            <MenuItem onClick={()=>handleSelectActions('delete-records')}>Delete Records</MenuItem>
                        </Menu>
                </> :
                <Button color="primary" onClick={props.handleSetEditMode}>
                    Edit
                </Button>
            }
        </Stack>

    )
}




function ExerciseStrengthLog () {
    const { exercise_name } = useParams();
    const navigate = useNavigate()
    const {getExerciseRecords, exerciseLogRecords, deleteExercise, toggleView, updateRecords} = useStrengthLevelContext();
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState(exerciseLogRecords || [])
    const [originalRows, setOriginalRows] = useState(exerciseLogRecords || [])
    const [selectedCellParams, setSelectedCellParams] = useState(null);
    const [cellModesModel, setCellModesModel] = useState({});
    const [editMode, setEditMode] = useState(false)
    const theme = useTheme()
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const apiRef = useGridApiRef();
    const [loading, setLoading] = useState(true)
    const [unsavedRecords, setUnsavedRecords] = ([])
    const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const unsavedChangesRef = useRef({
        unsavedRows: {},
        rowsBeforeChange: {},
        addedRecords:[],
        deletedRecords:[]
    });

    useEffect(() => {
        if (exerciseLogRecords) {
            setRows([...exerciseLogRecords]);
            setOriginalRows([...exerciseLogRecords]);
            setLoading(false); // Data is now available
        } else {
            setLoading(true); // Data is not yet available
        }
    }, [exerciseLogRecords]);

    // const handleCellFocus = useCallback((event) => {
    // const row = event.currentTarget.parentElement;
    // const date = row.dataset.id;
    // const field = event.currentTarget.dataset.field;
    // setSelectedCellParams({ date, field });
    // }, []);
  
    // const cellMode = useMemo(() => {
    //   if (!selectedCellParams) {
    //     return 'view';
    //   }
    //   const { id, field } = selectedCellParams;
    //   return cellModesModel[id]?.[field]?.mode || 'view';
    // }, [cellModesModel, selectedCellParams]);
  


    const handleSetEditMode = () => {
        setEditMode(prev=>!prev)
      }
      
    const handleDeleteExercise = async () => {
        try {
            const exerciseDeleted = await deleteExercise(exercise_name)
            setRows(prev => { 
                const oldData = prev 
                oldData.filter(record => record.exercise_name === exerciseDeleted)
            })
            
            navigate('/strength', { state: { view: toggleView } });

        } catch (error) {
            console.error(error)
        }


    }


    const discardChanges  = useCallback(() => {
        console.log('cancel', unsavedChangesRef.current.rowsBeforeChange)
        if(Object.keys(unsavedChangesRef.current.rowsBeforeChange).length >0){
            setRows(originalRows);
            setRowModesModel({});
            setHasUnsavedRows(false);
    
            Object.values(unsavedChangesRef.current.rowsBeforeChange).forEach((row) => {
                apiRef.current.updateRows([row]);
              });
            unsavedChangesRef.current = {
                unsavedRows: {},
                rowsBeforeChange: {},
            };
        }
        setEditMode(false)
        console.log('editMode: ',editMode)
    }, [apiRef]);


    const handleAddRecord = () => {
        console.log('add record: ',unsavedChangesRef.current.addedRecords)
        const id = uuidv4()
        const isoString = (new Date().toISOString()).split('T')[0]
        const newRecord = { uid: id, created_on: isoString, strength_level: 'TBD', one_rep_max:'TBD', category:'strength', exercise_name ,group:rows[0]?.group || '', body_weight:0  , lift:0, reps: 0, sets: 0, isNew: true }
        setRows((oldRows) => [newRecord,...oldRows]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [id]: { mode: GridRowModes.Edit, fieldToFocus: 'created_on' },
        }));
        const newAddedRecords = [
            newRecord,
            ...unsavedChangesRef.current.addedRecords || []
        ]
        unsavedChangesRef.current.addedRecords = newAddedRecords

      };

    // 

    const saveChanges = useCallback(async () => {
        console.log('Entering saveChanges')
        try {
            // Persist updates in the database
            setIsSaving(true);
            console.log('Save changes: ', unsavedChangesRef.current, exercise_name)
            await updateRecords(unsavedChangesRef.current, exercise_name)

            setHasUnsavedRows(false);
            unsavedChangesRef.current = {
                    unsavedRows: {},
                    rowsBeforeChange: {},
                };
            handleSetEditMode()
        } catch (error) {
            setIsSaving(false);
            console.log('Save changes: failed')
        } finally {
            setIsSaving(false);
        }
    }, [apiRef]);

    const handleGetSelectedRows = () => {
        if (apiRef.current) {
            const selectedRowsMap = apiRef.current.getSelectedRows();
            console.log('Selected Rows:', selectedRowsMap);
            const selectedRowsArray = Array.from(selectedRowsMap.values());
            const arrayId = selectedRowsArray.map(row => row.uid)
            return arrayId
        }

        return []
    }

    const deleteSelectRecords = () => {
        const deleteRows = handleGetSelectedRows()
        console.log('deleteSelectRecords: ', deleteRows)
        setRows(prevRows => 
            prevRows.filter(row => !deleteRows.includes(row.uid))
        );

        const deltedRecords = [
            ...unsavedChangesRef.current.deletedRecords,
            ...deleteRows
        ]

        unsavedChangesRef.current.deletedRecords = deltedRecords
    }

    const updateRow = (updatedRow, originalRow) => {
        
        const rowId = updatedRow.uid;

        unsavedChangesRef.current.unsavedRows[rowId] = updatedRow;
        if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
        unsavedChangesRef.current.rowsBeforeChange[rowId] = originalRow;
        }

        setRows(prevRows => {
            // Find the index of the row to be updated
            const index = prevRows.findIndex(row => row.uid === rowId);
    
            // Replace the old row with the updated row
            if (index > -1) {
                return [
                    updatedRow,
                    ...prevRows.slice(0, index),
                    ...prevRows.slice(index + 1)
                ];
            }
            return [updatedRow, ...prevRows];
        });

        setHasUnsavedRows(true);
        return updatedRow;
    }


    useEffect(()=>{
        getExerciseRecords(exercise_name)
        console.log(exerciseLogRecords)
    },[exercise_name])


    // const dateColumnType = {
    //     ...GRID_DATE_COL_DEF,
    //     resizable: false,
    //     renderEditCell: (params) => {
    //       return <GridEditDateCell {...params} />;
    //     },
    //     filterOperators: getGridDateOperators(false).map((item) => ({
    //       ...item,
    //       InputComponent: GridFilterDateInput,
    //       InputComponentProps: { showTime: false },
    //     })),
    //     valueFormatter: (value) => {
    //       if (value) {
    //         return dateAdapter.format(value, 'keyboardDate');
    //       }
    //       return '';
    //     },
    //   };
      

    const dataColumns = [
        { 
            field: 'uid', 
            headerName: 'uid',
            editable: false,
            align: 'left',
            headerAlign: 'left',
        },
        { 
            field: 'created_on', 
            description: 'Date strength level determined on',
            headerName: 'Date',
            valueFormatter: (params) => params.split('T')[0],
            editable: editMode,
            align: 'left',
            headerAlign: 'left',
            // ...(editMode ? dateColumnType : {})
        },
        {
          field: 'strength_level',
          description: 'Strength level classification',
          headerName: 'LVL',
          cellClassName: 'strength-level-theme--cell',
        //   width: 100,
          editable: false,
          renderCell: (params) => (
            <Box
                sx={{
                    backgroundColor:  getProgressColour(params.value, theme),
                    color: params.value === 'TBD' ? '#505050' : '#ffffff',
                    borderLeft: 'none',
                    borderRight: 'none',
                    textAlign:'center',
                    padding:0,
                    margin:0,
                    width:'100%'


                }}
            >
                {params.value}
            </Box>
        ),
        },
        {
          field: 'body_weight',
          description: 'Body weight at time of calculation',
          headerName: 'BW',
          type: 'number',
          editable: editMode,
          align: 'left',
          headerAlign: 'left',
          hideable:true,
          renderCell: (params) => (
            params.value
            )
        },
        {
          field: 'category',
          description: 'exercise category',
          headerName: 'Category',
          editable: editMode,
          align: 'left',
          headerAlign: 'left',
          hideable:true,
          renderCell: (params) => (
            params.value
            )
        },
        {
          field: 'group',
          description: 'exercise group',
          headerName: 'Group',
          editable: editMode,
          align: 'left',
          headerAlign: 'left',
          hideable:true,
          renderCell: (params) => (
            params.value
            )
        },
        {
          field: 'one_rep_max',
          description: 'Estimated one rep max',
          headerName: '1RM',
          type: 'number',
          editable: false,
          align: 'left',
          headerAlign: 'left',
        },
        {
          field: 'lift',
          description: 'Lift mass or assisted mass or extra mass added',
          headerName: 'Lift',
          type: 'number',
          editable: editMode,
          align: 'left',
          headerAlign: 'left',
          renderCell: (params) => (
            params.value
            )
        },
        {
          field: 'reps',
          headerName: 'Reps',
          type: 'number',
          editable: editMode,
          align: 'left',
          headerAlign: 'left',
          renderCell: (params) => (
            params.value
            )
        },
        {
          field: 'sets',
          headerName: 'Sets',
          type: 'number',
          editable: editMode,
          align: 'left',
          headerAlign: 'left',
          renderCell: (params) => (
            params.value
            )
        },

      ];

      useEffect(()=>{
        console.log('unsavedChangesRef: ',unsavedChangesRef.current)
      },[unsavedChangesRef])

      if (loading) {
        return  <PageLoadingProgress/>
      }

      return (
        <Container sx={{ display: 'flex', flexDirection: 'column', width:'100%'}}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mt='1rem'>
                {exercise_name && <Typography fontWeight={'bold'}>{exercise_name}</Typography>}
                {editMode && <Button variant='contained' onClick={handleDeleteExercise}>Delete</Button>}
            </Stack>
            <ToolBar editMode={editMode} handleSetEditMode={handleSetEditMode} handleCancel={discardChanges} handleAddRecord={handleAddRecord } saveChanges={saveChanges} deleteSelectRecords={deleteSelectRecords} isSaving={isSaving}/>
            <Box sx={{ 
                width:'100%',
         }}>
           <DataGrid
                apiRef={apiRef} 
                rows={rows}
                getRowId={(row) => row.uid}
                columns={dataColumns}
                checkboxSelection={editMode}
                columnVisibilityModel={{uid:false, category:false, group:false}}
                processRowUpdate={(updatedRow, originalRow) =>
                    updateRow(updatedRow, originalRow)
                  }
                disableRowSelectionOnClick
                autosizeOnMount
                slots={{
                // toolbar: ToolBar,
                loadingOverlay: {
                    variant: 'linear-progress',
                    noRowsVariant: 'skeleton',
                  },
                }}
                slotProps={{
                toolbar: {
                    // cellMode,
                    selectedCellParams,
                    setSelectedCellParams,
                    cellModesModel,
                    setCellModesModel,
                },
                cell: {
                    // onFocus: handleCellFocus,
                },
                }}
            />
            </Box>
        </Container>
      );
}

export default ExerciseStrengthLog;

