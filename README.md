# SYSGEM_WEB_APP

Aplicación web desarrollada con el objetivo de facilitar la gestión de datos dentro de una comunidad, especialmente enfocada en la administración de cargos, anuncios y perfiles de usuario.

---

## Características

- 🔐 Sistema de login de usuarios  
- 👤 Gestión de perfiles  
- 📢 Publicación y administración de anuncios  
- 🏛️ Gestión de cargos comuneros  
- 🧩 Componentes reutilizables (header, footer)  
- 🎨 Interfaz organizada con HTML, CSS y JavaScript  

---

## 📁 Estructura del proyecto
```
SYSGEM_WEB/
│
├── backend/
|	│
|	├── server.js        
|	│
|	└── src/
|    		├── config/
|    		│   └── db.js  
|    		│
|    		├── comuneros/
|    		│   ├── comuneros.controller.js   
|    		│   └── comuneros.routes.js     
|
├── frontend/
|	│
|	├── index.html 
|	├── structure.html 
|	│
|	└── src/
|    		├── public/
|    		│   └── logo.png
|    		│
|    		├── components/
|    		│   └── header_panel_de_control.html
|    		│
|    		├── Javascripts/
|    		│   ├── DB.js   # (NUEVO)
|    		│   └── gestion_cargos_comuneros.js
|    		│   └── global.js
|    		│
|    		├── views/
|    		│   ├── Gestion_cargos.html
|    		│   └── Gestion_cargos_comuneros.html
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
