# SYSGEM_WEB_APP

Aplicación web desarrollada con el objetivo de facilitar la gestión de datos dentro de una comunidad, especialmente enfocada en la administración de cargos, anuncios y perfiles de usuario.

---

## Características

-  Sistema de login de usuarios  
-  Gestión de perfiles  
-  Publicación y administración de anuncios  
-  Gestión de cargos comuneros  
-  Componentes reutilizables (header, footer)  
-  Interfaz organizada con HTML, CSS y JavaScript  

---

## 📁 Estructura del proyecto
```
SYSGEM_WEB/
│
├── backend/
|	│
|	├── server.js   
|	│
|	├── .env   
|	│
|	└── src/
|    		├── config/
|    		│   └── db.js  
|    		│
|    		├── comuneros/
|    		│   ├── comuneros_controller.js   
|    		│   └── comuneros_routes.js   
|    		│
|    		├── asignaciones_cargo/
|    		│   ├── asignaciones_controller.js   
|    		│   └── asignaciones_routes.js 
|    		│
|    		├── anuncios/
|    		│   ├── anuncios_controller.js   
|    		│   └── anuncios_routes.js   
|    		│
|    		├── login/
|    		│   ├── login_controller.js   
|    		│   └── login_routes.js
|    		│
|    		├── perfil/
|    		│   ├── perfil_controller.js   
|    		│   └── perfil_routes.js    
|
├── frontend/
|	│
|	├── index.html 
|	├── structure.html 
|	│
|	└── src/
|    		├── public/
|    		│   └── assets/
|    		│       └── logo.png
|    		│
|    		├── components/
|    		│   ├── header_panel_de_control.html
|    		│   ├── header_panel_de_anuncios.html
|    		│   ├── header_profile.html
|    		│   └── footer.html
|    		│
|    		├── Javascripts/
|    		│   ├── DB.js 
|    		│   ├── global.js
|    		│   ├── gestion_cargos.js
|    		│   ├── gestion_cargos_comuneros.js
|    		│   ├── login.js
|    		│   ├── perfil.js
|    		│   └── anuncios.js
|    		│
|    		├── views/
|    		│   ├── gestion_cargos.html
|    		│   ├── gestion_cargos_comuneros.html
|    		│   ├── gestion_de_anuncios.html
|    		│   ├── login.html
|    		│   └── user_perfil.html
|    		│
|    		├── styles/
|    		│   ├── global.css
|    		│   └── style.css
└── README.md

```
---

## Tecnologías utilizadas

- HTML5  
- CSS3  
- JavaScript (Vanilla JS)  

---
## Funcionalidades principales
### Login

Permite el acceso de usuarios mediante credenciales.

### Perfil de usuario

Visualización y gestión de información personal.

### Gestión de anuncios

Creación, edición y visualización de anuncios dentro de la comunidad.

### Gestión de cargos

Administración de roles o cargos dentro del sistema.

## Estado del proyecto

### En desarrollo
Actualmente se encuentra en mejora continua, incluyendo integración futura de backend.

## Autores

Bryan Gracida Tapia y Galilea Peralta Contreras

Desarrollo del frontend
Diseño de estructura del sistema

## Notas
Este proyecto fue desarrollado como parte de prácticas académicas.
Algunas funcionalidades pueden estar incompletas o en proceso de mejora.
