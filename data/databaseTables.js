const schema = "public";

const usuarios = `${schema}.usuarios`;
const tokensRecuperacion = `${schema}.tokens_recuperacion`;
const catalogos = `${schema}.catalogos`;
const edificios = `${schema}.edificios`;
const archivosEdificio = `${schema}.archivos_edificio`;
const inspecciones = `${schema}.inspecciones`;
const archivosInspeccion = `${schema}.archivos_inspeccion`;
const comentariosInspeccion = `${schema}.comentarios_inspeccion`;
const matrizPuntuacion = `${schema}.matriz_puntuacion`;
const resultadosInspeccion = `${schema}.resultados_inspeccion`;
const historialAuditoria = `${schema}.historial_auditoria`;
const roles = `${schema}.roles`;
const usuariosRoles = `${schema}.usuarios_roles`;
const estadosInspeccion = `${schema}.estados_inspeccion`;
const modulos = `${schema}.modulos`;
const opciones = `${schema}.opciones`;
const acciones = `${schema}.acciones`;
const opcionAcciones = `${schema}.opcion_acciones`;
const rolPermisos = `${schema}.rol_permisos`;

const DatabaseTable = {
  usuarios,
  tokensRecuperacion,
  catalogos,
  edificios,
  archivosEdificio,
  inspecciones,
  archivosInspeccion,
  comentariosInspeccion,
  matrizPuntuacion,
  resultadosInspeccion,
  historialAuditoria,
  roles,
  usuariosRoles,
  estadosInspeccion,
  modulos,
  opciones,
  acciones,
  opcionAcciones,
  rolPermisos,
};

export default DatabaseTable;
