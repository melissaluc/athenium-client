import React, { createContext, useState, useEffect } from 'react';


const MeasurementContext = createContext();

const MeasurementProvider = ({ children }) => {
    const [measurements, setMeasurements] = useState([]);

    useEffect(() => {
        // Get log from backend
    }, []);

    // CRUD operations
    const addMeasurement = async (newMeasurement) => {
        // Handle adding Measurement
    };

    const updateMeasurement = async (updatedMeasurement) => {
        // Handle updating Measurement
    };

    const deleteMeasurement = async (id) => {
        // Handle deleting Measurement
    };

    return (
        <MeasurementContext.Provider value={{ measurements,addMeasurement, updateMeasurement, deleteMeasurement }}>
            {children}
        </MeasurementContext.Provider>
    );
};

export { MeasurementContext, MeasurementProvider };
