# ----- 1. FASE DE CONSTRUCCIÓN (Build Stage) -----
# Usamos una imagen de Node.js para construir la app
FROM node:22 AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /overdle

# Copiamos la "lista de ingredientes"
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo el código fuente de React
COPY . .

# Ejecutamos el script de "build", que crea los archivos estáticos en /app/dist
RUN npm run build


# ----- 2. FASE DE SERVIDOR (Serve Stage) -----
# Usamos una imagen de Nginx (un servidor web súper ligero)
FROM nginx:alpine

# Copiamos SOLAMENTE los archivos construidos de la fase anterior
# (Vite guarda el build en la carpeta 'dist')
COPY --from=builder /overdle/dist /usr/share/nginx/html

# Exponemos el puerto 80, que es el que usa Nginx por defecto
EXPOSE 80

# Nginx se inicia automáticamente, por lo que no se necesita un CMD