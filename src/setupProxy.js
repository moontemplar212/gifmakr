module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header('Cross-Origin-Opener-Policy', 'same-origin');
        res.header('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
    });
  };