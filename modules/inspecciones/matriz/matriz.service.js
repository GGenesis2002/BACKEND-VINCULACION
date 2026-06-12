import matrizRepository from "./matriz.repository.js";

const getAll = () => matrizRepository.findAll();

const getById = (id) => matrizRepository.findById(id);

export default { getAll, getById };
