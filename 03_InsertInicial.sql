
IF NOT EXISTS (SELECT 1 FROM CatTipoCliente WHERE TipoCliente = 'Prueba')
BEGIN
	INSERT INTO CatTipoCliente (
		TipoCliente
	) VALUES (
		'Prueba'
	)
END

IF NOT EXISTS (SELECT 1 FROM CatTipoCliente WHERE TipoCliente = 'Prueba2')
BEGIN
	INSERT INTO CatTipoCliente (
		TipoCliente
	) VALUES (
		'Prueba2'
	)
END

IF NOT EXISTS (SELECT 1 FROM TblClientes WHERE RazonSocial = '123')
BEGIN
	INSERT INTO TblClientes (
		RazonSocial
		, IdTipoCliente
		, FechaCreacion
		, RFC
	) VALUES (
		'123'
		,1
		,GETDATE()
		,'MELM8305281H0'
	)
END

IF NOT EXISTS (SELECT 1 FROM TblClientes WHERE RazonSocial = '1234')
BEGIN
	INSERT INTO TblClientes (
		RazonSocial
		, IdTipoCliente
		, FechaCreacion
		, RFC
	) VALUES (
		'1234'
		,2
		,GETDATE()
		,'MELM8305281H0'
	)
END

IF NOT EXISTS (SELECT 1 FROM TblFacturas WHERE NumeroFactura = 12345)
BEGIN

	INSERT INTO TblFacturas (
		FechaEmisionFactura
		,IdCliente
		,NumeroFactura
		,NumeroTotalArticulos
		,SubTotalFactura
		,TotalImpuesto
		,TotalFactura
	) VALUES (
		GETDATE()
		,1
		,12345
		,1
		,1000
		,190
		,1190
	)
END

IF NOT EXISTS (SELECT 1 FROM CatProductos WHERE NombreProducto = 'Manzana')
BEGIN
	INSERT INTO CatProductos (
		NombreProducto
		,ImagenProducto
		,PrecioUnitario
		,ext
	) VALUES (
		'Manzana'
		,0x48656C6C6F20576F726C64
		,1000
		,'PRU'
	)
END


IF NOT EXISTS (SELECT 1 FROM CatProductos WHERE NombreProducto = 'PERA')
BEGIN
	INSERT INTO CatProductos (
		NombreProducto
		,ImagenProducto
		,PrecioUnitario
		,ext
	) VALUES (
		'PERA'
		,0x48656C6C6F20576F726C64
		,1000
		,'PRU'
	)
END


IF NOT EXISTS (SELECT 1 FROM TblDetallesFactura WHERE IdFactura = 1)
BEGIN
	INSERT INTO TblDetallesFactura (
		IdFactura
		,IdProducto
		,CantidadDeProducto
		,PrecioUnitarioProducto
		,SubtotalProducto
		,Notas
	) VALUES (
		1
		,1
		,1
		,1000
		,1000
		,'Prueba'
	)
END