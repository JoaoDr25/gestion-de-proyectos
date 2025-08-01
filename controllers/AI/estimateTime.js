import { estimateTime as estimateTimeService } from '../../services/geminiService.js';

export const estimateTime = async (req, res) => {
  try {
    const task = req.body;

    if (!task || !task.title || !task.description) {
      return res.status(400).json({ message: 'Datos de tarea incompletos' });
    }

    const estimatedTime = await estimateTimeService(task);
    res.json({ estimatedTime });
  } catch (error) {
    console.error('Error al estimar tiempo:', error);
    res.status(500).json({ message: 'Error en estimación con IA' });
  }
};


