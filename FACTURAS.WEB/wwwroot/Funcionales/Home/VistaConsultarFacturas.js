
let gUrlConsultarFacturas = "https://localhost:7266/api/Factura/ConsultarFactura";
let gUrlConsultarDinamica = "https://localhost:7266/api/Factura/ConsultaDinamica";


let gObjGrilla_Factura = null;
let gObjCombox_Cliente = null;

(function () {

    const InicializarVentana = () => {

        CrearGridFactura([]);
        CrearComboCliente([]);

        $('#button_Buscar').click(function () {
            BuscarFacturas();
        });

        $("#input_NumeroFactura").on("input", function () {
            var inputValue = $(this).val();
            if (/[^0-9]/.test(inputValue)) {
                $(this).val(inputValue.replace(/[^0-9]/g, ''));
            }
        });

        sEventosCs(gUrlConsultarFacturas, {}, CrearGridFactura);


        let ObjParametros = new Object();
        ObjParametros.accion = "BuscarClientes";
        sEventosCs(gUrlConsultarDinamica, ObjParametros, CrearComboCliente);
    }

    const onChangeKendoComboBox = (ObjCombo) => {
        let iOpcion = ObjCombo.selectedIndex;
        if (iOpcion < 0) {
            ObjCombo.value("");
            ObjCombo.text("");
            ObjCombo.refresh();
        }
    }

    const CrearGridFactura = (objData) => {
        if (gObjGrilla_Factura == null) {
            $("#grid_Facturas").empty();
            gObjGrilla_Factura = $("#grid_Facturas").kendoGrid({
                dataSource: {
                    data: objData,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {},
                                numeroFactura: {},
                                Nombre: {},
                                fechaEmisionFactura: {},
                                totalFactura: {},
                                totalImpuesto: {},
                                subTotalFactura: {},
                                razonSocial: {}
                            }
                        }
                    }
                },
                height: "385px",
                columns: [
                    { field: "numeroFactura", title: "Numero factura" }
                    , { field: "razonSocial", title: "Cliente" }
                    , { field: "fechaEmisionFactura", title: "Fecha Emision" }
                    , { field: "totalFactura", title: "Total Facturado", format: "{0:c2}" }

                ]
            }).data("kendoGrid");
        } else {
            gObjGrilla_Factura.dataSource.data(objData)
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
                change: function () {
                    onChangeKendoComboBox(gObjCombox_Cliente)
                }
            }).data("kendoComboBox");
        } else {
            gObjCombox_Cliente.value("");
            gObjCombox_Cliente.dataSource.data(objData != null ? objData : []);
            gObjCombox_Cliente.refresh();
        }
    }


    const BuscarFacturas = () => {
        let ObjParametros = new Object();

        if ($("#input_NumeroFactura").val() != "") {
            ObjParametros.numeroFactura = $("#input_NumeroFactura").val();
        }

        if (gObjCombox_Cliente.selectedIndex >= 0) {
            ObjParametros.idCliente =  gObjCombox_Cliente.value();
        }
        
        sEventosCs(gUrlConsultarFacturas, ObjParametros, CrearGridFactura)
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
                    callback(data);
                }
                , error: function (data) {
                    alert("StatusCode: " + data.status + " StatusText: " + data.statusText);
                }
            });
        } catch (ex) {
            alert("Error en sEventosCs:\n " + ex.message);
        }
    }

    $(function () {
        InicializarVentana();
    });
})();
