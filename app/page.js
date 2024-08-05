'use client'
import Image from "next/image"
import styles from "./page.module.css"
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material"
import { collection, getDocs, query, getDoc, deleteDoc, setDoc, doc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item, amount = 1) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity <= amount) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - amount})
      }
    }

    await updateInventory()
  }

  const addItem = async (item, amount = 1) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      console.log(quantity)
      await setDoc(docRef, {quantity: quantity + amount})
    } else {
      await setDoc(docRef, {quantity: amount})
    }

    await updateInventory()
  }

  const handleAddOpen = () => setAddOpen(true)
  const handleAddClose = () => setAddOpen(false)

  const handleRemoveOpen = () => setRemoveOpen(true)
  const handleRemoveClose = () => setRemoveOpen(false)

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box 
      width='100vw' 
      height='100vh' 
      display='flex' 
      justifyContent='center' 
      alignItems='center' 
      gap={2}
      flexDirection='column'
    >
      <Modal open={addOpen} onClose={handleAddClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box 
          position='absolute' 
          top='50%' 
          left='50%' 
          transform='translate(-50%, -50%)'
          width={400}
          bgcolor='white'
          border='2px solid #000'
          boxShadow={24}
          padding={4}
          display='flex'
          flexDirection='column'
          gap={3}
        >
          <Typography variant="h6" component='h2'>Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}  
            />
            <TextField
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => {
                setItemQuantity(parseInt(e.target.value))
              }}  
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemQuantity)
                setItemName('')
                setItemQuantity(0)
                handleAddClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => {
        handleAddOpen()
      }}
      > 
        Add New Item
      </Button>
      <Box border='1px solid #333'>
        <Box
          width='800px'
          height='100px'
          bgcolor='#ADD8E6'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Typography variant="h2" color='#333' textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width='800px' height='300px' spacing={2} overflow='auto'>
          {
            inventory.map(({name, quantity}) => (
              <Box 
                key={name} 
                width='100%' 
                minHeight='150px' 
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                bgcolor='#f0f0f0'
                paddingX={5}
              >
                <Typography variant='h3' color='#333' textAlign='center'>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant='h3' color='#333' textAlign='center'>
                  {quantity}
                </Typography>
                <Stack spacing={2} direction="row">
                  <TextField
                    variant="outlined"
                    value={itemQuantity}
                    placeholder="Quantity"
                    onChange={(e) => {
                      setItemQuantity(parseInt(e.target.value))
                    }}  
                  />
                  <Button variant="contained" onClick={() => addItem(name, itemQuantity)}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name, itemQuantity)}>
                    Remove
                  </Button>
                </Stack>
                {/* <Modal open={removeOpen} onClose={handleRemoveClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <Box 
                    position='absolute' 
                    top='50%' 
                    left='50%' 
                    transform='translate(-50%, -50%)'
                    width={400}
                    bgcolor='white'
                    border='2px solid #000'
                    boxShadow={24}
                    padding={4}
                    display='flex'
                    flexDirection='column'
                    gap={3}
                  >
                    <Typography variant="h6" component='h2'>Update Item</Typography>
                    <Stack width='100%' direction='row' spacing={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={itemQuantity}
                        placeholder="Quantity"
                        onChange={(e) => {
                          setItemQuantity(parseInt(e.target.value))
                        }}  
                      />
                      <Button
                        variant="outlined"
                        onClick={() => {
                          addItem(name, itemQuantity)
                          setItemQuantity(0)
                          handleRemoveClose()
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          removeItem(name, itemQuantity)
                          setItemQuantity(0)
                          handleRemoveClose()
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                </Modal>
                <Button variant="contained" onClick={() => {
                  handleRemoveOpen()
                }}
                > 
                  Update Quantity
                </Button> */}
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
