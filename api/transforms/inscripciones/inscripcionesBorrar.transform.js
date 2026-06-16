const inscripcionesBorrarTransform = (req, res, next) => {
    req.id = Number(req.params.id);
    req.id_usuario = Number(req.user.id_usuario);
    next();
};

export default inscripcionesBorrarTransform;