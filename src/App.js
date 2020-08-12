import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {createContact , db} from './Firebase/firebase'
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

const data = [
  { id: 1, personaje: "Naruto", anime: "Naruto" },
  { id: 2, personaje: "Goku", anime: "Dragon Ball" },
  { id: 3, personaje: "Kenshin Himura", anime: "Rurouni Kenshin" },
  { id: 4, personaje: "Monkey D. Luffy", anime: "One Piece" },
  { id: 5, personaje: "Edward Elric", anime: "Fullmetal Alchemist: Brotherhood"},
  { id: 6, personaje: "Seto Kaiba", anime: "Yu-Gi-Oh!" },
];

class App extends React.Component {
  state = {
    data: data,
    modalActualizar: false,
    contacts : [],
    modalInsertar: false,
    form: {
      firstName : "" , lastName : "" , email : "" , phone : ""
    },
  };

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  setData = (data) => {
    this.setState({contacts : [...this.state.contacts , ...data]})
  }
  componentDidMount(){
    let _ = this
    db.collection("contacts")
    .onSnapshot(function(querySnapshot) {
        let contacts = [];
        querySnapshot.docChanges()
        .forEach(data => {
          data.doc.data()
          console.log(data.doc)
          contacts.push({...data.doc.data() , id: data.doc.id})
          console.log(data.doc.data())
        })
       _.setData(contacts)
        console.log("Current cities in contacts: ",contacts);
    });
  }

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  editar = async (dato) => {
    console.log(dato)
    const update = db.collection('contacts').doc(dato.id);
    delete dato['id']
    await update.update(dato);

    // var contador = 0;
    // var arreglo = this.state.data;
    // arreglo.map((registro) => {
    //   if (dato.id == registro.id) {
    //     arreglo[contador].personaje = dato.personaje;
    //     arreglo[contador].anime = dato.anime;
    //   }
    //   contador++;
    // });
    this.setState({ modalActualizar: false });
  };

  eliminar = async (dato) => {
    var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento "+dato.id);
    if (opcion == true) {
      const res = await db.collection('contacts').doc(dato.id).delete()
      var contador = 0;
      var arreglo = this.state.data;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ data: arreglo, modalActualizar: false });
    }
  };

  insertar= ()=>{
    var valorNuevo= {...this.state.form};
    console.log('=================' , this.state.form)
    createContact(this.state.form.firstName , this.state.form.lastName , this.state.form.email , this.state.form.phone)
      .then(res => {
        this.setState({ modalInsertar: false });
        console.log(res.id)
      })
      .catch(err => {
        this.setState({ modalInsertar: false });
        console.log(err)
      })
    // valorNuevo.id=this.state.data.length+1;
    // var lista= this.state.data;
    // lista.push(valorNuevo);
  }

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    
    return (
      <>
        <Container>
        <br />
          <Button color="success" onClick={()=>this.mostrarModalInsertar()}>Crear</Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>No</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.contacts.map((dato , index) => (
                <tr key={dato.id}>
                  <td>{index + 1}</td>
                  <td>{dato.firstName}</td>
                  <td>{dato.lastName}</td>
                  <td>{dato.email}</td>
                  <td>{dato.phone}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >
                      Editar
                    </Button>{" "}
                    <Button color="danger" onClick={()=> this.eliminar(dato)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
               Id:
              </label>
            
              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.form.id}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                First Name: 
              </label>
              <input
                className="form-control"
                name="firstName"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.firstName}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Last Name: 
              </label>
              <input
                className="form-control"
                name="lastName"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.lastName}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Email 
              </label>
              <input
                className="form-control"
                name="email"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.email}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Phone: 
              </label>
              <input
                className="form-control"
                name="phone"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.phone}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.editar(this.state.form)}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
           <div><h3>Insertar Personaje</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                First Name: 
              </label>
              <input
                className="form-control"
                name="firstName"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Last Name: 
              </label>
              <input
                className="form-control"
                name="lastName"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                email: 
              </label>
              <input
                className="form-control"
                name="email"
                type="email"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                phone: 
              </label>
              <input
                className="form-control"
                name="phone"
                type="tel"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.insertar()}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default App;
