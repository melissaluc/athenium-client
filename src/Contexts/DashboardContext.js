import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../Contexts/UserDataContext';
import axiosInstance from '../utils/axiosConfig';
import { findClosestData } from '../utils/utils';

// Create context
const DashboardContext = createContext();

// Create provider component
export const DashboardProvider = ({ children }) => {
    const { userData } = useContext(UserDataContext);
    const [selectDate, setSelectDate] = useState(new Date());
    const [measurementData, setMeasurementData] = useState([]);
    const [selectMeasurementData, setSelectMeasurementData] = useState({});
    const [otherData, setOtherData] = useState(null);
    const [openBodyCompDialog, setOpenBodyCompDialog] = useState(false);

    const today = new Date();

    const handleBackDateClick = () => {
        const newDate = new Date(selectDate.getTime() - (24 * 60 * 60 * 1000));
        setSelectDate(newDate);
    };

    const handleForwardDateClick = () => {
        const newDate = new Date(selectDate.getTime() + (24 * 60 * 60 * 1000));
        setSelectDate(newDate);
    };

    const isToday = (date) => {
        return date.toDateString() === today.toDateString();
    };

    const handleClickBodyCompDialogOpen = () => {
        setOpenBodyCompDialog(true);
    };

    const handleBodyCompDialogClose = () => {
        setOpenBodyCompDialog(false);
    };

    useEffect(() => {
        const selectDateOnly = new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate());

        const currentMeasurement = measurementData.filter(measurement => {
            const measurementDateOnly = new Date(measurement.created_on);
            measurementDateOnly.setHours(0, 0, 0, 0);
            return measurementDateOnly.getTime() === selectDateOnly.getTime();
        });

        if (!currentMeasurement.length) {
            const closestMeasurement = findClosestData(selectDate, measurementData);
            setSelectMeasurementData(closestMeasurement);
        } else {
            setSelectMeasurementData(currentMeasurement[0]);
        }
    }, [selectDate, measurementData]);

    useEffect(() => {
        axiosInstance.get(`/measurements`)
            .then(response => {
                setMeasurementData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [userData]);

    useEffect(() => {
        axiosInstance.get(`/dashboard`)
            .then(response => {
                setOtherData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [userData]);

    return (
        <DashboardContext.Provider 
            value={{
                handleBodyCompDialogClose, 
                selectDate, 
                handleBackDateClick, 
                handleForwardDateClick, 
                isToday, 
                selectMeasurementData,
                openBodyCompDialog,
                handleClickBodyCompDialogOpen,
                otherData
            }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
