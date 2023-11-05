/*
* 	Vocabulario 1.0  - jQuery Plugin
*	Written by Carlos Ríos Ochoa
*	Copyright(c) 2012 Sysnet LTDA.
*	Built for jQuery library
*	http://jquery.com
*   Descripción:
*   Permite reemplazar un vocabulario existente dentro de un control
*/

jQuery.fn.vocabulario = function (options) {
    var defaults =
        {
            contexto: 'HGA',
            urlServicio: '../../PageLoader.asmx/Vocabulario',
            sqlConsulta: 'Vocabulario',
            aplicaShurtCut: true,
            idPaciente: 0,
            cantidadCaracteres: 1,
            autocompletarblur: true,
            codigoshortcut: 'F3'
        };

    var settings = jQuery.extend(defaults, options);
    var contenidoVocabulario;
    this.data("vocabulario", contenidoVocabulario);
    try {
        ObtenerClaves();
    } catch (e) { }

    function itemAuto(value, label)
    {
        this.value = value;
        this.label = label;
    }


    function ObtenerClaves() {

        //Llamado ajax
        var parameters = "{'sConsulta':'" + settings.sqlConsulta + "', 'sContexto':'" + settings.contexto + "', 'idPaciente':'" + settings.idPaciente + "'}";
        $.ajax(
            {
                type: "POST",
                url: settings.urlServicio,
                data: parameters,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (data) 
                {
                    contenidoVocabulario = data;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("No se pudo obtener la información del vocabulario");
                }               
            }
        );

    }


    this.each(function () 
    {

        var object = jQuery(this);
        //Obtener los datos del control    
        var sidContenedor = object.attr("id");
        var sClave = object.attr("NameTerm");
        var sIdText = object.attr("ValueTerm");
        var sLabel = object.attr("Text");
        var sContexto = object.attr("contexto");
        var listaOpciones = new Array();
        var sTexto = "";


        var control = $('<label   for="' + sIdText + '">' + sLabel + ':&#160;</label>' +
                        '<textarea  id="' + sIdText + '"  class="' + sClave + ' formatovocabulario" rows="2"></textarea>');

        object.removeAttr("Text");
        object.removeAttr("class");
        //Agregar control
        object.html(control);


        //Agregar autocompletar
        if (contenidoVocabulario) {
            //Obtener las opciones que pertenecen a la clave
            $.map(eval(contenidoVocabulario.d),
                    function (item) {
                        if (item.Codigo == sClave) {
                            listaOpciones.push(new itemAuto(item.Descripcion, item.Opcion));
                            if (settings.aplicaShurtCut) {
                                if (sTexto == "") {
                                    if (item.AplicaShurtCut == "1") 
                                    {
                                        sTexto = item.Descripcion;
                                    }
                                }
                            }
                        }
                    }
                 );

            //Agregar datos al control
            $('#' + sIdText).data("opciones", listaOpciones);
            if (settings.autocompletarblur) {
                $('#' + sIdText).blur(
                    function () {
                        //Obtener las opciones que pertenecen a la clave
                        jQuery.each(listaOpciones, function () {
                            if (this.label.toLowerCase() == $('#' + sIdText).val().toLowerCase()) {
                                $('#' + sIdText).val(this.value);
                            }
                        });
                    }
                );
            }

            //Configurar el autocompletar
            $('#' + sIdText).autocomplete({
                source: listaOpciones,
                autoFocus: true
            });

        }

        if (settings.aplicaShurtCut) {
            //Por defecto guardamos la primera descripcion
            if (listaOpciones.length > 0) {
                $('#' + sIdText).data("dafault_info", sTexto);
            }

            //Agregar el shortcut para la primera opción
            if (listaOpciones.length > 0) 
            {
                var controlId = $('#' + sIdText);
                shortcut.add(settings.codigoshortcut, function () 
                {
                    $('#' + sIdText).val($('#' + sIdText).data("dafault_info"));
                }, {
                    'type': 'keydown',
                    'propagate': true,
                    'target': document.getElementById(sIdText)
                });
            }
        }


    }
    );

    return this;
};


