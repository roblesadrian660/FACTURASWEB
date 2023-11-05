/*
* jQuery UI Multicolumn Autocomplete Widget Plugin 2.0
* Copyright (c) 2012 Mark Harmon
*
* Depends:
*   - jQuery UI Autocomplete widget
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/
var sDato = "";
$.widget('custom.mcautocomplete', $.ui.autocomplete, {
    _renderMenu: function (ul, items) {
        var self = this, thead;
        sDato = this.element[0].value;
        if (this.options.showHeader) {
            table = $('<div class="ui-widget-header" style="width:100%;height:18px;"></div>');
            tableCabecera = $('<table style="width:97%;border-collapse: collapse;"></table>');
            trCabecera = $('<tr></tr>');

            $.each(this.options.columns, function (index, item) {
                if (!item.Visible) {
                    trCabecera.append('<td style="display:none;padding:0 4px;width:' + item.Width + '%;">' + item.Caption + '</td>');
                } else {
                    trCabecera.append('<td style="padding:0 4px;width:' + item.Width + '%;">' + item.Caption + '</td>');
                }
            });
            tableCabecera.append(trCabecera);
            table.append(tableCabecera);
            table.append('<div style="clear: both;"></div>');
            ul.append(table);
        }
        $.each(items, function (index, item) {
            self._renderItem(ul, item);
        });
    },
    _renderItem: function (ul, item) {
        var t = '',
			result = '';

        $.each(this.options.columns, function (index, column) {
            var sTexto = "";
            var sTextoNuevo = "";
            var iPosicionInicial = -1;
            var iPosicionFinal = -1;

            sTexto = item[column.FieldName != undefined ? column.FieldName : index];

            if (replaceCaracteres("á,é,í,ó,ú¥a,e,i,o,u", sTexto.toLowerCase()).indexOf(replaceCaracteres("á,é,í,ó,ú¥a,e,i,o,u", sDato.toLowerCase())) != -1) {
                iPosicionInicial = replaceCaracteres("á,é,í,ó,ú¥a,e,i,o,u", sTexto.toLowerCase()).indexOf(replaceCaracteres("á,é,í,ó,ú¥a,e,i,o,u", sDato.toLowerCase()));
                iPosicionFinal = sDato.length + iPosicionInicial;
                sTextoNuevo = sTexto.substring(iPosicionInicial, iPosicionFinal);
                sTexto = sTexto.replace(sTextoNuevo, "<span style='font-weight:900;'>" + sTextoNuevo + "</span>");
            }

            if (column.Visible) {
                t += '<td style="padding:0 4px;width:' + column.Width + '%;">' + sTexto + '</td>'
            } else {
                t += '<td style="display:none;padding:0 4px;width:' + column.Width + '%;">' + sTexto + '</td>'
            }
        });

        result = $('<li></li>')
			.data('ui-autocomplete-item', item)
			.append('<a class="mcacAnchor"><table style="width:97%;border-collapse: collapse;"><tr>' + t + '</tr></table><div style="clear: both;"></div></a>')
			.appendTo(ul);
        return result;
    }
});



// Victor Alfonso Cardona Hernandez 2014-FEB-27 (vcardona)
/// <summary>
/// CargarDatosEdicion(sValores)
/// Función: cargar los datos de la grilla en lo combos para ser modificados
/// <param name="sCaracteres"> cadena de lo caracteres con lo cuales se realizara el replace separa por '¥' para indicar cuales son los cacaratares qeue se reemplazaran '¥' caracterespor los cuales se reemplazara
/// ej: sCaracteres = "A,B,C¥a,b,c" es decir se va a reempazar A por a , B por b y C por c
/// </summary
function replaceCaracteres(sCaracteres, sCadena) {

    var vCaracteresOld = null;
    var vCaracteresNew = null;
    var iIndex = 0;

    try {
        if (sCaracteres != "") {
            vCaracteresOld = sCaracteres.split('¥')[0].split(',');
            vCaracteresNew = sCaracteres.split('¥')[1].split(',');

            if (vCaracteresOld != null && vCaracteresNew != null) {

                for (var i = 0; i < vCaracteresOld.length; i++) {

                    while (iIndex != -1) {
                        sCadena = sCadena.replace(vCaracteresOld[i], vCaracteresNew[i]);
                        iIndex = sCadena.indexOf(vCaracteresOld[i])
                    }

                    iIndex = 0
                }
                return sCadena;
            }
        }
    } catch (e) {
        alert("ERROR: replaceCaracteres(sCaracteres, sCadena)\n" + e.message + ".");
    }
}