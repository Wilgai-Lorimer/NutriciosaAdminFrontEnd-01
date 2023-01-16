import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from 'src/app/core/http/service/backend.service';
import { ArticuloPesajeListadoViewModel } from 'src/app/Modules/produccion/pesaje/models/ArticuloPesajeListadoViewModel';
import { DataApi } from 'src/app/shared/enums/DataApi.enum';

@Component({
  selector: 'app-pesaje-resultado-codigo-barra',
  templateUrl: './pesaje-resultado-codigo-barra.component.html',
  styleUrls: ['./pesaje-resultado-codigo-barra.component.scss']
})
export class PesajeResultadoCodigoBarraComponent implements OnInit {

  articuloPesaje: ArticuloPesajeListadoViewModel;
  articuloPesajeDetalle: any;
  Cargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private httpService: BackendService,
    private toastService: ToastrService,
    private router: Router,
    private renderer2: Renderer2) { }


  printPrueba() {
    var css = '@page { size: landscape; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style: any = document.createElement('style');

    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    window.print();
  }

  ngOnInit(): void {

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.getArticuloPesajeByID(id);

  }

  getArticuloPesajeByID(articuloPesajeID: number) {

    this.Cargando = true;
    this.httpService.DoPostAny<ArticuloPesajeListadoViewModel>(DataApi.ArticuloPesaje,
      "GetArticuloPesajeListadoByID", articuloPesajeID).subscribe(response => {

        if (!response.ok) {
          this.toastService.error(response.errores[0]);
          console.error(response.errores[0])
        } else {
          if (response.records.length > 0) {
            this.articuloPesaje = response.records[0];
            this.articuloPesajeDetalle = JSON.parse(this.articuloPesaje.detalleJSON);

            setTimeout(() => {
              // window.print();

              this.printPrueba()
            }, 1000);


            setTimeout(() => {
              this.router.navigateByUrl('/produccion/pesajeApp');
            }, 3000);



          } else {
            this.toastService.error("Resultado no encontrado")
            this.router.navigateByUrl('/produccion/pesajeApp');
          }
        }

        this.Cargando = false;
      }, error => {

        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });

  }






}
