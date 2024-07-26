#!/bin/bash

# Aborta en caso de errores
set -e

# Construye el proyecto
npm run generate

# Navega al directorio de salida
cd dist

# Inicializa un nuevo repositorio Git y agrega todos los archivos
git init
git add -A
git commit -m 'deploy'

# Empuja a la rama gh-pages
git push -f git@github.com:andrsabril/recetas.git prod:prod

# Regresa al directorio anterior
cd -