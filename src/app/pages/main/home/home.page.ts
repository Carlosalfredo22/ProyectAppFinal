import { Component, inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateParqueousuarioComponent } from 'src/app/shared/components/add-update-parqueousuario/add-update-parqueousuario.component';

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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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
      console.log('Datos guardados correctamente en Firestore');
      // Limpiar los campos del formulario después de guardar los datos
      this.idCliente = null;
      this.nombre = '';
      this.codigoIngreso = '';
      this.colorAutomovil = '';
      this.numeroPlaca = null;
      this.horaEntrada = '';
      this.horaSalida = '';
    }).catch(error => {
      console.error('Error al guardar los datos en Firestore:', error);
    });
  }

  generarReportePDF() {
    // Crea un nuevo documento PDF
    const doc = new jsPDF();

    // Configura el tamaño y la fuente del título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');

    // Calcula la anchura del título y su posición centrada
    const title = 'Reporte de Usuarios';
    const titleWidth = doc.getStringUnitWidth(title) * 18 / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;

    // Agrega el título centrado
    doc.text(title, titleX, 10);

    // Configura el tamaño y la fuente del contenido
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Definir los datos de la tabla
    const data = this.usuarios.map(usuario => [usuario.idCliente, usuario.nombre, usuario.codigoIngreso, usuario.colorAutomovil, usuario.numeroPlaca, usuario.horaEntrada, usuario.horaSalida]);

    // Agregar la tabla al documento usando la extensión autotable
    (doc as any).autoTable({
      head: [['ID Cliente', 'Nombre', 'codigoIngreso', ' colorAutomovil', 'numeroPlaca','horaEntrada','horaSalida']], // Modificado el encabezado
      body: data,
      startY: 20,
      margin: { top: 15 },
    });

    // Guardar el PDF
    doc.save('reporte_usuarios.pdf');
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

  // Agregar o actualizar un usuario parqueo
  addUpdateparqueoUsuario(){
    this.utilsSvc.presentModal({
      component: AddUpdateParqueousuarioComponent,
      cssClass: 'add-update-modal' // Pasamos el componente del modal, no el método
    });
  }

}
