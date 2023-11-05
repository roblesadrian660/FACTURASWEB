
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CatTipoCliente')
BEGIN 
	CREATE TABLE CatTipoCliente (
		ID INT PRIMARY KEY  IDENTITY(1,1) NOT NULL,
		TipoCliente varchar(50)
	);
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TblClientes')
BEGIN 
	CREATE TABLE TblClientes (
		Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
		RazonSocial VARCHAR(200),
		IdTipoCliente INT,
		FechaCreacion DATE,
		RFC VARCHAR(50),

		CONSTRAINT FK_IdTipoCliente_CatTipoCliente FOREIGN KEY (IdTipoCliente)
        REFERENCES dbo.CatTipoCliente (ID)
	);
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TblFacturas')
BEGIN 
	CREATE TABLE TblFacturas (
		Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
		FechaEmisionFactura DATETIME,
		IdCliente INT,
		NumeroFactura INT,
		NumeroTotalArticulos INT,
		SubTotalFactura DECIMAL(18,2),
		TotalImpuesto DECIMAL(18,2),
		TotalFactura DECIMAL(18,2)

		CONSTRAINT FK_IdCliente_TblClientes FOREIGN KEY (IdCliente)
        REFERENCES dbo.TblClientes (Id)
	);
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CatProductos')
BEGIN 
	CREATE TABLE CatProductos (
		Id INT PRIMARY KEY  IDENTITY(1,1) NOT NULL,
		NombreProducto VARCHAR(50),
		ImagenProducto IMAGE,
		PrecioUnitario DECIMAL(18,2),
		ext VARCHAR(5)
	);
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TblDetallesFactura')
BEGIN 
	CREATE TABLE TblDetallesFactura (
		Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
		IdFactura INT,
		IdProducto INT,
		CantidadDeProducto INT,
		PrecioUnitarioProducto DECIMAL(18,2),
		SubtotalProducto DECIMAL(18,2),
		Notas VARCHAR(200),

		CONSTRAINT FK_IdFactura_TblFacturas FOREIGN KEY (IdFactura)
        REFERENCES dbo.TblFacturas (Id),

		CONSTRAINT FK_IdProducto_CatProductos FOREIGN KEY (IdProducto)
        REFERENCES dbo.CatProductos (Id)

	);
END