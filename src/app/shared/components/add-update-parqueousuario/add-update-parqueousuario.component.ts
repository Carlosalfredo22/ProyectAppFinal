import { Component, inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';

interface Parqueo {
  idCliente: number; // Agregado el campo idCliente
  nombre: string;
  codigoIngreso: string;
  colorAutomovil: string;
  numeroPlaca: number;
  horaEntrada: string;
  horaSalida: string;
}

@Component({
  selector: 'app-add-update-parqueousuario',
  templateUrl: './add-update-parqueousuario.component.html',
  styleUrls: ['./add-update-parqueousuario.component.scss'],
})
export class AddUpdateParqueousuarioComponent{

  idCliente: number; // Añadido el campo idCliente
  nombre: string;
  codigoIngreso: string;
  colorAutomovil: string;
  numeroPlaca: number;
  horaEntrada: string;
  horaSalida: string;
  parqueosCollection: AngularFirestoreCollection<Parqueo>;
  usuarios: Parqueo[];

  //Para llamar a la modal
  utilsSvc = inject(UtilsService);

  constructor(private firestore: AngularFirestore) {
    this.parqueosCollection = this.firestore.collection<Parqueo>('parqueos');
    this.parqueosCollection.valueChanges().subscribe(data => {
      this.usuarios = data;
    });
  }

    guardarDatos() {
      // Guardar datos en Firestore
      this.parqueosCollection.add({
        idCliente: this.idCliente,
        nombre: this.nombre,
        codigoIngreso: this.codigoIngreso,
        colorAutomovil: this.colorAutomovil,
        numeroPlaca: this.numeroPlaca,
        horaEntrada: this.horaEntrada,
        horaSalida: this.horaSalida
      }).then(() => {
        alert('Datos guardados correctamente en Firestore');
        // Limpiar los campos del formulario después de guardar los datos
        this.idCliente = null;
        this.nombre = '';
        this.codigoIngreso = '';
        this.colorAutomovil = '';
        this.numeroPlaca = null;
        this.horaEntrada = '';
        this.horaSalida = '';
      }).catch(error => {
        alert('Error al guardar los datos en Firestore: ' + error);
      });
  }

  eliminarUsuario(usuario: Parqueo) {
    const idCliente = usuario.idCliente;

    // Buscar y eliminar el documento con el idCliente correspondiente de Firestore
    this.parqueosCollection.ref.where('idCliente', '==', idCliente).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete().then(() => {
            console.log('Usuario eliminado correctamente');
          }).catch(error => {
            console.error('Error al eliminar usuario:', error);
          });
        });
      })
      .catch(error => {
        console.error('Error al buscar usuario:', error);
      });
  }

}
