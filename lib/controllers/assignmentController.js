import db from "../data/database.js";

// Obtener ayudantes disponibles (activos)
export const getAvailableHelpers = async (req, res) => {
  try {
    const helpers = await db('usuarios')
      .select('id_usuario', 'nombre', 'email', 'telefono', 'foto_perfil_url')
      .where({ 
        rol: 'ayudante', 
        activo: true 
      });

    res.status(200).json({ success: true, data: helpers });
  } catch (error) {
    console.error("Error obteniendo ayudantes:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Crear una nueva asignación
export const createAssignment = async (req, res) => {
  const { id_ayudante, id_edificio } = req.body;
  const id_inspector = req.user.id; // Viene del middleware de autenticación JWT

  try {
    // Usamos una transacción para asegurar que, si algo falla, no se cree media asignación
    await db.transaction(async (trx) => {
      
      // 1. Insertar la asignación
      const [assignment] = await trx('asignaciones_ayudante')
        .insert({ 
          id_inspector, 
          id_ayudante, 
          id_edificio, 
          estado: 'pendiente' 
        })
        .returning('*');

      // 2. Obtener nombre del edificio
      const edificio = await trx('edificios')
        .select('nombre_edificio')
        .where({ id_edificio })
        .first();
      
      const nombreEdificio = edificio?.nombre_edificio || 'un edificio';

      // 3. Crear notificación
      await trx('notificaciones').insert({
        id_usuario: id_ayudante,
        titulo: "Nueva Asignación",
        mensaje: `Has sido asignado para inspeccionar: ${nombreEdificio}`,
        tipo: 'asignacion'
      });

      res.status(201).json({ 
        success: true, 
        message: "Ayudante asignado correctamente y notificado",
        data: assignment 
      });
    });
  } catch (error) {
    // Código de error de Postgres para UNIQUE violation (si ya existe la asignación)
    if (error.code === '23505') { 
      return res.status(409).json({ 
        success: false, 
        error: "Este ayudante ya está asignado a este edificio por ti." 
      });
    }
    console.error("Error creando asignación:", error);
    res.status(500).json({ success: false, error: "Error al crear la asignación" });
  }
};