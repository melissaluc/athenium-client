import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  CircularProgress,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { useWorkoutContext } from "../../Contexts/WorkoutContext";
import exercisesData from "../../data/exercises.json";
import { maxHeight } from "@mui/system";
import { TextField, Typography } from "@mui/material";
import { IconButton } from "rsuite";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "80vh",
  //   overflow:'hidden'
};

function ExerciseModal({ workoutDetailForm, handleClose, open }) {
  const { addExercise, updateWorkoutDetails } = useWorkoutContext();
  const [fullExercises] = useState(exercisesData);
  const [activeView, setActiveView] = useState("strength_training");
  const [exercises, setExercises] = useState(exercisesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exercisesData);
  const [selectedCategory, setSelectedCategory] = useState(false);

  const handleView = (category) => {
    setActiveView(category);
    setSelectedCategory(category);
  };

  useEffect(() => {
    setSearchTerm("");
    setFilteredExercises(exercisesData);
    setSelectedCategory(false);
  }, []);

  const handleSearch = () => {
    setSelectedCategory(false);
    const results = Object.entries(fullExercises)
      .map(([group, value]) => {
        const filteredItems = value.filter((item) =>
          item.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Only keep groups that have matching items
        if (filteredItems.length > 0) {
          return {
            [group]: filteredItems,
          };
        }
        return null;
      })
      .filter((group) => group !== null);

    setFilteredExercises(Object.assign({}, ...results));
    console.log(results);
  };

  // const handleKeyPress = (e) => {
  //     if (e.key === 'Enter') {
  //         handleSearch(); // Call the search function when Enter is pressed
  //     }
  // };

  const handleOnClickSelectExercise = (exercise) => {
    console.log("Added exercise to workout: ", exercise);
    addExercise(exercise);
    updateWorkoutDetails(workoutDetailForm);

    handleClose();
  };

  const handleSelectGroup = (group) => {
    setSelectedCategory(group);
    setSearchTerm("");
    setFilteredExercises(fullExercises[group] || []);
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: "0px",
                backgroundColor: "background.paper",
                paddingBottom: "0.5rem",
              }}
            >
              <Stack direction="row" justifyContent={"space-between"}>
                <Typography
                  variant="subtitle1"
                  fontWeight={"bold"}
                  color="primary"
                >
                  SELECT AN EXERCISE
                </Typography>
                {/* <IconButton variant='' onClick={handleClose} ><CloseIcon/></IconButton> */}
                <Button variant="text" onClick={handleClose}>
                  close
                </Button>
              </Stack>
              <Stack direction={"row"} spacing={"1rem"} margin={"1rem 0rem"}>
                <TextField
                  variant="outlined"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ marginBottom: "1rem", flexGrow: 1 }}
                />
                <IconButton
                  disabled={searchTerm === "" ? true : false}
                  size="small"
                  color="primary"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                useFlexGap
                gap="0.5rem"
                paddingBottom="1rem"
                flexWrap="wrap"
              >
                {Object.keys(fullExercises).map((category) => {
                  return (
                    <Chip
                      clickable
                      key={category}
                      size="large"
                      onClick={() => handleSelectGroup(category)}
                      label={category.replace(/_/g, " ")}
                      color={
                        selectedCategory === category ? "primary" : "default"
                      } // Highlight selected category
                    />
                  );
                })}
              </Stack>
              <Divider />
            </Box>
            <Box
              m="1rem"
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              maxHeight="calc(50vh - 2rem)" // Adjust height to fit within the modal
              overflow="auto"
              sx={{
                border: "1px solid #ddd",
                padding: "1rem",
                boxSizing: "border-box", // Ensures padding and border are included in the total width and height
              }}
            >
              {selectedCategory ? (
                <>
                  <Divider>
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      {selectedCategory.toUpperCase()}
                    </Typography>
                  </Divider>
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((item) => {
                      const { exerciseName, imgURL } = item;
                      return (
                        <Box
                          key={exerciseName}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "2rem",
                            cursor: "pointer",
                            width: "100%",
                          }}
                          onClick={() =>
                            handleOnClickSelectExercise({
                              exerciseName,
                              group: selectedCategory,
                              imgURL,
                            })
                          }
                        >
                          <Box>
                            <img src={imgURL} alt={exerciseName} />
                          </Box>
                          <Typography>{exerciseName}</Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography>No exercises found.</Typography>
                  )}
                </>
              ) : (
                <>
                  {exercises !== null && Object.keys(filteredExercises) ? (
                    Object.entries(filteredExercises).map(([group, items]) => {
                      return (
                        <Box key={group} width="100%">
                          <Divider>
                            <Typography variant="subtitle1" fontWeight={"bold"}>
                              {group.toUpperCase()}
                            </Typography>
                          </Divider>
                          {items.map((item) => {
                            const { exerciseName, imgURL } = item;
                            return (
                              <Box
                                key={exerciseName}
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  gap: "2rem",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOnClickSelectExercise({
                                    exerciseName,
                                    group,
                                    imgURL,
                                  })
                                }
                              >
                                <Box>
                                  <img src={imgURL} alt={exerciseName} />
                                </Box>
                                <Typography>{exerciseName}</Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      );
                    })
                  ) : (
                    <CircularProgress />
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ExerciseModal;
