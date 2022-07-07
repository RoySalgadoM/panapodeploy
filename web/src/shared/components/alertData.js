import React, { useState } from 'react'
import { Alert } from "react-bootstrap";

export const AlertData = ({ title }) => {

    return (
        <>
            <Alert variant="danger" style={{ width: "100%" }} className="text-center">
            {title}
            </Alert>
        </>
    );
}