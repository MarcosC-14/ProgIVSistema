const cursosBorrarTransform = (req, res, next) => {
    req.id = Number(req.params.id);
    req.idUsuarioModificacion = Number(req.user.id_usuario);
    
    next();
};

export default cursosBorrarTransform;