import mongoose from 'mongoose';
import Task from '../models/task.js';
import User from '../models/user.js';
import Project from '../models/project.js';


const hasAccessToProject = async (userId, projectId) => {
  const project = await Project.findById(projectId).populate('members');
  if (!project) return false;
  return project.members.some(member => member._id.equals(userId));
};


export const createTask = async (req, res) => {
  try {
    const { name, description, status, assignedTo, dueDate } = req.body;
    const { projectId } = req.params;

    if (!name || !status || !dueDate) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido' });
    }

    const access = await hasAccessToProject(req.user.id, projectId);
    if (!access) return res.status(403).json({ message: 'Acceso denegado al proyecto' });

    const newTask = new Task({
      name,
      description,
      status,
      assignedTo,
      dueDate,
      project: projectId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea', error });
  }
};


export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const access = await hasAccessToProject(req.user.id, projectId);
    if (!access) return res.status(403).json({ message: 'Acceso denegado al proyecto' });

    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas del proyecto', error });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name');
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, task.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado a esta tarea' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error });
  }
};


export const updateTask = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'description', 'status', 'assignedTo', 'dueDate'];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((field) => allowedUpdates.includes(field));
    if (!isValidUpdate) {
      return res.status(400).json({ message: 'Campos de actualización inválidos' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, task.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, task.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    await task.deleteOne();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
};


export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: 'Texto de comentario requerido' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, task.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    task.comments.push({ text, author: req.user.id, createdAt: new Date() });
    await task.save();

    const updatedTask = await Task.findById(id).populate('comments.author', 'name email');
    res.status(200).json({ message: 'Comentario agregado correctamente', comments: updatedTask.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar comentario', error });
  }
};


export const addSubTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, assignedTo, dueDate } = req.body;

    const parentTask = await Task.findById(id);
    if (!parentTask) return res.status(404).json({ message: 'Tarea principal no encontrada' });

    const access = await hasAccessToProject(req.user.id, parentTask.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    const newSubTask = new Task({
      name,
      description,
      status,
      assignedTo,
      dueDate,
      project: parentTask.project,
    });

    await newSubTask.save();
    parentTask.subTasks.push(newSubTask._id);
    await parentTask.save();

    res.status(201).json({ message: 'Subtarea agregada correctamente', subTask: newSubTask });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar subtarea', error });
  }
};


export const getSubTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate({
      path: 'subTasks',
      populate: { path: 'assignedTo', select: 'name' },
    });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, task.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    res.json(task.subTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener subtareas', error });
  }
};


export const deleteSubTask = async (req, res) => {
  try {
    const { id, subTaskId } = req.params;

    const parentTask = await Task.findById(id);
    if (!parentTask) return res.status(404).json({ message: 'Tarea principal no encontrada' });

    const access = await hasAccessToProject(req.user.id, parentTask.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    const deleted = await Task.findByIdAndDelete(subTaskId);
    if (!deleted) return res.status(404).json({ message: 'Subtarea no encontrada' });

    parentTask.subTasks = parentTask.subTasks.filter(subId => subId.toString() !== subTaskId);
    await parentTask.save();

    res.json({ message: 'Subtarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar subtarea', error });
  }
};


export const updateSubTask = async (req, res) => {
  try {
    const { subTaskId } = req.params;

    const subTask = await Task.findById(subTaskId);
    if (!subTask) return res.status(404).json({ message: 'Subtarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, subTask.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    Object.assign(subTask, req.body);
    await subTask.save();

    res.json({ message: 'Subtarea actualizada', subTask });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar subtarea', error });
  }
};


export const changeTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['alta', 'media', 'baja'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const access = await hasAccessToProject(req.user.id, task.project);
    if (!access) return res.status(403).json({ message: 'Acceso denegado' });

    task.status = status;
    await task.save();

    res.json({ message: 'Estado actualizado', task });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado de tarea', error });
  }
};


export const getTasksDueSoon = async (req, res) => {
  try {
    const now = new Date();
    const in7Days = new Date(now);
    in7Days.setDate(now.getDate() + 7);

    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: in7Days }
    }).populate('assignedTo', 'name');

    const filtered = [];
    for (const task of tasks) {
      const access = await hasAccessToProject(req.user.id, task.project);
      if (access) filtered.push(task);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas próximas', error });
  }
};


export const filterTasks = async (req, res) => {
  try {
    const { status, assignedTo, fromDate, toDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (fromDate || toDate) {
      filter.dueDate = {};
      if (fromDate) filter.dueDate.$gte = new Date(fromDate);
      if (toDate) filter.dueDate.$lte = new Date(toDate);
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name');

    const filtered = [];
    for (const task of tasks) {
      const access = await hasAccessToProject(req.user.id, task.project);
      if (access) filtered.push(task);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error al filtrar tareas', error });
  }
};

