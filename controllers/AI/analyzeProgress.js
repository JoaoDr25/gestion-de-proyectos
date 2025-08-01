import { analyzeProgress } from '../../services/geminiService.js';

export const analyzeProjectProgress = async (req, res) => {
  try {
    const { projectName, tasks } = req.body;

    if (!projectName || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: 'Se requiere el nombre del proyecto y una lista de tareas' });
    }

    const analysis = await analyzeProgress(projectName, tasks);
    res.json({ analysis });
  } catch (error) {
    console.error('Error al analizar progreso del proyecto con IA:', error);
    res.status(500).json({ message: 'Error en análisis de progreso con IA' });
  }
};
