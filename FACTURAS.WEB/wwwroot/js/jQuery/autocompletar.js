var idPaciente = 2;
//Se cargo jquery
$(document).ready(function () {

    //Adicionarle a cada control que tenga la propiedad autompletar la función de autocompletar
    jQuery.each($("input[autocompletar = true]"),
                    function () {
                        //Codigo relacionado al autocompletar

                        $(this).autocomplete(
                                {
                                    source: function (request, response) {

                                        var itemsAutocompletar;
                                        var item_cache = this.element.attr('sqlconsulta') + "_" + request.term;

                                        //inicio if cache
                                        if ($("body").data(item_cache) != undefined && $("body").data(item_cache) != null) {

                                            itemsAutocompletar = $("body").data(item_cache);
                                            response($.map(eval(itemsAutocompletar.d),
                                                            function (item) {
                                                                return {
                                                                    label: (item.Codigo + ' - ' + item.Descripcion),
                                                                    id: item.Codigo

                                                                }//if return
                                                            } //if funcion item
                                                        )); //Cierre response

                                        } //Cierre if cache
                                        else { //Contenido nuevo

                                           // var webMethod = "PageLoader.asmx/Autcompletar";
                                            var parameters = "{'sTermino':'" + request.term + "'" + ", 'sConsulta':'" + this.element.attr('sqlconsulta') + "', 'idPaciente':'" + idPaciente + "'}";
                                            $.ajax(
                                                {
                                                    type: "POST",
                                                    url: webMethod,
                                                    data: parameters,
                                                    contentType: "application/json; charset=utf-8",
                                                    dataType: "json",
                                                    async: true,
                                                    success: function (data) {
                                                        $("body").data(item_cache, data);
                                                        response($.map(eval(data.d), function (item) {
                                                            return {
                                                                label: (item.Codigo + ' - ' + item.Descripcion),
                                                                id: item.Codigo
                                                            }
                                                        }));

                                                    },
                                                    error: function (xhr, ajaxOptions, thrownError) {
                                                        OnError(xhr, ajaxOptions, thrownError)
                                                    }
                                                }
                                            );

                                        } //Fin contenido nuevo
                                    } //Cierre source
                                    ,
                                    select:function (event, ui) {
                                        if ($("#" + $(this).attr("id") + "_hidden").length) {
                                            $("#" + $(this).attr("id") + "_hidden").val((ui.item ? ui.item.id : ''));
                                        }
                                    },
                                    minLength: 4,  //Cantidad de digitos minimos para ir a consultar la lista
                                    change: function (event, ui) {
                                        if ($("#" + $(this).attr("id") + "_hidden").length) {
                                            $("#" + $(this).attr("id") + "_hidden").val((ui.item ? ui.item.id : ''));
                                        }
                                    }
                                }//Cierre funcion autocompletar
                      ); //Cierre autocompletar
                    } //Cierre funcion each
    ); //Cierre each
} //Cierre funcion ready
);                            //Cierre ready

function OnError(xhr, ajaxOptions, thrownError) {
    $('<p>').text(xhr.status + ": Error calling service method.").appendTo('#error-list').asHighlight();
}


jQuery.fn.asError = function () {
    return this.each(function () {
        $(this).replaceWith(function (i, html) {
            var newHtml = "<div class='ui-state-error ui-corner-all' style='padding: 0 .7em;'>";
            newHtml += "<p><span class='ui-icon ui-icon-alert' style='float: left; margin-right: .3em;'>";
            newHtml += "</span>";
            newHtml += html;
            newHtml += "</p></div>";
            return newHtml;
        });
    });
};

jQuery.fn.asHighlight = function () {
    return this.each(function () {
        $(this).replaceWith(function (i, html) {
            var newHtml = "<div class='ui-state-highlight ui-corner-all' style='padding: 0 .7em;'>";
            newHtml += "<p><span class='ui-icon ui-icon-info' style='float: left; margin-right: .3em;'>";
            newHtml += "</span>";
            newHtml += html;
            newHtml += "</p></div>";
            return newHtml;
        });
    });
};
