/*
* 	CrudTabla 1.0  - jQuery Plugin
*	Written by Carlos Ríos Ochoa
*	Copyright(c) 2012 Sysnet LTDA.
*	Built for jQuery library
*	http://jquery.com
*   Descripción:
*   Crea un tabla en cliente y permiste sobre ella operaciones básicas como insertar, eliminar.
*   Éste aplica sólo a un div    
*/

jQuery.fn.crudTabla = function (options) {

    var defaults =
    {
        nombre: "medicamentos",
        mostrarTitulo: true,
        columnas: [
		            { encabezado: 'Código', width: '15%', align: 'left', tipo: 'int', key: true, nombre: "codigo", control:'' },
		            { encabezado: 'Descripción', width: '74%', align: 'left', tipo: 'string', key: false, nombre: "descripcion", control:'' }
		],
        width: '100%',
        height: '100%',
        btnEliminar: true,
        tipAgregar: 'Agregar',
        tipEliminar: 'Eliminar',
        alignColNumber: 'center',
        widthColNumber: '1%',
        textColNumber: '#',
        colNumber: true,
        colDelete: true,
        widthColDelete: '10%',
        textColDelete: '#',
        alignColDelete: 'center',
        tema: 'a',
        idTabla: '',
        rowEditableTop: true,
        startMsgError: 'Debe indicar el valor para el campo: ',
        showAlert: false,
        showAlertExist: false,
        msgExist: 'Éste registro ya existe, por favor verifique'
    };

    var settings = jQuery.extend(defaults, options);

    this.each(function () 
    {
        var registroXml = document.createElement('ul');
        var object = jQuery(this);
        object.css('width', settings.width);
        object.css('height', settings.height);
        var tabla = $('<div class="div_crudtable" ><table width="100%"  cellpadding="5" cellspacing="0" ' + (settings.idTabla = '' ? settings + 'table_' + nombre : settings.idTabla) + ' class="crudtabla-' + settings.tema + '" ><tbody></tbody></table></div>');
        object.data("registro",registroXml);

        //Adicionamos la columnas th        
        var tr = document.createElement('tr');
        if (settings.colNumber) {
            var thNumber = document.createElement('th');
            var divNumber = document.createElement('div');
            $(thNumber).attr('width', settings.widthColNumber);
            $(thNumber).attr('align', settings.alignColNumber);
            divNumber.innerHTML = settings.textColNumber;
            $(divNumber).attr('align', settings.alignColNumber)

            $(thNumber).html(divNumber);
            $(tr).append(thNumber);
        }



        for (var i = 0; i < settings.columnas.length; i++) {
            var col = settings.columnas[i];
            var th = document.createElement('th');
            var div = document.createElement('div');
            $(th).attr('col', 'col' + i);
            $(th).attr('width', col.width);
            $(div).css('width', "100%");
            $(th).attr('align', col.align);
            $(th).attr('type', 'tipo');
            $(th).attr('key', col.key);
            div.innerHTML = col.encabezado;
            $(div).attr('align', col.align);
            $(th).html(div);
            $(tr).append(th);
        }

        if (settings.colDelete) {
            //Agregar la columna paras las acciones
            var thDelete = document.createElement('th');
            var divDelete = document.createElement('div');
            $(thDelete).attr('width', settings.widthColDelete);
            $(thDelete).attr('align', settings.alignColDelete);
            $(thDelete).attr('class', "crudtabla_colDelete");
            divDelete.innerHTML = settings.textColDelete;
            $(divDelete).attr('align', settings.alignColDelete);
            $(thDelete).html(divDelete);
            $(tr).append(thDelete);
        }

        
        tabla.find('tbody').append(tr);
        AddRowEdit();
        object.html(tabla);





        //Adiciona una fila a tabla para la edición
        function AddRowEdit() {
            var trEdit = document.createElement('tr');
            var btnAdd = $('<div  height="24px" width="24px" title="' + settings.tipAgregar + '"  class="crudtabla_addbutton"><label>&#160;&#160;&#160;&#160;&#160;' + settings.tipAgregar + '</label></div>');

            //Agregar la columna contadora
            if (settings.colNumber) {
                $(trEdit).append(document.createElement('td'));
            }
            for (var i = 0; i < settings.columnas.length; i++) {
                var col = settings.columnas[i];
                var td = getColumnaType(col);
                if (td) {
                    $(trEdit).append(td);
                }
            }
            //Agregar la columna agregar
            var tdAgregar = document.createElement('td');
            $(tdAgregar).html(btnAdd);
            $(tdAgregar).attr('class', 'crudtabla_td_opciones');
            $(trEdit).append(tdAgregar);
            tabla.find('tbody').append(trEdit);

              //Agregamos el evento al botón add
                btnAdd.click(
                    function (s) 
                    {
                       newRow();
                    }
                );
        }


        function getColumnaType(col) {

            var text;
            var td;

            var contenedor = $('<div width="100%"></div>');            
            if( col.tipo == "int" ||  col.tipo == "string" ||  col.tipo == "date"   )
            {
                text = $('<input type="text" class="crudtabla_' + col.tipo + '" />');

            }else if(  col.tipo == "select"  )
            {
                if(col.control)
                {
                     text = $('#'+col.control).clone();
                     $(text).removeClass("hide");
                     $(text).addClass("crudtabla_"+col.tipo);
                     $(text).css('width','100%');
                     $(text).find('option:first-child').before(new Option("", ""));
                     $(text).find('option:first-child').val("");
                }
            }

            $(text).addClass("crud_tabla_edit");
            $(contenedor).append(text);
            $(text).attr("id", col.nombre);
            $(text).data("columna",col);
            td = document.createElement('td');
            $(td).attr("width", col.width);
            $(td).append(contenedor);

            if(  col.tipo == "date" ) 
            {
                $(text).datepicker({
                        changeMonth: true,
                        changeYear: true,
                    });
                    $(text).attr('readonly', 'true');                    
            }
            
            return td;
        }


        function clearControls()
        {
            $(tabla).find(".crud_tabla_edit").each(function(i)
            {
               $(this).val("");
            });
            
            $(tabla).find(".crud_tabla_edit:eq(0)").focus();
        
        }
        //Hace las validaciones y agrega una nueva fila
        function newRow()
        {
            var bRetorno = false;    
            var iCount = 0;        
            $(tabla).find(".crud_tabla_edit").each(function(i)
            {
              
               if( $(this).val() == "" && bRetorno == false)
               {
                     var rCol =   $(this).data("columna");                    
                     $(this).addClass("crud_tabla_error");
                     if(settings.showAlert){
                        alert(settings.startMsgError +  rCol.encabezado);
                     }
                     $(this).focus();     
                     bRetorno = true;                
               }else{
                     $(this).removeClass("crud_tabla_error");
                     ++iCount;
               }

            }); 

            if( $(tabla).find(".crud_tabla_edit").length ==  iCount )
            {
                addRow();
                clearControls();
           }
        }


        
        //Re-ordena los indices, para que sea coherente el orden
        function shorlist() {
                object.find('.crudtabla_colnumber').each(function (i) {
                        $(this).html(++i);
                    }
                );
        }

        function addRow()
        {
            var trEdit = document.createElement('tr');
            var index;
            var btnDelete = $('<div  height="24px" width="24px" title="' + settings.tipEliminar + '"  class="crudtabla_closebutton"><label>&#160;&#160;&#160;&#160;&#160;' + settings.tipEliminar + '</label></div>');
            var itemLi = document.createElement('li');
            var exist = false;

            index = parseInt($(tabla).find('tr').length) - 2;
            index = ( index ==  0 ? 1 : ++index);
            
             //Columna Number
            if (settings.colNumber) 
            {
                var tdNumber = document.createElement('td');  
                var containerNumber = document.createElement('div');
                $(containerNumber).addClass('crudtabla_colnumber');                
                containerNumber.innerHTML = index;
                $(tdNumber).append(containerNumber);       
                $(trEdit).append(tdNumber);       
            }


            $(tabla).find(".crud_tabla_edit").each(function(i)
            {
                //Agregar cada una de las columnas
                var thNew = document.createElement('td');
                var valor;
                var rCol = $(this).data("columna");
                valor = (rCol.tipo == 'select' ?  $(this).find('option:selected').text() : $(this).val() );
                thNew.innerHTML  = valor;
                $(thNew).data("columna_cell",rCol);
                $(thNew).addClass("crud_tabla_item");
                $(trEdit).append(thNew);                       
                $(itemLi).attr(rCol.nombre,valor);               
            });

              //Boton Eliminar
                if (settings.colNumber) 
                {
                    var tdDelete = document.createElement('td');    
                    $(tdDelete).html(btnDelete);                                        
                    $(trEdit).append(tdDelete);  
                    $(btnDelete).data("row",trEdit);
                    
                    
                    //Agregamos el evento al botón eliminar
                    btnDelete.click(
                        function (s) 
                        {
                          var row = $(this).data("row");
                          var li  =  document.createElement('li');
                          $(row).find(".crud_tabla_item").each(
                            function()
                            {
                              var col_temp = $(this).data("columna_cell");
                              $(li).attr(col_temp.nombre, $(this).html());      
                            }
                          ); 
                          //Eliminar la fila 
                          $(row).remove();
                          shorlist();

                          //Eliminar el dato del diccionario
                          //Mejorar el eliminado para una posterior adicion de ordenación
                          registroXml =  object.data("registro");
                          $(registroXml).find('li').each(
                            function(){
                                if( $(this)[0].outerHTML == li.outerHTML ){
                                    $(this).remove();
                                }
                            }
                          );
                         object.data("registro",registroXml); 
                        }
                    );    
                }


         //Verificar si existe en el diccinario
        //Mejorar el eliminado para una posterior adicion de ordenación
        registroXml =  object.data("registro");
        $(registroXml).find('li').each(
        function(){
            if( $(this)[0].outerHTML == itemLi.outerHTML )
            {
                exist = true;
            }
        }
        );

            if(!exist ) 
            {
                 registroXml =  object.data("registro");
                 $(registroXml).append(itemLi);             
                 object.data("registro",registroXml);    


                    if(settings.rowEditableTop){
                        $(tabla).find('tr:last').after(trEdit);                   
                    }else{
                        $(tabla).find('tr:last').before(trEdit);                   
                    }
            }else{
                 if(settings.showAlertExist)
                 {
                    alert(settings.msgExist);
                 }
            }
        }

    });



    return this;
};


