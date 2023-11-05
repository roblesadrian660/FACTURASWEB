IF EXISTS
(
    SELECT *
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[usp_GestionFactura]')
          AND type IN(N'P', N'PC')
)
    BEGIN
        DROP PROCEDURE [dbo].[usp_GestionFactura];
    END;
GO
CREATE PROCEDURE [dbo].[usp_GestionFactura](
	@Accion					VARCHAR(100),
	@IdFactura				INT				= NULL,
	@NumeroFactura			INT				= NULL,
	@IdCliente				INT				= NULL,
	@NumeroTotalArticulos	INT				= NULL,
	@SubTotalFactura		DECIMAL			= NULL,
	@TotalImpuesto			DECIMAL			= NULL,
	@TotalFactura			DECIMAL			= NULL,
	@XmlFacturaDetalle		VARCHAR(MAX)	= NULL
)	
AS 
BEGIN

SET NOCOUNT ON;
SET XACT_ABORT ON;

	DECLARE	@sError VARCHAR(MAX);
	DECLARE @Xml AS XML;

	IF	@Accion = 'BuscarFactura'
	BEGIN
		SELECT	TF.Id
				,TF.NumeroFactura
				, TF.FechaEmisionFactura
				, TF.TotalFactura
				, TF.TotalImpuesto
				, TF.SubTotalFactura
				, TC.RazonSocial
		FROM	TblFacturas TF WITH(NOLOCK)
			INNER JOIN TblClientes TC WITH(NOLOCK) ON TF.IdCliente = TC.Id
		WHERE 
				(ISNULL( @NumeroFactura,'') = ''	OR	TF.NumeroFactura = @NumeroFactura)
			AND (ISNULL( @IdCliente,'') = ''		OR  TC.Id = @IdCliente)
			AND (ISNULL( @IdFactura,'') = ''		OR  TF.Id = @IdFactura)
	END;
	ELSE IF	@Accion = 'BuscarClientes'
	BEGIN
		SELECT 
			TC.Id
			,RazonSocial
			,CTC.TipoCliente
			,TC.RFC
		FROM TblClientes TC WITH(NOLOCK)
			INNER JOIN CatTipoCliente  CTC WITH(NOLOCK) ON TC.IdTipoCliente = CTC.ID
	END;
	ELSE IF	@Accion = 'BuscarProductos'
	BEGIN
		SELECT 
				CP.Id
				,CP.NombreProducto
				,CP.ImagenProducto
				,CP.PrecioUnitario
				,CP.ext
		FROM [dbo].[CatProductos] CP WITH(NOLOCK) 
	END;
	ELSE IF	@Accion = 'GuardarFactura'
	BEGIN
		BEGIN TRAN;
		BEGIN TRY
			INSERT INTO [dbo].[TblFacturas] (
				[FechaEmisionFactura]	,				 
				[IdCliente]				,			 
				[NumeroFactura]			,			 
				[NumeroTotalArticulos]	,
				[SubTotalFactura]		,
				[TotalImpuesto]			,
				[TotalFactura]
			)
			VALUES
			(
				GETDATE()				,
				@IdCliente				,
				@NumeroFactura			,
				@NumeroTotalArticulos	,
				@SubTotalFactura		,
				@TotalImpuesto			,
				@TotalFactura
			);

			SET @IdFactura  = @@identity;
			SET @Xml = CAST(@XmlFacturaDetalle AS VARCHAR(MAX));

			INSERT INTO [dbo].[TblDetallesFactura] (
					IdFactura				,
					IdProducto				,
					CantidadDeProducto		,
					PrecioUnitarioProducto	,
					SubtotalProducto		,
					Notas					
			)
			SELECT	
				@IdFactura																		,
				T.c.value('@IdProducto[1]','INT') AS IdProducto									,
				T.c.value('@CantidadDeProducto[1]','INT') AS CantidadDeProducto					,
				T.c.value('@PrecioUnitarioProducto[1]','DECIMAL(18,2)') AS CantidadDeProducto	,
				T.c.value('@SubtotalProducto[1]','DECIMAL(18,2)') AS SubtotalProducto			,
				T.c.value('@Notas[1]','VARCHAR(200)') AS Notas									
			FROM   @Xml.nodes('/FacturaDetalle/Datos') T(c);

			EXEC  [dbo].[usp_GestionFactura] @Accion ='BuscarFactura' , @IdFactura = @IdFactura
			COMMIT TRAN;
		END TRY
		BEGIN CATCH
			WHILE @@TRANCOUNT > 0
			BEGIN
				ROLLBACK TRAN;
			END;
			
			SET @sError = ERROR_MESSAGE();
			RAISERROR(@sError,16,1);
		END CATCH
	END;

END
