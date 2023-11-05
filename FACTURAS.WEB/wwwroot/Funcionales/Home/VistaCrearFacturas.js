
let gUrlConsultarFacturas = "https://localhost:7266/api/Factura/ConsultarFactura";
let gUrlConsultarDinamica = "https://localhost:7266/api/Factura/ConsultaDinamica";
let gUrlGuardarFactura = "https://localhost:7266/api/Factura/GuardarFactura";

let gObjGrilla_FacturaDetalle = null;
let gObjCombox_Cliente = null;
let gObjCombox_Producto = null;
let gListaProductos = null;

$(document).ready(function () {
    InicializarVentana();
});

const InicializarVentana = () => {
    $(".inputNumero").on("input", function () {
        var inputValue = $(this).val();
        if (/[^0-9]/.test(inputValue)) {
            $(this).val(inputValue.replace(/[^0-9]/g, ''));
        }
    });
    $("#input_CantidadProducto").on("input", function () {
        onChangeComboProducto();
    });
    $('#button_AgregarProductoGrid').click(function () {
        AgregarProducto();
    });
    $('#button_Guardar').click(function () {
        GuardarFactura();
    });
    $('#button_Limpiar').click(function () {
        LimpiarCampos();
    });

    CrearGridFacturaDetalle([]);
    CrearComboCliente([]);

    let ObjParametros = new Object();
    ObjParametros.accion = "BuscarClientes";
    sEventosCs(gUrlConsultarDinamica, ObjParametros, CrearComboCliente);

    ObjParametros.accion = "BuscarProductos";
    sEventosCs(gUrlConsultarDinamica, ObjParametros, AgregarListaProducto);
}

const LimpiarCampos = () => {
    $("#input_NumeroFactura").val("");
    gObjCombox_Cliente.value("");
    gObjCombox_Cliente.text("");
    CrearGridFacturaDetalle([]);
    LlenarDatosTotal();
}

const LimpiarCamposProductos = () => {
    $("#input_PrecioUnitario").text("");
    $("#input_TotalesProducto").text("");
    gObjCombox_Producto.value("");
    gObjCombox_Producto.text("");
    $("#input_CantidadProducto").val("");
    LlenarDatosTotal();
}

const ValidarGuardado = () => {
    if ($("#input_NumeroFactura").val() == "") {
        alert("El campo numero de factura no puede estar vacio");
        return false;
    }
    if (gObjCombox_Cliente.selectedIndex < 0) {
        alert("El campo cliente no puede estar vacio");
        return false;
    }
    if (gObjGrilla_FacturaDetalle.dataSource._data.length <= 0) {
        alert("Debe llenar el detalle de la factura");
        return false;
    }
    return true;
}

const GuardarFactura = () => {
    if (!ValidarGuardado()) {
        return false;
    }
    let subTotalFactura = gObjGrilla_FacturaDetalle.dataSource._data.reduce((acumulador, elemento) => parseInt(acumulador) + parseInt(elemento.Totales), 0);

    let ObjParametros = new Object();
    ObjParametros.idCliente = gObjCombox_Cliente.value();
    ObjParametros.numeroFactura = $("#input_NumeroFactura").val();
    ObjParametros.numeroTotalArticulos = gObjGrilla_FacturaDetalle.dataSource._data.length;
    ObjParametros.subTotalFactura = subTotalFactura;
    ObjParametros.totalImpuesto = subTotalFactura * 0.19;
    ObjParametros.totalFactura = subTotalFactura * 1.19;
    ObjParametros.detalleFactura = gObjGrilla_FacturaDetalle.dataSource._data.map(dato => {
        return {
            idProducto: dato.id,
            cantidadDeProducto: dato.Cantidad,
            precioUnitarioProducto: dato.PrecioUnitario,
            subtotalProducto: dato.Totales,
            notas: ""
        }
    });
    sEventosCs(gUrlGuardarFactura, ObjParametros, EndCallBackGuardarFactura);
}

