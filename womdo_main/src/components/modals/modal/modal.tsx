import React, { ReactNode } from 'react'
import { Modal } from 'react-bootstrap'

type TProps = {
    className?: string,
    show: boolean,
    handleClose: () => void,
    title?: string,
    children?: ReactNode,
}

const CustomModal = (props: TProps) => {
    return (
        <>
            <Modal
                centered
                className={`custom_modal ${props.className || ""}`}
                show={props.show}
                onHide={props.handleClose}
            >
                {
                    props.title &&
                    <Modal.Header closeButton>
                        <Modal.Title>{props.title}</Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CustomModal
