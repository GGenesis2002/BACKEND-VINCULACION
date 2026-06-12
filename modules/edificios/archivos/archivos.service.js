import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import bucket from "../../shared/supabase/supabase.js";
import archivosRepository from "./archivos.repository.js";

const getByEdificio = (idEdificio) => archivosRepository.findByEdificio(idEdificio);

const upload = async (idEdificio, file) => {
  if (!file || !file.buffer) {
    throw new utils.CustomError(AnomalyCode.missingData, "Archivo no recibido");
  }

  const fileName = `edificios/${idEdificio}/${Date.now()}-${file.originalname}`;
  const { data, error } = await bucket
    .from(process.env.STORAGE_BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
  if (error) throw error;

  const { data: { publicUrl } } = bucket.from(process.env.STORAGE_BUCKET).getPublicUrl(fileName);

  const trx = await db.transaction();
  try {
    const [archivo] = await archivosRepository.insert(trx, {
      id_edificio: idEdificio,
      nombre_archivo: file.originalname,
      url_archivo: publicUrl,
      tipo_archivo: file.mimetype,
    });
    await trx.commit();
    return archivo;
  } catch (err) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, err.message);
  }
};

const remove = async (idArchivo) => {
  const archivo = await archivosRepository.findById(idArchivo);
  if (!archivo) throw new utils.CustomError(AnomalyCode.notFound, "Archivo no encontrado");

  const trx = await db.transaction();
  try {
    await archivosRepository.remove(trx, idArchivo);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { getByEdificio, upload, remove };
