"use client"; 

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/material';

export default function FullWidthTextField() {
   const [fields, setFields] = React.useState([{ url: '' }])

   const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newField = [...fields] 
    newField[index].url = e.target.value

    setFields(newField)
   }

   const renderItems = () => {
    return fields.map(({ url }, i) => {
        <TextField fullWidth label="url" id="url" value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnchange(e, i)} />
    })
   }
  return (
    <Container style={{ height: '100vh', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ marginBottom: '20px', fontSize: '40px' }}> add urls</h1>
        <Box>
            <TextField fullWidth label="url" id="url" />
        </Box>
    </Container>
  );
}