﻿/*
* 	Diagnosticos 1.0  - jQuery Plugin
*	Written by Carlos Ríos Ochoa
*	Copyright(c) 2012 Sysnet LTDA.
*	Built for jQuery library
*	http://jquery.com
*   Descripción:
*   Crea el control de diagnósticos, permite eliminar o agregar un bloque de diagnostico
*/

var sFichaNotificacion = "";

jQuery.fn.items = function (options) {

    var count;
    count = 0;
    var defaults =
    {
        titulo: "Diagn&#243;sticos",
        tipEliminar: "Eliminar",
        tipAdicionar: "Agregar",
        tagDiagPrincipal: "txtDiagnosticoPrincipal",
        tagDiagRelacionado: "txtDiagnosticoRelacionado",
        tagCodigoDiagPrincipal: "txtCodigoDiagnosticoPrincipal",
        tagCodigoDiagRelacionado: "txtCodigoDiagnosticoRelacionado",
        labelDiagPrincipal: "Principal",
        labelDiagRelacionado: "Relacionado",
        mostrarFielset: false,
        urlServicio: '../../PageLoader.asmx/',
        numerodigitoscodigodiagnostico: 4,
        sqlConsultaCodigoDiagnostico: 'Diagnostico',
        sqlConsultaDiagnostico: 'ListaDiagnosticos',
        idPaciente: 0,
        validarDiagnosticos: true,
        rutaLib: '../../LibScript/',
        pagina: 'Preanastesica',
        showAlertExist: true,
        msgExist: 'Éste diagnóstico ya ha sido agregado',
        maxCaracteres: 4,
        validarSexo: true,
        msgAlertSexo: 'El diagnóstico ingresado no corresponde con el sexo del paciente',
        precargado: false,
        datosPrecargados: '<ul></ul>',
        permitirAgregar: false,
        permitirEliminar: false,
        widthCodigo: 5, /*Porcentaje*/
        widthDescripcion: 70,
        widthButtonBuscar: 5,
        widthbuttonEliminar: 5,
        widthLabel: 13
    };

    var settings = jQuery.extend(defaults, options);
    //Ventana de los diagnósticos
    var buscadorDianosticos = new Buscador("DIAGNOSTICOS");
    buscadorDianosticos.setTamaño(500, 400);
    buscadorDianosticos.setRaiz(settings.rutaLib);
    buscadorDianosticos.setPivotes(0, "A000");
    buscadorDianosticos.setEventoMouse("M");
    buscadorDianosticos.setFiltro("Codigo", "Descripción", 0, 2);

    this.each(function () {
        var registroXml = document.createElement('ul');
        var object = jQuery(this);
        object.data("registro", registroXml);

        //Creamos el fieldset contenider      
        var diagnosticos_contenedor = $('<fieldset><legend>' + settings.titulo + '</legend></fieldset>');
        var diagnosticos_contenido = $('<table></table>');
        var diagnosticos_add = $('<div  height="24px" width="24px" title="' + settings.tipAdicionar + '"  class="addbutton"><label>&#160;&#160;&#160;&#160;&#160;' + settings.tipAdicionar + '</label></div>');

        object.data("count", 0);

        //Agregamos los items a los contenedores respectivos
        if (settings.mostrarFielset) {
            diagnosticos_contenedor.append(diagnosticos_contenido);
        }

        if (!settings.precargado) {

            //Ingresar los diagnosticos por defecto
            add({ code: settings.tagCodigoDiagPrincipal, label: settings.labelDiagPrincipal, description: settings.tagDiagPrincipal, required: true }, diagnosticos_contenido, true);
            add({ code: settings.tagCodigoDiagRelacionado + "1", label: settings.labelDiagRelacionado + " 1", description: settings.tagDiagRelacionado + "1", required: false }, diagnosticos_contenido, true);
            add({ code: settings.tagCodigoDiagRelacionado + "2", label: settings.labelDiagRelacionado + " 2", description: settings.tagDiagRelacionado + "2", required: false }, diagnosticos_contenido, true);
            add({ code: settings.tagCodigoDiagRelacionado + "3", label: settings.labelDiagRelacionado + " 3", description: settings.tagDiagRelacionado + "3", required: false }, diagnosticos_contenido, true);

        }
        else {
            cargarPrecargadas(diagnosticos_contenido)
        }

        if (settings.permitirAgregar) {
            //Agregamos el evento al botón add
            diagnosticos_add.click(
                function (s) {
                    add({ code: settings.tagCodigoDiagRelacionado, label: settings.labelDiagRelacionado, description: settings.tagCodigoDiagPrincipal }, diagnosticos_contenido, false);
                }
            );
        }

        if (settings.mostrarFielset) {
            object.append(diagnosticos_contenedor);
        } else {
            object.append(diagnosticos_contenido);
        }

        if (settings.permitirAgregar) {
            //Boton agregar
            object.append("</br>");
            object.append(diagnosticos_add);
            object.append("</br>");
        }



        //Re-ordena los indices, para que sea coherente el orden de los diagnosticos
        function shorlist() {
            var index = 0;
            object.find('.labeldiagnostico').each(function () {
                if ($(this).attr("for") != settings.tagCodigoDiagPrincipal) {
                    index++;
                    var idControl = $(this).attr("for");
                    $(this).html(settings.labelDiagRelacionado + " " + index + ": ");
                }
            }
            );
        }


        //Agrega un nuevo diagnostico al back
        function AgregarRegistro(sCodigo, sDescripcion, CampoCodigo, CampoDescripcion) {
            //Verificar si existe en el diccinario
            //Mejorar el eliminado para una posterior adicion de ordenación
            var exist = false;
            var itemLi = document.createElement('li');
            $(itemLi).attr("CampoCodigo", CampoCodigo.attr("id"));
            $(itemLi).attr("CampoDescripcion", CampoDescripcion.attr("id"));
            $(itemLi).attr("ValorCodigo", jQuery.trim(sCodigo));
            $(itemLi).attr("ValorDescripcion", jQuery.trim(sDescripcion));

            registroXml = object.data("registro");

            // dherrera - 20131121 - Eliminar el diagnóstico del XML si ya fue agregado al XML.
            var sName = "";
            var sDescription = "";


            $(registroXml).find("li").each(
                function () {
                    sName = $(itemLi).attr('ValorCodigo');
                    sDescription = $(itemLi).attr('ValorDescripcion');

                    if (this.attributes["valorcodigo"].value.toUpperCase() == sName.toUpperCase() && this.attributes["valordescripcion"].value.toUpperCase() == sDescription.toUpperCase()) {
                        $(this).remove();
                        object.data("registro", registroXml);
                    }
                }
            );

            $(registroXml).find('li').each(
                function () {
                    if (this.attributes["valorcodigo"].value.toUpperCase() == $(itemLi).attr("ValorCodigo").toUpperCase() && this.attributes["valordescripcion"].value.toUpperCase() == $(itemLi).attr("ValorDescripcion").toUpperCase()) {
                        exist = true;
                    }
                }
            );

            if (!exist) {
                registroXml = object.data("registro");
                $(registroXml).append(itemLi);
                object.data("registro", registroXml);
                //ASPxCallback_Rips.PerformCallback(sCodigo);
                CampoDescripcion.val(sDescripcion);
                CampoCodigo.val('');
                CampoCodigo.val(sCodigo);

                if (sFichaNotificacion == "1") {
                    alert("Este diagnóstico " + sCodigo + " - " + sDescripcion + " está asociado a un evento de notificación, FAVOR DILIGENCIAR LA FICHA DE NOTIFICACIÓN.");
                }

            } else {
                if (settings.showAlertExist) {
                    alert(settings.msgExist);
                    CampoCodigo.val("");
                    CampoDescripcion.val("");
                }
            }
        }

        //Eliminar una fila de diagnosticos
        function eliminarRegistro(Codigo, Descripcion) {

            registroXml = object.data("registro");

            $(registroXml).find('li').each(
                    function () {
                        if (this.attributes["valorcodigo"].value.toUpperCase() == jQuery.trim(Codigo) && this.attributes["valordescripcion"].value.toUpperCase() == jQuery.trim(Descripcion)) {
                            $(this).remove();
                        }
                    }
            );

            object.data("registro", registroXml);

        }


        function cargarPrecargadas(control_parent) {
            var elementos = $(settings.datosPrecargados);
            registroXml = object.data("registro");
            $(elementos).find('li').each(
                            function (i) {
                                add({ code: settings.tagCodigoDiagRelacionado + (++i), label: settings.labelDiagRelacionado + " " + (++i), description: settings.tagDiagRelacionado + (++i), required: true }, control_parent, false, this.attributes["ValorCodigo"].value.toUpperCase(), this.attributes["ValorDescripcion"].value.toUpperCase());
                            }
            );
            object.data("registro", elementos);

        }


        //Crear un item de diagnóstico
        //add({ code: settings.tagCodigoDiagPrincipal, label: settings.labelDiagPrincipal, description: settings.tagDiagPrincipal, required: true }, diagnosticos_contenido, true); 
        function add(options, parent, predetermined, codigo, descripcion) {
            var index = parseInt(object.data("count"));
            var code = (predetermined ? options.code : settings.tagCodigoDiagRelacionado + index);
            var label = (predetermined ? options.label : settings.labelDiagRelacionado + " " + index);
            var description = (predetermined ? options.description : settings.tagDiagRelacionado + index);

            var itemDiagnostico = $('<tr><td width="' + settings.widthLabel + '%"><label class="labeldiagnostico" for="' + code + '">' + label + ': </label></td>' +
							       '<td style="padding: 2px;" width="' + settings.widthCodigo + '%"><input maxlength="4"  type="text"  id="' + code + '" class="codigodiagnostico" tipo="codigodiagnostico" /></td>' +
							       '<td style="padding: 2px;" align="center"  width="' + settings.widthButtonBuscar + '%"><input type="button" value="..." class="buttondiagnostico"/></td>' +
							       '<td style="padding: 2px;" align="left"  width="' + settings.widthDescripcion + '%"><input type="text"  id="' + description + '" class="descripciondiagnostico" tipo="descripciondiagnostico" /></td>' +
                                   (options.required ? '' : (settings.permitirEliminar ? '<td  align="left" ><div height="24px" width="24px" title="' + settings.tipEliminar + '"  class="closebutton"/></td>' : '')));

            //Agregar evento al digitar el codigo y presionar enter        
            itemDiagnostico.find('.codigodiagnostico').keypress(function (event) {
                if (event.which == 13) {
                    if ($(this).val() != "" && $(this).val().length >= settings.numerodigitoscodigodiagnostico) {
                        //Llamado ajax
                        var parameters = "{'sConsulta':'" + settings.sqlConsultaCodigoDiagnostico + "', 'idPaciente':'" + settings.idPaciente + "', 'Codigo':'" + $(this).val().toLowerCase() + "'}";
                        $.ajax(
                                {
                                    type: "POST",
                                    url: settings.urlServicio + settings.sqlConsultaCodigoDiagnostico,
                                    data: parameters,
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    async: true,
                                    success: function (data) {
                                        var pr = new PaqueteRegistro();
                                        pr = codificar(data.d);
                                        if (pr.getValor("Operacion") == "OK") {
                                            if (pr.existeClave("FichaNotificacion")) {
                                                sFichaNotificacion = pr.getValor("FichaNotificacion");
                                            }
                                            AgregarRegistro(pr.getValor("Codigo").toUpperCase(), pr.getValor("Descripcion").toUpperCase(), itemDiagnostico.find('.codigodiagnostico'), itemDiagnostico.find('.descripciondiagnostico'));
                                        } else {
                                            alert(pr.getValor("Mensaje"));
                                            itemDiagnostico.find('.codigodiagnostico').val("");
                                            itemDiagnostico.find('.descripciondiagnostico').val("");
                                        }
                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        alert("No se puedo obtener la descripción del diagnóstico");
                                    }
                                }
                            );
                    }
                    else {
                        itemDiagnostico.find('.descripciondiagnostico').val("");
                        itemDiagnostico.find('.codigodiagnostico').val("");
                    }
                }
            });

            itemDiagnostico.find(".descripciondiagnostico").autocomplete(
                                {
                                    source: function (request, response) {

                                        //--------------
                                        if ($("body").data(request.term) != undefined && $("body").data(request.term) != null) {
                                            ListaDiagnosticos = $("body").data(request.term);
                                            response($.map(eval(ListaDiagnosticos.d), function (item) {
                                                return {
                                                    label: item.Codigo + ' - ' + item.Descripcion,
                                                    value: item.Descripcion,
                                                    objItem: item 
                                                }
                                            }));

                                        } else {

                                            var parameters = "{'sTermino':'" + request.term + "'" + ", 'sConsulta':'" + settings.sqlConsultaDiagnostico + "', 'idPaciente':'" + settings.idPaciente + "'}";
                                            $.ajax({
                                                type: "POST",
                                                url: settings.urlServicio + settings.sqlConsultaDiagnostico,
                                                data: parameters,
                                                contentType: "application/json; charset=utf-8",
                                                dataType: "json",
                                                async: true,
                                                success: function (data) {
                                                    $("body").data(request.term, data);
                                                    response($.map(eval(data.d), function (item) {
                                                        return {
                                                            label: item.Codigo + ' - ' + item.Descripcion,
                                                            value: item.Descripcion,
                                                            objItem: item 
                                                        }
                                                    }));
                                                },
                                                error: function (xhr, ajaxOptions, thrownError) {
                                                    OnError(xhr, ajaxOptions, thrownError)
                                                }
                                            });

                                        } /*fin else*/
                                    }
                                    ,
                                    select: function (event, ui) {
                                        if (ui.item.objItem != undefined && ui.item.objItem.bFichaNotificacion) {
                                            sFichaNotificacion = "1"
                                        }
                                        AgregarRegistro(ui.item.label.split('-')[0].toUpperCase(), ui.item.value.toUpperCase(), itemDiagnostico.find('.codigodiagnostico'), itemDiagnostico.find('.descripciondiagnostico'));
                                    },
                                    minLength: 4, //Cantidad de digitos minimos para ir a consultar la lista
                                    change: function (event, ui) {
                                        if (itemDiagnostico.find('.descripciondiagnostico').val() == "") {
                                            itemDiagnostico.find('.descripciondiagnostico').val("");
                                            itemDiagnostico.find('.codigodiagnostico').val("");
                                        }
                                    }
                                }//Cierre funcion autocompletar
                      ); //Cierre autocompletar

            itemDiagnostico.find(".descripciondiagnostico").blur(
                function () {
                    if (itemDiagnostico.find('.codigodiagnostico').val() == "") {
                        $(this).val("");
                        itemDiagnostico.find('.codigodiagnostico').val("");
                    }
                }
            );

            itemDiagnostico.find(".codigodiagnostico").blur(
                function () {
                    if (itemDiagnostico.find('.descripciondiagnostico').val() == "") {
                        $(this).val("");
                        itemDiagnostico.find('.descripciondiagnostico').val("");
                    }
                }
            );




            //Agregar evento al boton
            itemDiagnostico.find('.buttondiagnostico').click(
              function (event) {

                  buscadorDianosticos.setEventoSeleccion(seleccionDiagnostico);
                  buscadorDianosticos.abrir(settings.pagina);

                  function seleccionDiagnostico(registro) {

                      if (settings.validarSexo) {
                          if (validarSexo(registro[3])) {
                              AgregarRegistro(registro[0].toUpperCase(), registro[1].toUpperCase(), itemDiagnostico.find('.codigodiagnostico'), itemDiagnostico.find('.descripciondiagnostico'));
                          } else {
                              alert(settings.msgAlertSexo);
                              itemDiagnostico.find('.descripciondiagnostico').val("");
                              itemDiagnostico.find('.codigodiagnostico').val("");
                          }

                      } else {
                          AgregarRegistro(registro[0].toUpperCase(), registro[1].toUpperCase(), itemDiagnostico.find('.codigodiagnostico'), itemDiagnostico.find('.descripciondiagnostico'));
                      }


                  }
              }
             );

            //Programar el boton buscar
            var closeButton = itemDiagnostico.find('.closebutton');
            closeButton.data("parent", itemDiagnostico);
            closeButton.click(function (e) {
                var button = $(this);
                var parentControl = button.data("parent");
                itemDiagnostico.effect('fade', {}, 400,
                function () {
                    $(this).remove();
                    shorlist();
                }
                //Eliminar del back
            );
                eliminarRegistro(itemDiagnostico.find('.codigodiagnostico').val(), itemDiagnostico.find('.descripciondiagnostico').val());
                object.data("count", parseInt(object.data("count")) - 1);
            }
        );
            parent.append(itemDiagnostico);
            itemDiagnostico.fadeOut(0).fadeIn(1200);
            index++;
            object.data("count", index);
            if (codigo !== undefined) {
                itemDiagnostico.find('.codigodiagnostico').val(codigo);
                itemDiagnostico.find('.descripciondiagnostico').val(descripcion);

            } else {
                itemDiagnostico.find('.codigodiagnostico').focus();
            }
        }
    });



    return this;
};

/// <summary>
/// EndCallback_Rips(s, e)
/// Función: recibir la respuesta del evento del Callback_Rips
/// </summary>
//function EndCallback_Rips(s, e) {

//    if (s.cpError != undefined && s.cpError != "") {
//        alert(s.cpError);
//    } else {
//        if (s.cpRespuesta != undefined && s.cpRespuesta != "") {

//            if (s.cpRespuesta) {
//                alert('Este diagnóstico ' + sCodigoDiag + ' - ' + sDescripcionDiag + ' está asociado a un evento de notificación, FAVOR DILIGENCIAR LA FICHA DE NOTIFICACIÓN.');
//            }
//        }
//    }
//}