const LlenarDatosTotal = () => {

    if (gObjGrilla_FacturaDetalle.dataSource._data.length >= 1) {
        let subTotalFactura = gObjGrilla_FacturaDetalle.dataSource._data.reduce((acumulador, elemento) => parseInt(acumulador) + parseInt(elemento.Totales), 0);
        $("#input_SubTotal").text(subTotalFactura);
        $("#input_Impuesto").text(subTotalFactura * 0.19);
        $("#input_Total").text(subTotalFactura * 1.19);
    } else {
        $("#input_SubTotal").text(0);
        $("#input_Impuesto").text(0);
        $("#input_Total").text(0);
    }

}
const EndCallBackGuardarFactura = (objData) => {
    if (objData != null) {
        LimpiarCampos();
        LimpiarCamposProductos();
        alert("Se guardo correctamente la factura")
    }
}
const AgregarListaProducto = (objData) => {
    gListaProductos = objData;
    gObjCombox_Producto = $("#combobox_Producto").kendoDropDownList({
        optionLabel: 'Seleccione...',
        dataTextField: "NombreProducto",
        dataValueField: "Id",
        dataSource: gListaProductos,
        change: function () { onChangeComboProducto() }
    }).data("kendoDropDownList");
}

const onChangeComboProducto = () => {
    if (gObjCombox_Producto.selectedIndex < 0) {
        return false;
    }
    let producto = gListaProductos.find(e => e.Id == gObjCombox_Producto.value());
    $("#input_PrecioUnitario").text(producto.PrecioUnitario);
    $("#input_TotalesProducto").text(producto.PrecioUnitario * $("#input_CantidadProducto").val());
}

const AgregarProducto = () => {
    if (gObjGrilla_FacturaDetalle != null) {
        let producto = gListaProductos.find(e => e.Id == gObjCombox_Producto.value());
        gObjGrilla_FacturaDetalle.dataSource.insert({
            id: producto.Id,
            NombreProducto: producto.NombreProducto,
            PrecioUnitario: producto.PrecioUnitario,
            Cantidad: $("#input_CantidadProducto").val(),
            ImagenProducto: producto.ImagenProducto,
            Totales: $("#input_TotalesProducto").text()
        });
        LimpiarCamposProductos();
        LlenarDatosTotal();
        $('#Popup_Detalle').modal('hide');
    }
}

const CrearGridFacturaDetalle = (objData) => {
    if (gObjGrilla_FacturaDetalle == null) {
        $("#grid_FacturaDetalle").empty();
        gObjGrilla_FacturaDetalle = $("#grid_FacturaDetalle").kendoGrid({
            dataSource: {
                data: objData,
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: {},
                            NombreProducto: {},
                            PrecioUnitario: {},
                            Cantidad: {},
                            ImagenProducto: {},
                            Totales: {}
                        }
                    }
                }
            },
            height: "200px",
            columns: [
                { field: "NombreProducto", title: "Producto" }
                , { field: "PrecioUnitario", title: "Precio Unitario" }
                , { field: "Cantidad", title: "Cantidad" }
                , { title: "Imagen", template: "<img id='prueba' style=\"width:100%;\" src=\"data:image/jpeg;base64,#=ImagenProducto #\" width=\"60\" height=\"60\" >" }
                , { field: "Totales", title: "Totales" }
                , { title: "", template: kendo.template($("#templateElim").html()), width: 80 }
            ]
        }).data("kendoGrid");
    } else {
        gObjGrilla_FacturaDetalle.dataSource.data(objData)
    }
}

const CrearComboCliente = (objData) => {
    if (!gObjCombox_Cliente) {
        let DataSource = new kendo.data.DataSource({
            data: objData ? objData : []
            , type: "json"
        });
        $("#combobox_Cliente").empty();
        gObjCombox_Cliente = $("#combobox_Cliente").kendoComboBox({
            filter: "contains",
            dataTextField: "RazonSocial",
            dataValueField: "Id",
            placeholder: "Seleccione...",
            dataSource: DataSource,
        }).data("kendoComboBox");
    } else {
        gObjCombox_Cliente.value("");
        gObjCombox_Cliente.dataSource.data(objData != null ? objData : []);
        gObjCombox_Cliente.refresh();
    }
}

const sEventosCs = (url, ObjJson, callback) => {
    try {
        $.ajax({
            async: false,
            type: "POST",
            url: url,
            data: JSON.stringify(ObjJson),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (callback != null) {
                    callback(data);
                }
            }
            , error: function (data) {
                if (data.status == 400) {
                    alert(data.responseText);
                } else {
                    alert("StatusCode: " + data.status + " StatusText: " + data.statusText);
                }
            }
        });
    } catch (ex) {
        alert("Error en sEventosCs:\n " + ex.message);
    }
}

const EliminarDetalle = (Objeto) => {
    var ObjRow = $(Objeto).closest("tr");
    gObjGrilla_FacturaDetalle.removeRow(ObjRow);
    LlenarDatosTotal();
}
    