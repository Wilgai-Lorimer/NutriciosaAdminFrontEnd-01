import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/authentication/service/authentication.service';
import { Parametro } from 'src/app/core/http/model/Parametro';
import { BackendService } from 'src/app/core/http/service/backend.service';
import { ArticuloBalanceViewModel } from 'src/app/Modules/mantenimientos/articulos/models/ArticuloBalanceViewModel';
import { ArticuloListaPrecioViewModel } from 'src/app/Modules/mantenimientos/articulos/models/ArticuloListaPrecioViewModel';
import { Cliente } from 'src/app/Modules/mantenimientos/clientes/models/Cliente';
import { Compania } from 'src/app/Modules/mantenimientos/companias/models/Compania';
import { Usuario } from 'src/app/Modules/servicios/recepcion/models/Usuario';
import { DataApi } from 'src/app/shared/enums/DataApi.enum';
import { EstadosGeneralesKeyEnum } from 'src/app/shared/enums/EstadosGeneralesKeyEnum';
import { ComboBox, ComboBoxAlmacenCotizacion } from 'src/app/shared/model/ComboBox';
import { CotizacionDetalle } from '../../cotizaciones/models/CotizacionDetalle';

import { EstadoFactura } from '../models/EstadoFactura';
import { Factura } from '../models/Factura';
import { FacturaDetalle } from '../models/FacturaDetalle';
import { ImprimirFactura } from '../print/imprimirFactura';

@Component({
  selector: 'app-factura-formulario',
  templateUrl: './factura-formulario.component.html',
  styleUrls: ['./factura-formulario.component.scss']
})
export class FacturaFormularioComponent implements OnInit {

  Cargando: boolean = false;
  btnGuardarCargando = false;
  actualizando = false;
  loadingClientes: boolean;
  clientes: ComboBox[];
  cliente: Cliente;


  articulosCombobox: ArticuloListaPrecioViewModel[];
  loadingCondicionPagos: boolean;
  TipoCondicionPagos: ComboBox[];
  loadingMonedaTipos: boolean;
  monedaTipos: ComboBox[];
  loadingAlmacenes: boolean;
  almacenes: ComboBox[];
  vendedores: ComboBox[];
  loadingVendedores: boolean;
  usuario: Usuario;
  factura: Factura = new Factura();
  facturaDetalles: FacturaDetalle[] = [];
  loadingArticuloBalance: boolean;
  articuloBalance: ArticuloBalanceViewModel[];
  totalCantidadExistencia: number;
  loadingCotizacionDetalle: boolean;
  loadingListaPrecios: boolean;
  listasPrecios: ComboBox[];
  fechaEntrega: Date = new Date();
  loadingAlmacenesDestino: boolean;
  almacenesDestino: ComboBoxAlmacenCotizacion[];
  validarAlmacen: any;
  autorizacionDescuento: any;
  autorizarDescuento: boolean;
  solicitarDescuento: boolean;
  loadingPromociones: boolean;
  promociones: any[];
  articulo: any;
  search: any="";
  noAplicaDescuento: boolean;
  searchProducto: any="";
  loadingEstadoCotizacion: boolean;
  estadosCotizaciones: ComboBox[];
  loadingTerminos: boolean;
  terminos: ComboBox[];
  estadoFactura: EstadoFactura=new EstadoFactura();
  compania: Compania;

  constructor(
    private toastService: ToastrService,
    private httpService: BackendService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private imprimirFactura: ImprimirFactura,
  ) { }


  ngOnInit(): void {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    if (id > 0) {
      //console.log(this.estadoFactura)
      this.getFacturaID(id);
      this.getDatosCompania();
      this.actualizando = true;
    }
    this.GetAutorizacionDescuento(Number(this.authService.tokenDecoded.nameid));
    this.getAlmacenes();
    this.getClientes();
    this.getTipoCondicionPago();
    this.getMonedaTipos();
    this.getListasPrecios();
    this.getAlmacenesOrigenUsuarioEnrroll(0);
    this.getEstadoCotizacion();
    this.getTerminos();
  }
  
