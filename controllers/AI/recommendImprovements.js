import { recommendImprovements } from '../../services/geminiService.js';

export const recommendImprovementsController = async (req, res) => {
  try {
    const project = req.body;

    if (!project || !project.name || !project.description || !Array.isArray(project.tasks)) {
      return res.status(400).json({ message: 'Datos del proyecto incompletos' });
    }

    const recommendations = await recommendImprovements(project);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error al generar recomendaciones con IA:', error);
    res.status(500).json({ message: 'Error al generar recomendaciones con IA' });
  }
};
