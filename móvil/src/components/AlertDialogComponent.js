
import React from 'react'
import { Button, AlertDialog, Text } from "native-base";

export default function AlertDialogComponent(props) {
    const {isOpen, setIsOpen, header, body, action} = props;
    const submit =()=>{
      action()
      setIsOpen(false)
    }
    const onClose =()=>{
        setIsOpen(false)
    }
  return (
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.Body>
              {body}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button  colorScheme="gray" onPress={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={submit}>
                Aceptar
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
  )
}