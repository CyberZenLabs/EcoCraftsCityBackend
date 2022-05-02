const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const express = require("express")
const blah = require("../routes/productRoutes")
const router = express.Router()


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API DOCS",
      version: 1
      
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormal: "JWT",
        },
      },
    },
  },
  secuirty: {
    bearerAuth: [],
  },
  apis: ["../routes/productRoutes.js", "../routes/userRoutes.js"],
};

const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {

    //Swagger page
    router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    app.get("docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.send(swaggerSpec)
    })
    

    //Docs in JSON
}

module.exports = {
    swaggerDocs,
    swaggerRouter: router
}
