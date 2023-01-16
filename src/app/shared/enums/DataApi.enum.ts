
export enum DataApi {


    ListaPrecio = 32,
    Ruta = 33,

    NivelAutorizacion = 35,
    EstadoGenerales = 36,

    NivelAutorizacionModulo = 34,
    Promocion = 37,

    SAPConnection = 38,
    Rol = 39,
    Permisos = 40,
    NotaCredito = 41,
    ReconciliacionInterna = 42,
    Moneda = 43,
    Departamento = 44,
    SolicitudCompra = 45,
    Proveedor = 46,
    ActividadEconomica = 47,
    ReporteProntoPago = 48,
    ArticuloPesaje = 49,
    UsuarioAlmacenEnrroll = 50,
    Cotizacion = 51,
    EnrrollVendedorEntregaSupervisor = 52,
    Configuracion = 53,
    Devolucion = 54,
    DevolucionDetalle = 55,
    TomaInventarioRuta = 56,
    Upload = 57,
    ArticuloCategoria = 58,
    OrdenCompra = 59,
    AutorizacionHistorico = 60,
    OrdenFabricacion = 61,
    OrdenFabricacionDetalle = 62,
    Plazo = 63,
    ClienteFrecuenciaVisitaRuta = 64,
    ClienteContacto = 65,
    ClienteFinanza = 66,


    UploadClienteAnexos = 70,
    ClienteComercial = 71,
    ClienteNegocio = 72,
    ReporteInventarioActivo = 73,
    Factura = 74,
    ReporteCanasto = 75,
    PedidosEmpleado = 76,
    Despacho = 77,
    ComprobanteFiscal = 78,
    SAPCotizacion = 79,
    ChequeDevuelto = 80,
    HoraPicking = 81,
    TransferenciaInventario = 82,
    ComprobanteEnrroll = 83,
    TipoComprobanteFiscal = 84,
    SolicitudDevolucion=85,
    SolicitudCambio=86,
    Modulo=87,
    TipoSolicitudDevolucion=88,
    AlmacenInventario=89,
    ModuloCompaniaEnrroll=90,
    ConfiguracionCompania=91,
    TipoDescuento=92,
    DescuentoArticulo=93,
    Promociones=94,
    Usuario = 1,
    Authentication = 2,
    ComboBox = 3,
    Cita = 4,
    Sintoma = 5,
    Public = 6,
    Herramientas = 7,
    Mantenimientos = 8,
    Cliente = 9,
    Turno = 10,
    Accesorio = 11,
    AlertaTablero = 12,
    Recepcion = 13,
    PosicionRecepcion = 14,
    Marca = 15,
    Modelo = 16,
    Dealer = 17,
    Almacen = 18,
    VehiculoTipo = 19,
    Combustible = 20,
    VehiculoCondicion = 21,
    Tag = 22,
    Compania = 23,
    Sucursal = 24,
    CitaCategoria = 25,
    SintomaCategoria = 26,
    ControlDiaHora = 27,
    Articulo = 28,
    Multipunto = 29,
    Recall = 30,
    Oferta = 31,
}
export const dataApiRootMap: { [api: string]: string } = {
    "32": "api/ListaPrecio",
    "33": "api/Ruta",
    "35": "api/NivelAutorizacion",
    "36": "api/EstadosGenerales",
    "37": "api/Promocion",
    "34": "api/NivelAutorizacionModulo",
    "38": "api/SAPConnection",
    "39": "api/Rol",
    "40": "api/Permisos",
    "41": "api/SAPNotaCredito",
    "42": "api/SAPReconciliacionInterna",
    "43": "api/Moneda",
    "44": "api/Departamento",
    "45": "api/SolicitudCompra",
    "46": "api/Proveedor",
    "47": "api/ActividadEconomica",
    "48": "api/ReporteProntoPago",
    "49": "api/ArticuloPesaje",
    "50": "api/UsuarioAlmacenEnrroll",
    "51": "api/Cotizacion",
    "52": "api/EnrrollVendedorEntregaSupervisor",
    "53": "api/Configuracion",
    "54": "api/Devolucion",
    "55": "api/DevolucionDetalle",
    "56": "api/TomaInventarioRuta",
    "57": "api/Upload",
    "58": "api/ArticuloCategoria",
    "59": "api/OrdenCompra",
    "60": "api/AutorizacionHistorico",
    "61": "api/OrdenFabricacion",
    "62": "api/OrdenFabricacionDetalle",
    "63": "api/Plazo",
    "64": "api/ClienteFrecuenciaVisitaRuta",
    "65": "api/ClienteContacto",
    "66": "api/ClienteFinanza",


    "70": "api/UploadClienteAnexos",
    "71": "api/ClienteComercial",
    "72": "api/ClienteNegocio",
    "73": "api/ReporteInventarioActivo",
    "74": "api/Factura",
    "75": "api/ReporteCanasto",
    "76": "api/PedidosEmpleado",
    "77": "api/Despacho",
    "78": "api/ComprobanteFiscal",
    "79": "api/SAPCotizacion",
    "80": "api/ChequeDevuelto",
    "81": "api/HoraPicking",
    "82": "api/TransferenciaInventario",
    "83":"api/ComprobanteEnrroll",
    "84":"api/TipoComprobanteFiscal",
    "85":"api/SolicitudDevolucion",
    "86":"api/SolicitudCambio",
    "87":"api/Modulo",
    "88":"api/TipoSolicitudDevolucion",
    "89":"api/AlmacenInventario",
    "90":"api/ModuloCompaniaEnrroll",
    "91":"api/ConfiguracionCompania",
    "92":"api/TipoDescuento",
    "93":"api/DescuentoArticulo",
    "94":"api/Promociones",
    "1": "api/Usuario",
    "2": "api/Authentication",
    "3": "api/ComboBox",
    "4": "api/Cita",
    "5": "api/Sintoma",
    "6": "api/Public",
    "7": "api/Herramientas",
    "8": "api/Mantenimientos",
    "9": "api/Cliente",
    "10": "api/Turno",
    "11": "api/Accesorio",
    "12": "api/AlertaTablero",
    "13": "api/Recepcion",
    "14": "api/PosicionRecepcion",
    "15": "api/Marca",
    "16": "api/Modelo",
    "17": "api/Dealer",
    "18": "api/Almacen",
    "19": "api/VehiculoTipo",
    "20": "api/Combustible",
    "21": "api/VehiculoCondicion",
    "22": "api/Tag",
    "23": "api/Compania",
    "24": "api/Sucursal",
    "25": "api/CitaCategoria",
    "26": "api/SintomaCategoria",
    "27": "api/ControlDiaHora",
    "28": "api/Articulo",
    "29": "api/Multipunto",
    "30": "api/Recall",
    "31": "api/Oferta",
};