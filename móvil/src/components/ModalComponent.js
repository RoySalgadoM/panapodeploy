import React from 'react'
import { Center, Modal, FormControl, Input, Button, Text } from 'native-base';

export default function ModalComponent(props) {
    const { showModal, setShowModal, content, header, formik, showButtonConfirm } = props;

    return (
        <Center>
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
            }}>
                <Modal.Content width={"90%"}>
                    <Modal.Header bg={"#042B61"}><Text color={"white"}>{header}</Text></Modal.Header>
                    <Modal.Body>
                        {content}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button bg={"#6c757d"} onPress={() => {
                                setShowModal(false);
                            }}>
                                <Text color={"white"}>Cerrar</Text>
                            </Button>
                            {showButtonConfirm ? <Text></Text> : <Button bg={"#042B61"} onPress={formik.handleSubmit} disabled={!(formik.isValid && formik.dirty)}>
                                <Text color={"white"}>Confirmar</Text>
                            </Button>}
                            
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center>
    )
}