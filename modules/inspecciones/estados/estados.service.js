import estadosRepository from "./estados.repository.js";

const getAll = () => estadosRepository.findAll();

export default { getAll };
