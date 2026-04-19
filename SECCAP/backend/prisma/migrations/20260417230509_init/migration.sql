-- CreateTable
CREATE TABLE "sys_usuario" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "intentos_fallidos" SMALLINT NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sys_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_rol" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_permiso" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(80) NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,

    CONSTRAINT "sys_permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_usuario_rol" (
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "asignado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignado_por" INTEGER,

    CONSTRAINT "sys_usuario_rol_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- CreateTable
CREATE TABLE "sys_rol_permiso" (
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "sys_rol_permiso_pkey" PRIMARY KEY ("id_rol","id_permiso")
);

-- CreateTable
CREATE TABLE "sys_sesion" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "ip_origen" VARCHAR(45) NOT NULL,
    "user_agent" VARCHAR(255) NOT NULL,
    "creada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "revocada_en" TIMESTAMP(3),

    CONSTRAINT "sys_sesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" BIGSERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "timestamp_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accion" VARCHAR(50) NOT NULL,
    "endpoint" VARCHAR(200) NOT NULL,
    "metodo_http" VARCHAR(10) NOT NULL,
    "filtros_aplicados" JSONB,
    "status_code" SMALLINT NOT NULL,
    "resultado" VARCHAR(20) NOT NULL,
    "cantidad_registros" INTEGER NOT NULL,
    "ip_origen" VARCHAR(45) NOT NULL,
    "user_agent" VARCHAR(255) NOT NULL,
    "duracion_ms" INTEGER,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_configuracion" (
    "clave" VARCHAR(100) NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "modificable_en_runtime" BOOLEAN NOT NULL DEFAULT false,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "sys_configuracion_pkey" PRIMARY KEY ("clave")
);

-- CreateTable
CREATE TABLE "cache_catalogo" (
    "id" SERIAL NOT NULL,
    "tipo_catalogo" VARCHAR(80) NOT NULL,
    "contenido_json" JSONB NOT NULL,
    "origen" VARCHAR(50) NOT NULL,
    "cargado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ttl_segundos" INTEGER NOT NULL,
    "vigente" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cache_catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_usuario_username_key" ON "sys_usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "sys_rol_nombre_key" ON "sys_rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "sys_permiso_codigo_key" ON "sys_permiso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cache_catalogo_tipo_catalogo_key" ON "cache_catalogo"("tipo_catalogo");

-- AddForeignKey
ALTER TABLE "sys_usuario_rol" ADD CONSTRAINT "sys_usuario_rol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "sys_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_usuario_rol" ADD CONSTRAINT "sys_usuario_rol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "sys_rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_rol_permiso" ADD CONSTRAINT "sys_rol_permiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "sys_rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_rol_permiso" ADD CONSTRAINT "sys_rol_permiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "sys_permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_sesion" ADD CONSTRAINT "sys_sesion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "sys_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "sys_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
