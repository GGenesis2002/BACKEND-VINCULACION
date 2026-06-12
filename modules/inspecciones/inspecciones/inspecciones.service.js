import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import { InspeccionSchema, UpdateInspeccionSchema, CambiarEstadoSchema } from "./inspecciones.schema.js";
import inspeccionesRepository from "./inspecciones.repository.js";
import estadosRepository from "../estados/estados.repository.js";

const coerceTypes = (data) => ({
  ...data,
  id_edificio: data.id_edificio !== undefined ? parseInt(data.id_edificio) : undefined,
  puntuacion_final: data.puntuacion_final != null ? parseFloat(data.puntuacion_final) : null,
  revision_planos: data.revision_planos !== undefined ? String(data.revision_planos) === "true" : undefined,
  requiere_nivel2: data.requiere_nivel2 !== undefined ? String(data.requiere_nivel2) === "true" : undefined,
  otros_peligros:
    typeof data.otros_peligros === "string"
      ? JSON.parse(data.otros_peligros)
      : data.otros_peligros,
});

const getAll = () => inspeccionesRepository.findAll();

const getById = async (id) => {
  const inspeccion = await inspeccionesRepository.findById(id);
  if (!inspeccion) throw new utils.CustomError(AnomalyCode.notFound, "Inspección no encontrada");
  return inspeccion;
};

const getByEdificio = (idEdificio) => inspeccionesRepository.findByEdificio(idEdificio);

const create = async (body) => {
  const parsed = InspeccionSchema.parse(coerceTypes(body));
  const trx = await db.transaction();
  try {
    const [inspeccion] = await inspeccionesRepository.insert(trx, parsed);
    await trx.commit();
    return inspeccion;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const update = async (id, body) => {
  await getById(id);
  const parsed = UpdateInspeccionSchema.parse(coerceTypes(body));
  const trx = await db.transaction();
  try {
    const [inspeccion] = await inspeccionesRepository.update(trx, id, parsed);
    await trx.commit();
    return inspeccion;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const cambiarEstado = async (id, body) => {
  const { estado } = CambiarEstadoSchema.parse(body);
  const estadoValido = await estadosRepository.findByCodigo(estado);
  if (!estadoValido) throw new utils.CustomError(AnomalyCode.notFound, `Estado '${estado}' no existe`);

  await getById(id);
  const trx = await db.transaction();
  try {
    const [inspeccion] = await inspeccionesRepository.update(trx, id, { estado });
    await trx.commit();
    return inspeccion;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { getAll, getById, getByEdificio, create, update, cambiarEstado };
