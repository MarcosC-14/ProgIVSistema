const cursosBorrarTransform = (req, res, next) => {
    req.id = Number(req.params.id);
    
    next();
};

export default cursosBorrarTransform;