import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.0' }); 


export const generateTasks = async (projectDescription) => {
  const prompt = `
Eres un asistente experto en gestión de proyectos. Con base en esta descripción:
"${projectDescription}"
genera una lista de tareas detalladas y bien organizadas. Incluye subtareas si aplica.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};


export const estimateTime = async (task) => {
  const prompt = `
Eres un asistente de productividad. Con base en los siguientes detalles de la tarea, calcula cuánto tiempo (en horas o días) podría tomar completarla de forma realista.

Responde SOLO con un número y una unidad (p. ej., "3 días" o "6 horas").

Task Details:
Title: ${task.title}
Description: ${task.description}
Priority: ${task.priority}
Status: ${task.status}
Created At: ${new Date(task.createdAt).toLocaleDateString()}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};


export const analyzeProgress = async (projectName, tasks) => {
  const formattedTasks = tasks.map((task, index) => {
    return `
${index + 1}. Title: ${task.title}
   Description: ${task.description}
   Status: ${task.status}
   Priority: ${task.priority}
   Assigned to: ${task.assignedTo?.name || 'Unassigned'}
   Created At: ${new Date(task.createdAt).toLocaleDateString()}
`;
  }).join('\n');

  const prompt = `
Eres un experto en gestión de proyectos. A continuación se presentan las tareas del proyecto "${projectName}".

Analiza el progreso general del proyecto, identifica bloqueos o cuellos de botella y brinda recomendaciones de mejora.

Tareas:
${formattedTasks}

Responde en un formato claro, como:

- Progreso general:
- Tareas críticas o bloqueadas:
- Recomendaciones:
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};


export const summarizeProject = async (project) => {
  const { name, description, tasks } = project;

  const formattedTasks = tasks.map((task, i) => {
    return `
${i + 1}. ${task.title}
   Estado: ${task.status}
   Prioridad: ${task.priority}
   Asignado a: ${task.assignedTo?.name || 'No asignado'}
`;
  }).join('\n');

  const prompt = `
Eres un asistente profesional de gestión de proyectos. A continuación tienes los datos de un proyecto:

Nombre del Proyecto: ${name}
Descripción: ${description}

Tareas:
${formattedTasks}

Crea un resumen ejecutivo breve y profesional del estado actual del proyecto. Incluye:

- Objetivo general
- Avance estimado
- Tareas destacadas (logros o pendientes críticos)
- Próximos pasos

El resumen debe ser claro, preciso y adecuado para compartir con stakeholders.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};


export const recommendImprovements = async (project) => {
  const { name, description, tasks } = project;

  const formattedTasks = tasks.map((task, i) => {
    return `
${i + 1}. ${task.title}
   Estado: ${task.status}
   Prioridad: ${task.priority}
   Asignado a: ${task.assignedTo?.name || 'No asignado'}
`;
  }).join('\n');

  const prompt = `
Eres un asesor experto en gestión de proyectos ágiles.

Con base en la siguiente información del proyecto:

Nombre: ${name}
Descripción: ${description}

Tareas:
${formattedTasks}

Proporciona recomendaciones concretas para mejorar el desarrollo del proyecto. Considera aspectos como:

- Priorización de tareas
- Asignación de recursos
- Seguimiento del progreso
- Comunicación del equipo
- Eliminación de bloqueos o cuellos de botella

Responde con un listado claro y orientado a la acción.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};

