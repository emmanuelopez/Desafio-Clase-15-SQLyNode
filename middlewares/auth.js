const isAdmin = (req, res, next) => {
    if(req.body.is_admin) next();
    res.json({
        error: "Esta operacion solo se puede ejecutar con permisos de administrador",
    });
};

/*module.exports = {
    isAdmin,
};*/