  autorizarPorcientoDescuento(index:number){
    if(this.autorizarDescuento)
    {
      this.calcularTotales();
      this.facturaDetalles[index].descuentoAutorizado=true;
    }
  }
  buscaMasCliente(event:any){
     this.search=event.target.value;
     this.getClientes();
  }

  buscaMasProductos(event:any){
    this.searchProducto=event.target.value;
    this.getArticulosPrecioActual()
  
 }


 getFacturaID(id: number) {
    this.Cargando = true;
    this.httpService.DoPostAny<Factura>(DataApi.Factura,
      "GetFacturaByID", id).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if (response != null && response.records != null && response.records.length > 0) {
            let record = response.records[0]
            this.factura = record;
            console.log(this.factura);
            this.getClienteByID(this.factura.clienteId);
            this.getFacturaDetalles(this.factura.id);
            this.getVendedores(this.factura.clienteId);
          } else {
            this.toastService.warning("Factura no encontrada");
            this.router.navigateByUrl('/ventas/factura');
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
  getDatosCompania() {
    this.httpService.DoPostAny<Compania>(DataApi.Compania,
      "GetCompaniaByID", Number(this.authService.tokenDecoded.primarygroupsid)).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if (response != null && response.records != null && response.records.length > 0) {
            let record = response.records[0]
            this.compania = record;
          } else {
            this.toastService.warning("No se pudo conseguir los datos de la compania.");
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
  getEstadoFactura(id: number) {
    this.Cargando = true;
    this.httpService.DoPostAny<any>(DataApi.Factura,
      "GetEstadoFactura", id).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if (response != null && response.records != null && response.records.length > 0) {
            let record = response.records[0]
            this.estadoFactura = record;
          } else {
            this.toastService.warning("Estodo no encontrado");
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
  
  getFacturaDetalles(cotizacionID: number) {
    this.loadingCotizacionDetalle = true;
    this.httpService.DoPostAny<any>(DataApi.Factura,
      "GetFacturaDetalles", cotizacionID).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.facturaDetalles = response.records;
          console.log(this.facturaDetalles);
          this.agregarDetalleVacio();
        }
        this.loadingCotizacionDetalle = false;
      }, error => {
        this.loadingCotizacionDetalle = false;
        this.toastService.error("No se pudo obtener el detalle", "Error conexion al servidor");
        
      });
  }
 
  getUsuarioByID(usuarioID: number) {
    this.Cargando = true;
    this.httpService.DoPostAny<Usuario>(DataApi.Usuario,
      "GetUsuarioByID", usuarioID).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if (response != null && response.records != null && response.records.length > 0) {
            this.usuario = response.records[0];
          } else {
            this.toastService.warning("Usuario no encontrado");
            this.router.navigateByUrl('/ventas/cotizacion');
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }

  GetAutorizacionDescuento(usuarioID: number) {
    this.Cargando = true;
    this.httpService.DoPostAny<any>(DataApi.Usuario,
      "GetAutorizacionDescuento", usuarioID).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          //validar que existe
          if (response != null && response.records != null && response.records.length > 0) {
            this.autorizacionDescuento = response.records[0];
            switch (this.autorizacionDescuento.namekey) {
              case 'DESCUENTOAUTORIZADO':
                  this.autorizarDescuento=true;
                  break;
              case 'SOLICITADESCUENTO':
                this.solicitarDescuento=true;
                //this.autorizarDescuento=true;
                  break;
              case 'SOLICITADESCUENTOPROMOCION':
                  console.log("Indefinido.");
                  break;
              case 'DESCUENTOAUTORIZADOPROMOCION':
                 console.log("Indefinido.");
                  break;
              case 'NOAPLICA':
                this.noAplicaDescuento=true;
                console.log("Indefinido.");
                  break;
              default:
                this.autorizarDescuento=false;
                  break;
          }
          } else {
            this.toastService.warning("Autorización no encontrado");
          }
        }

      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
 
  agregarDetalleVacio() {
    this.facturaDetalles.push({
      almacenId: this.almacenes[0].codigo, articuloId: 0, cantidad: undefined, costo: 0,
      cotizacionId: 0, id: 0,
      porcientoDescuento: undefined, precio: 0,
      subtotal: 0, totalDescuento: 0, totalImpuesto: 0, totalNeto: 0,codigoReferenciaArticulo:"",
      inventario:0,hayErroresCantidad:false, hayErroresPorcientoDescuento:false,companiaId:0,
      porcientoImpuesto:0,porcientoDescuentoSol:0,estadoAutorizadoId:0,nombre:"",porcientoDescuentoBase:0,descuentoAutorizado:false,linea:0,articulo:''
    })
  }
  
  onSubmit() {
    if (!this.factura.vendedorId || this.factura.vendedorId < 1) {
      this.toastService.error("Selecciona un vendedor")
      return;
    }
    if (this.factura.monedaId < 1) {
      this.toastService.error("Selecciona una moneda")
      return;
    }
    if (this.factura.almacenId < 1) {
      this.toastService.error("Selecciona un almacén")
      return;
    }
    if (!this.facturaDetalles.some(x => x.articuloId > 0)) {
      this.toastService.error("No puedes hacer una cotización sin artículos")
      return;
    }
    if (this.facturaDetalles.filter(x => x.articuloId > 0)
      .some(x => !x.cantidad || x.cantidad <= 0 || !x.precio || x.precio <= 0)) {
      this.toastService.error("Artículos con datos incompletos, revisa precios y cantidades.")
      return;
    }
    if (this.facturaDetalles.some(x => x.porcientoDescuento > this.autorizacionDescuento.descuentoVenta) && this.autorizarDescuento) {
      this.toastService.error(`Solo puedes autorizar un descuento del ${this.autorizacionDescuento.descuentoVenta}%.`)
      return;
    }
    if(this.facturaDetalles.some(x=>x.hayErroresCantidad || x.hayErroresPorcientoDescuento))
    {
      return;
    }
    this.guardar();
  }
  guardar() {
    let metodo: string = this.actualizando ? "Update" : "Registrar";
    this.factura.sucursalId = Number(this.authService.tokenDecoded.groupsid)
    this.factura.usuarioId = Number(this.authService.tokenDecoded.nameid)
    this.factura.condicionPagoId = this.cliente.condicionPagoId;
    this.factura.companiaId=Number(this.authService.tokenDecoded.primarygroupsid);
    this.factura.listaPrecioID = this.cliente.listaPrecioId;
    let parametro: any = {
      "Factura": this.factura,
      "FacturaDetalles": this.facturaDetalles.filter(x => x.articuloId > 0 && x.cantidad > 0 && x.precio > 0),
      "FilasParaEliminar":this.filaParaEliminar
    }
    // console.log(parametro)
    this.btnGuardarCargando = true;
    this.httpService.DoPostAny<any>(DataApi.Factura,
      metodo, parametro).subscribe(response => {

        if (!response.ok) {
          this.toastService.error(response.errores[0], "Error");
        } else {
          this.toastService.success("Realizado", "OK");
          this.router.navigateByUrl('/ventas/factura');
        }
        this.btnGuardarCargando = false;
      }, error => {
        this.btnGuardarCargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
 
  getClientes() {
    this.loadingClientes = true;
    let parametros: Parametro[] = [
      { key: "Compania", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "UsuarioId", value: this.authService.tokenDecoded.nameid },
      { key: "search", value: this.search},
    ];
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetClientesComboBox", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.clientes = response.records;
          if(this.clientes.length <=0)
          {
           this.search=""
           this.getClientes()
          }
        }
        this.loadingClientes = false;
      }, error => {
        this.loadingClientes = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
  
  getClienteByID(id: number) {
    this.Cargando = true;
    this.httpService.DoPostAny<Cliente>(DataApi.Cliente,
      "GetClienteByID", id).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
          
        } else {
          //validar que existe
          if (response != null && response.records != null && response.records.length > 0) {
           this.cliente = response.records[0];
            this.getArticulosPrecioActual();
          } else {
            this.toastService.warning("Cliente no encontrado");
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }

  getAlmacenesOrigenUsuarioEnrroll(id:number) {
    let parametros: Parametro[] = [
      { key: "almacenId", value: id },
      { key: "usuarioId", value: this.authService.tokenDecoded.nameid },
      { key: "CompaniaId", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "Modulo", value: EstadosGeneralesKeyEnum.COTIZACION },
    ]
    this.loadingAlmacenesDestino = true;
    this.httpService.DoPost<ComboBoxAlmacenCotizacion>(DataApi.ComboBox,
      "GetAlmacenesDestinUsuarioEnrroll", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.almacenesDestino = response.records;
          if (this.almacenesDestino && this.almacenesDestino.length > 0) {
            this.factura.almacenId = this.almacenesDestino[0].codigo;
            this.validarAlmacen=this.almacenesDestino[0].otroProp;
          }
        }
        this.loadingAlmacenesDestino = false;
      }, error => {
        this.loadingAlmacenesDestino = false;
        this.toastService.error("No se pudo obtener los almacenes", "Error conexion al servidor");
      });
  }
  getPromociones(articulo:any) {
    let parametros: Parametro[] = [
      { key: "usuarioid", value: this.authService.tokenDecoded.groupsid },
      { key: "listaPrecioid", value: this.cliente.listaPrecioId},
      { key: "clienteid", value: this.factura.clienteId },
      { key: "rutaId", value: this.factura.vendedorId },
      { key: "sucursalid", value: this.authService.tokenDecoded.groupsid }, 
      { key: "almacenId", value: this.factura.almacenId },
      { key: "CompaniaId", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "fecha", value: new Date() },
      { key: "articulo", value:articulo.articuloId},
      { key: "cantidad", value:articulo.cantidad },
    ]
    this.loadingPromociones = true;
    this.httpService.DoPost<any>(DataApi.Cotizacion,
      "GetPromociones", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.promociones = response.records;
        }
        this.loadingPromociones = false;
      }, error => {
        this.loadingPromociones = false;
        this.toastService.error("No se pudo obtener las promociones", "Error conexion al servidor");
      });
  }
  onSelectCliente(cliente: any) {
    this.factura.direccion=cliente.otroProp;
    this.cliente = null
    if (cliente) {
      this.getClienteByID(cliente.codigo)
    }
    this.facturaDetalles = []
    this.agregarDetalleVacio()
    this.limpiarTotales()
    this.getVendedores(cliente.codigo);
  }
  onSelectArticulo(item: any, index: number) {
    if(!this.facturaDetalles.some(x => x.codigoReferenciaArticulo === item.codigoReferencia))
    {
           this.facturaDetalles[index].codigoReferenciaArticulo = item.codigoReferencia;
           this.facturaDetalles[index].articuloId = item.articuloId;
           this.facturaDetalles[index].precio = item.precioActual;
           this.facturaDetalles[index].almacenId = item.almacenId;
           this.facturaDetalles[index].costo = item.costo;
           this.facturaDetalles[index].inventario = item.disponible;
           this.facturaDetalles[index].porcientoImpuesto = item.impuesto;
           this.facturaDetalles[index].porcientoDescuentoBase = item.impuesto;
           this.facturaDetalles[index].porcientoDescuento=item.porcientoDescuento;
           this.facturaDetalles[index].companiaId=Number(this.authService.tokenDecoded.primarygroupsid);
           this.facturaDetalles[index].porcientoDescuentoSol= this.solicitarDescuento ? item.porcientoDescuento :0;
           this.facturaDetalles[index].estadoAutorizadoId=1;
           this.facturaDetalles[index].nombre=item.nombre;
           this.facturaDetalles[index].linea=index;
          if(this.facturaDetalles.filter(x=>x.articuloId === 0).length < 1 )
          {
            this.agregarDetalleVacio();
          }
    }
    else
    {
     this.toastService.warning("Este artículo ya existe en la lista.");
       this.onDeleteitem(index)
       return;
    }
    //this.calcularTotales()
  }
  getArticulosPrecioActual() {
    let parametros: Parametro[] = [
      { key: "Fecha  ", value: new Date() },
      { key: "Companiaid ", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "ListaPrecioId", value: this.cliente.listaPrecioId },
      { key: "almacenId", value: this.factura.almacenId },
      { key: "search", value: this.searchProducto },
    ]
    this.httpService.DoPost<ArticuloListaPrecioViewModel>(DataApi.Articulo,
      "GetArticulosPrecioActual", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          //validar que existe
          if (response != null && response.records != null && response.records.length > 0) {
            this.articulosCombobox = response.records
          } else {
            this.toastService.warning("La lista del cliente no tiene artículos");
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }
  filaParaEliminar= [];
  onDeleteitem(index: number,item?:any) {
    if(this.actualizando)
    {
      this.filaParaEliminar.push(item)
    }
  
    this.facturaDetalles.splice(index, 1);
    if (!this.facturaDetalles.some(x => x.articuloId <= 0)) {
      this.agregarDetalleVacio()
    }
    this.calcularTotales()
  }
  obtenerDescuento(item,i)
  {
    if(this.facturaDetalles[i].cantidad !=null || this.facturaDetalles[i].cantidad !=undefined)
    {
      this.getDescuento(item.articuloId,i);
    }
   
  }
  
  validarDescuento(index:number){
      this.calcularTotales();
      this.facturaDetalles[index].descuentoAutorizado=false;
  }

  calcularTotales() {
    this.limpiarTotales()
    this.facturaDetalles.forEach(x => {
      if(x.cantidad <=0)
      {
        this.toastService.error("Cantidad no válida.");
        x.hayErroresCantidad=true;
        x.subtotal=0;
        x.totalDescuento=0;
        x.totalImpuesto=0;
        x.totalNeto=0;
        return;
      }
      else{
        x.hayErroresCantidad=false;
      }
      if(x.porcientoDescuento <0)
      {
        this.toastService.error("Descuento no válido.");
        x.hayErroresPorcientoDescuento=true;
        x.subtotal=0;
        x.totalDescuento=0;
        x.totalImpuesto=0;
        x.totalNeto=0;
        return;
      }
      else{
        x.hayErroresPorcientoDescuento=false;
      }
      //Validar si se toma en cuenta la existencia en inventario
      if(this.validarAlmacen && x.cantidad > x.inventario)
      {
        this.toastService.error("Cantidad insuficiente en almacén.");
        x.hayErroresCantidad=true;
        x.subtotal=0;
        x.totalDescuento=0;
        x.totalImpuesto=0;
        x.totalNeto=0;
        return;
      }
      else{
        x.hayErroresCantidad=false;
      }
      x.subtotal = x.cantidad && x.articuloId ? (x.precio * x.cantidad) : 0;
      x.totalDescuento = x.porcientoDescuento ? (x.subtotal * x.porcientoDescuento/ 100) : 0;
      x.totalImpuesto = (x.subtotal - x.totalDescuento) * (x.porcientoImpuesto / 100);
      x.totalNeto = x.subtotal - x.totalDescuento + x.totalImpuesto;
      this.factura.descuentoTotal += x.totalDescuento;
      this.factura.subtotal += x.subtotal;
      this.factura.costoTotal += x.cantidad && x.costo ? (x.costo * x.cantidad) : 0;
    })
    this.factura.totalNeto = this.factura.subtotal - this.factura.descuentoTotal;
    this.factura.impuestoTotal = this.facturaDetalles.reduce((n, {totalImpuesto})=> n+totalImpuesto,0);
    this.factura.totalNeto += this.factura.impuestoTotal;
  }

  limpiarTotales() {
    this.factura.subtotal = 0;
    this.factura.descuentoTotal = 0;
    this.factura.impuestoTotal = 0;
    this.factura.totalNeto = 0;
    this.factura.costoTotal = 0;
  }

 
  getDescuento(articuloId:number,index:number) {
   
    let parametros: Parametro[] = [
      { key: "fecha", value: new Date() },
      { key: "listaPrecio", value: this.cliente.listaPrecioId},
      { key: "clienteId", value: this.factura.clienteId },
      { key: "CompaniaId", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "ArticuloId", value: articuloId },
      { key: "TipoDescuento", value: 'VENTAS' },
      { key: "UsuarioId", value: this.authService.tokenDecoded.nameid },
      { key: "AlmacenId", value: this.factura.almacenId },
      { key: "cantidad", value: 10 },
    ]
    this.httpService.DoPost<any>(DataApi.Cotizacion,
      "GetDescuento", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if (response != null && response.records != null && response.records.length > 0) {
            this.facturaDetalles[index].porcientoDescuento=response.records[0].PorcientoDescuento !=null ?response.records[0].PorcientoDescuento:0 ;
            //orcientoDescuentoBase para saber si el usuario cambio el descuento
            this.facturaDetalles[index].porcientoDescuentoBase=response.records[0].PorcientoDescuento !=null ?response.records[0].PorcientoDescuento:0 ;
            this.calcularTotales();
          } else {
            this.toastService.warning("No se pudo obtener el descuento.");
          }
        }
      }, error => {
        this.Cargando = false;
        this.toastService.error("Error conexion al servidor");
      });
  }

  getTipoCondicionPago() {
    this.loadingCondicionPagos = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetTipoCondicionPago", null).subscribe(response => {

        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.TipoCondicionPagos = response.records;
        }
        this.loadingCondicionPagos = false;
      }, error => {
        this.loadingCondicionPagos = false;
        this.toastService.error("No se pudo obtener las condiciones de pago", "Error conexion al servidor");
        setTimeout(() => {
          this.getTipoCondicionPago();
        }, 1000);
      });
  }

  getVendedores(ClienteId:number) {
    let parametros: Parametro[] = [
      { key: "ClienteId", value: ClienteId },
      { key: "Companiaid", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "NameKey", value: 'VENTAS' }
      
    ]
    this.loadingVendedores = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetVendedores", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.vendedores = response.records;
        }
        this.loadingVendedores = false;
      }, error => {
        this.loadingVendedores = false;
        this.toastService.error("No se pudo obtener los vendedores", "Error conexion al servidor");
      });
  }
  getMonedaTipos() {
    this.loadingMonedaTipos = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetMonedas", null).subscribe(response => {

        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.monedaTipos = response.records;
          if (this.monedaTipos && this.monedaTipos.length > 0) {
            this.factura.monedaId = this.monedaTipos[0].codigo
          }
        }
        this.loadingMonedaTipos = false;
      }, error => {
        this.loadingMonedaTipos = false;
        this.toastService.error("No se pudo obtener los tipos de monedas", "Error conexion al servidor");
        setTimeout(() => {
          this.getMonedaTipos();
        }, 1000);

      });
  }

  getAlmacenes() {
    let parametros: Parametro[] = [
      { key: "almacenId", value: 0 },
      { key: "usuarioId", value: this.authService.tokenDecoded.nameid },
      { key: "CompaniaId", value: this.authService.tokenDecoded.primarygroupsid },
      { key: "Modulo", value: EstadosGeneralesKeyEnum.COTIZACION },
    ]
    this.loadingAlmacenes = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetUsuarioAlmacenesModulo", parametros).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.almacenes = response.records;
        }
        this.loadingAlmacenes = false;
      }, error => {
        this.loadingAlmacenes = false;
        this.toastService.error("No se pudo obtener los almacenes", "Error conexion al servidor");
        setTimeout(() => {
          this.getAlmacenes()
        }, 1000);

      });
  }
  
  getEstadoCotizacion() {
   
    this.loadingEstadoCotizacion = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetgetEstadoCotizacion", null).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if(response.records.length > 0)
          {
            this.estadosCotizaciones = response.records;
            if(!this.actualizando)
            {
              this.factura.estadoId=response.records[0].codigo;
            }
           
          }
         
        }
        this.loadingEstadoCotizacion = false;
      }, error => {
        this.loadingEstadoCotizacion = false;
        this.toastService.error("No se pudo obtener los almacenes", "Error conexion al servidor");
        setTimeout(() => {
          this.getAlmacenes()
        }, 1000);

      });
  }

  getTerminos() {
   
    this.loadingTerminos = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetTerminos", null).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          if(response.records.length > 0)
          {
            
            if(response.records.length > 0)
            {
              this.terminos = response.records;
              if(!this.actualizando)
              {
                this.factura.plazoId=response.records[0].codigo;

              }
             
            }
          }
         
        }
        this.loadingTerminos = false;
      }, error => {
        this.loadingTerminos = false;
        this.toastService.error("No se pudo obtener los terminos", "Error conexion al servidor");
       
      });
  }
  openModal(content, articuloID: number) {
    this.articuloBalance = [];
    this.getArticuloBalanceAlmacenes(articuloID);
    this.modalService.open(content, { size: 'lg', });
  }
  openModalPromociones(content, item: any) {
    this.articulo=item.nombre;
    this.getPromociones(item)
    this.modalService.open(content, { size: 'lg', });
  }
  getArticuloBalanceAlmacenes(articuloID: number) {
    this.loadingArticuloBalance = true;
    this.httpService.DoPostAny<ArticuloBalanceViewModel>(DataApi.Articulo,
      "GetArticuloBalanceAlmacenes", articuloID).subscribe(response => {

        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.articuloBalance = response.records;
          this.totalCantidadExistencia = 0;
          if (this.articuloBalance) {
            this.articuloBalance.forEach(ab => this.totalCantidadExistencia += ab.existencia)
          }
        }
        this.loadingArticuloBalance = false;
      }, error => {
        this.loadingArticuloBalance = false;
        this.toastService.error("No se pudo obtener la existencia", "Error conexion al servidor");
      });
  }
  getListasPrecios() {
    this.loadingListaPrecios = true;
    this.httpService.DoPost<ComboBox>(DataApi.ComboBox,
      "GetListaPreciosComboBox", null).subscribe(response => {
        if (!response.ok) {
          this.toastService.error(response.errores[0]);
        } else {
          this.listasPrecios = response.records;
        }
        this.loadingListaPrecios = false;
      }, error => {
        this.loadingListaPrecios = false;
        this.toastService.error("No se pudo obtener las listas de precios", "Error conexion al servidor");
        setTimeout(() => {
          this.getListasPrecios();
        }, 1000);

      });
  }
  imprimir(){
    this.imprimirFactura.construirFactura(this.factura,this.facturaDetalles.filter(x => x.articuloId > 0 && x.cantidad > 0 && x.precio > 0),this.compania)
  }
  enviar(){
     this.factura.enviado=true;
     this.factura.estado="Enviada"
  }
  aprobar(){
    this.factura.aprobado=true;
    this.factura.estado="Aprobada"
 }

pagar(){
  this.factura.pagado=true;
  this.factura.estado="Pagada"
}
}



