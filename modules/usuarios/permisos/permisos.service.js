import permisosRepository from "./permisos.repository.js";

const getPermisosByRol = (idRol) => permisosRepository.findPermisosByRol(idRol);

const getModulos = () => permisosRepository.findModulos();

const getOpciones = () => permisosRepository.findOpciones();

const getAcciones = () => permisosRepository.findAcciones();

export default { getPermisosByRol, getModulos, getOpciones, getAcciones };
