var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");

var jwt = require("jsonwebtoken");
var config = require("./config");
var UserModel = require("./app/models/users");

/* Configuracion */
var port = process.env.PORT || 8080;
mongoose.connect(config.database, { useNewUrlParser: true }, function(err) {
  if (err) {
    console.log("Error al conectar a bdd: ", err);
  }
  if (!err) {
    console.log("Conectado a bdd");
  }
});

app.set("superSecret", config.secret);

/* Usar bodyParser para obtener los parametros y data de POST*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Usar morgan para logear los request */
app.use(morgan("dev"));

/* Rutas basicas */
app.get("/", function(req, res) {
  res.send("Hola! API funcionando http://localhost:" + port + "/api");
});

app.get("/setup", function(req, res) {
  var user1 = new UserModel({
    name: "user1",
    password: "1234",
    admin: true
  });

  user1.save(function(err) {
    if (err) {
      throw err;
    }
    res.json({ success: true });
  });
});

/* Rutas del API*/
var apiRoutes = express.Router();

//TODO: ruta para autenticar un usuario
apiRoutes.get("/authenticate", function(req, res) {
  UserModel.findOne({ name: req.body.name }, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({
        success: false,
        message: "Falló autenticación. Usuario no encontrado!"
      });
    }

    if (user) {
      var correctPassword = user.password === req.body.password;
      console.log("CORRECT ??", correctPassword);
      if (!correctPassword) {
        res.json({
          success: false,
          message: "Falló autenticación. Error en password!"
        });
      }

      if (correctPassword) {
        var token = jwt.sign(user.toJSON(), app.get("superSecret"), {
          expiresIn: 180 //time in seconds
        });

        res.json({ success: true, message: "Token generado", token: token });
      }
    }
  });
});

//TODO: en middleware para verificar el token
apiRoutes.use(function(req, res, next) {
  //Buscar el token en headers, body o query
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    //verifica el secret
    jwt.verify(token, app.get("superSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Falló al verificar token"
        });
      }

      if (!err) {
        req.decoded = decoded;
        next();
      }
    });
  }

  if (!token) {
    res.json({ success: false, message: "No existe el token" });
  }
});

//TODO: Ruta solamente para mostrar un mensaje de bienvenida
apiRoutes.get("/", function(req, res) {
  res.json({ message: "Bienvenido al API" });
});

//TODo: Ruta para obtener todos los usuarios
apiRoutes.get("/users", function(req, res) {
  UserModel.find({}, function(err, results) {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

app.use("/api", apiRoutes);

app.listen(port);
console.log("Server at http://localhost:" + port);
