import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import bucket from "../../shared/supabase/supabase.js";
import { EdificioSchema, UpdateEdificioSchema } from "./edificios.schema.js";
import edificiosRepository from "./edificios.repository.js";

const BOOLEAN_FIELDS = ["ampliacion", "historico", "albergue", "gubernamental"];
const NUMBER_INT_FIELDS = ["numero_pisos", "anio_construccion", "anio_codigo", "anio_ampliacion", "unidades"];
const NUMBER_FLOAT_FIELDS = ["latitud", "longitud", "area_total_piso"];

const coerceTypes = (data) => {
  NUMBER_INT_FIELDS.forEach((k) => { if (data[k] !== undefined) data[k] = parseInt(data[k]); });
  NUMBER_FLOAT_FIELDS.forEach((k) => { if (data[k] !== undefined) data[k] = parseFloat(data[k]); });
  BOOLEAN_FIELDS.forEach((k) => { if (data[k] !== undefined) data[k] = data[k] === "1" || data[k] === true; });
  return data;
};

const uploadFile = async (file, folder) => {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  const { data, error } = await bucket
    .from(process.env.STORAGE_BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = bucket.from(process.env.STORAGE_BUCKET).getPublicUrl(fileName);
  return publicUrl;
};

const getAll = () => edificiosRepository.findAll();

const getById = async (id) => {
  const edificio = await edificiosRepository.findById(id);
  if (!edificio) throw new utils.CustomError(AnomalyCode.notFound, "Edificio no encontrado");
  return edificio;
};

const create = async (body, files) => {
  coerceTypes(body);

  if (files?.foto_edificio) body.foto_edificio_url = await uploadFile(files.foto_edificio, "edificios/foto");
  if (files?.grafico_edificio) body.grafico_edificio_url = await uploadFile(files.grafico_edificio, "edificios/grafico");

  const parsed = EdificioSchema.parse({ ...body, foto_edificio: files?.foto_edificio, grafico_edificio: files?.grafico_edificio });
  const { foto_edificio, grafico_edificio, ...data } = parsed;

  const trx = await db.transaction();
  try {
    const [edificio] = await edificiosRepository.insert(trx, data);
    await trx.commit();
    return edificio;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const update = async (id, body, files) => {
  await getById(id);
  coerceTypes(body);

  if (files?.foto_edificio) body.foto_edificio_url = await uploadFile(files.foto_edificio, "edificios/foto");
  if (files?.grafico_edificio) body.grafico_edificio_url = await uploadFile(files.grafico_edificio, "edificios/grafico");

  const parsed = UpdateEdificioSchema.parse({ ...body, foto_edificio: files?.foto_edificio, grafico_edificio: files?.grafico_edificio });
  const { foto_edificio, grafico_edificio, ...data } = parsed;

  const trx = await db.transaction();
  try {
    const [edificio] = await edificiosRepository.update(trx, id, data);
    await trx.commit();
    return edificio;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const remove = async (id) => {
  await getById(id);
  const trx = await db.transaction();
  try {
    const deleted = await edificiosRepository.remove(trx, id);
    await trx.commit();
    return deleted > 0;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { getAll, getById, create, update, remove };
