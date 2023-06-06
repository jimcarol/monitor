"use client"; 

import { Container } from '@material-ui/core'
import Index from '../components/home'

export default function Home() {
  return (
    <Container maxWidth={false} style={{ padding: '20px', minHeight: "100vh"}}>
        <Index />
    </Container>
  )
}
