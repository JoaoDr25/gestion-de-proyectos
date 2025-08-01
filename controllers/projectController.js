import mongoose from 'mongoose';
import Project from '../models/project.js';


export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = new Project({
      name,
      description,
      owner: req.user._id
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto', error });
  }
};


export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos', error });
  }
};


export const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de proyecto inválido' });
  }

  try {
    const project = await Project.findById(id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const isAuthorized =
      project.owner.equals(req.user._id) || project.members.includes(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyecto', error });
  }
};


export const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de proyecto inválido' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No estás autorizado para actualizar este proyecto' });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proyecto', error });
  }
};


export const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de proyecto inválido' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No estás autorizado para eliminar este proyecto' });
    }

    await project.deleteOne();
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proyecto', error });
  }
};


export const addMember = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No estás autorizado para agregar miembros' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'El usuario ya es miembro del proyecto' });
    }

    project.members.push(userId);
    await project.save();

    res.json({ message: 'Miembro agregado con éxito', project });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar miembro', error });
  }
};




