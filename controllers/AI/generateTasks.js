import { generateTasks as generateTasksService } from '../../services/geminiService.js';

export const generateTasks = async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription || projectDescription.trim() === '') {
      return res.status(400).json({ message: 'La descripción del proyecto es requerida' });
    }

    const tasks = await generateTasksService(projectDescription);
    res.json({ tasks });
  } catch (error) {
    console.error('Error al generar tareas con IA:', error);
    res.status(500).json({ message: 'Error al generar tareas con IA', error });
  }
};


