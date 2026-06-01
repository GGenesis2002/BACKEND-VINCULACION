import db from "../data/database.js";

// Obtener las notificaciones del usuario logueado
export const getUserNotifications = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const notifications = await db('notificaciones')
      .where({ id_usuario: userId })
      .orderBy('created_at', 'desc')
      .limit(50);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Marcar una notificación como leída
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Actualizamos y pedimos que devuelva el registro modificado
    const updated = await db('notificaciones')
      .where({ 
        id_notificacion: id, 
        id_usuario: userId 
      })
      .update({ leida: true })
      .returning('*');
    
    // En Knex, si no encuentra nada, el array 'updated' estará vacío
    if (updated.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Notificación no encontrada o no autorizada" 
      });
    }
    
    res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error actualizando notificación:", error);
    res.status(500).json({ success: false, error: "Error al actualizar notificación" });
  }
};