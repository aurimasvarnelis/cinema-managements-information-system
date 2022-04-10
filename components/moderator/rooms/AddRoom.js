import { Button, Col, Container, Row, Modal, Form, Table, Image, Stack, InputGroup, FormControl, DropdownButton, Dropdown } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next';

export function AddRoom() {
  // Model state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Validation
  const [validated, setValidated] = useState(false);
  // Form hook
  const { register, handleSubmit, reset } = useForm();
  
  const cinemaId = getCookie('cinemaId')

  // Refreshing page after updating data
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([{
    id: 0,
    status: "available"
  }]);

  // post data using form data and rows
  const postData = async (data) => {
    data.rows = rows;
    const res = await fetch(`/api/cinemas/${cinemaId}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    // Check that our status code is in the 200s,
    // meaning the request was successful.
    if (res.status < 300) {
      refreshData();
    }
    // const resData = await res.json()
    // console.log(resData)
  }

  const onSubmit = (data, event) => {
    const form = event.target;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      postData(data);
      //handleClose();
      reset();
      setValidated(false);
    }
    //alert(`Room ${data.name} has been added.`)
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length,
        columns: columns.map(column => ({
          id: column.id,
          status: "available"
        }))
      }
    ])
  }

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        id: columns.length,
        status: "available"
      }
    ])
    handleAddColumnToAllRows()
  }

  const handleRemoveRow = () => {
    setRows(rows.slice(0, rows.length - 1))
  }

  const handleRemoveColumn = () => {
    setColumns(columns.slice(0, columns.length - 1))
    handleRemoveColumnFromAllRows()
  }

  const handleAddColumnToAllRows = () => {
    setRows(rows.map(row => {
      return {
        ...row,
        columns: [
          ...row.columns,
          {
            id: row.columns.length,
            status: "available"
          }
        ]
      }
    }))
  }

  const handleRemoveColumnFromAllRows = () => {
    setRows(rows.map(row => {
      return {
        ...row,
        columns: row.columns.slice(0, row.columns.length - 1)
      }
    }))
  }

  return (
    <>
      <Button className="my-3" variant="success" onClick={handleShow}>
          <div className="p-1 d-inline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
          </div>
          <div className="p-1 d-inline">
            Add a room
          </div>
      </Button>
      
      <Modal size="lg" show={show} onHide={() => {handleClose(); setValidated(false);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a room</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
        <Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="validationName">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" placeholder="Room name"{...register("name")}/>
          </Form.Group>
        </Form>
        
        <Container fluid>
          {/* <AddRow rows={rows} setRows={setRows} /> */}
          <Button onClick={handleAddRow}>
            Add row
          </Button>

          <Button onClick={handleRemoveRow}>
            Remove row
          </Button>

          <Button onClick={handleAddColumn}>
            Add column
          </Button>

          <Button onClick={handleRemoveColumn}>
            Remove column
          </Button>

          <Container>
            {rows.map((row, idx) => (
              <Stack direction="horizontal" gap={2} key={idx} >
              <div>{idx + 1}</div>
                {row.columns.map((column, idx) => (
                  <div key={idx}>             
                    {row.id === rows.length - 1 && <div>{column.id + 1}</div>}
                    {/* {idx === 0 && <div>{column.id}</div>} */}
                  
                    <div onClick={() => {
                      if (column.status === "available"){
                        row.columns[idx].status = "unavailable"
                        setRows([...rows])
                      } else {
                        row.columns[idx].status = "available"
                        setRows([...rows])
                      }                   
                    }
                    }>
                    {row.columns[idx].status === "unavailable" ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" className="bi bi-circle-fill" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="12"/>
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="green" className="bi bi-circle-fill" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="12"/>
                      </svg>
                    }
                    </div>
                    {/* <Image
                      className="d-block w-100"
                      src="/armchair-seat.svg"
                      alt="seat"
                      width="30px"
                      height="30px"
                    /> */}
                  </div>       
                ))}
              </Stack>
            )).reverse()}
          </Container>    
        </Container>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" form="hook-form">
              Submit
          </Button>
        </Modal.Footer>
      </Modal>        
    </>   
  )
}

function AddRow({ rows, setRows }) {
  return(
    <Button onClick={handleAddRow}>
      Add row
    </Button>
  )
}

function AddColumn() {
  return(
    <Button>
      Add column
    </Button>
  )
}