import { summarizeProject } from '../../services/geminiService.js';

export const summarizeProjectController = async (req, res) => {
  try {
    const project = req.body;

    if (!project || !project.name || !project.description || !Array.isArray(project.tasks)) {
      return res.status(400).json({ message: 'Datos del proyecto incompletos' });
    }

    const summary = await summarizeProject(project);
    res.json({ summary });
  } catch (error) {
    console.error('Error al generar resumen del proyecto con IA:', error);
    res.status(500).json({ message: 'Error al generar resumen con IA' });
  }
};
