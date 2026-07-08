<p align="center">
  <img src="./src/assets/images/logo.png" alt="TomateToda Logo" width="150" />
</p>

<h1 align="center">TomateToda - App Móvil (Frontend)</h1>

<p align="center">
  <strong>Marketplace móvil que conecta a organizadores de eventos y proveedores para negociar bebidas rápidamente.</strong>
</p>

<p align="center">
  🔗 <strong>Repositorio del Backend (API Laravel):</strong> <a href="https://github.com/viclon-coder/tomatetoda-back">tomatetoda-back</a>
</p>



## 📖 Sobre el Proyecto

**TomateToda** es una aplicación móvil desarrollada como Producto Mínimo Viable (MVP). Busca solucionar la ineficiencia y fricción que sufren los organizadores de eventos al pedir cotizaciones de bebidas por WhatsApp, centralizando la demanda y permitiendo a los proveedores locales competir con propuestas económicas.

El sistema funciona como un *marketplace bidireccional* basado en roles mutuamente excluyentes, donde la privacidad es clave: los datos de contacto solo se revelan una vez que se cierra un trato.



## 🚀 Características Principales

La aplicación bifurca la experiencia de navegación según el rol del usuario:

### 👤 Rol: Organizador
* **Publicación de Eventos:** Formulario simplificado para solicitar bebidas, especificando ubicación, cantidad de personas y fecha límite.
* **Gestión de Ofertas:** Panel para comparar las cotizaciones recibidas (Pendientes, Aceptadas, Rechazadas, Caducadas).
* **Cierre de Trato y Contacto:** Al aceptar una oferta, el sistema cierra el evento automáticamente, rechaza al resto y habilita botones nativos (Deep Linking) para contactar al proveedor por WhatsApp, llamada o email.

### 🏪 Rol: Proveedor
* **Feed de Demanda:** Buscador y listado de eventos "Abiertos" en los que el proveedor aún no ha ofertado.
* **Cotización Rápida:** Formularios estandarizados para enviar el monto total y los detalles del servicio.
* **Dashboard Financiero ("Mis Ofertas"):** Panel de control con estadísticas y estados en tiempo real de todas las cotizaciones enviadas.



## 📱 Capturas de la Aplicación

A continuación, se muestran algunas de las pantallas principales del flujo de ambos usuarios:

### Flujo del Organizador


| Inicio (Mis Eventos) | Detalle y Ofertas | Datos del Proveedor |
| :---: | :---: | :---: |
| <img width="200" alt="image" src="https://github.com/user-attachments/assets/26615e70-ec69-4682-b449-fe3fbfe6ae88" /> | <img width="200" alt="image" src="https://github.com/user-attachments/assets/332444e8-2c76-4452-8fd3-1d21140816ec" /> | <img width="200" alt="image" src="https://github.com/user-attachments/assets/028c94a5-b221-4ab9-b9ba-dcb9a2c3ecef" /> |

### Flujo del Proveedor
| Eventos Disponibles | Formulario de Oferta | Dashboard (Mis Ofertas) |
| :---: | :---: | :---: |
| <img width="200" alt="image" src="https://github.com/user-attachments/assets/574a5a19-4499-4b8c-86d9-59af53462db8" /> | <img width="200" alt="image" src="https://github.com/user-attachments/assets/c69fc971-0236-4c17-8032-64f47d50dca6" /> | <img width="200" alt="image" src="https://github.com/user-attachments/assets/e15a7ad1-1d32-4bff-ab5e-10f77224f193" /> |


## 🛠 Stack Tecnológico

* **Framework:** React Native
* **Herramientas de desarrollo:** Expo
* **Enrutamiento:** Expo Router (Navegación basada en archivos)
* **Peticiones HTTP:** Axios (Comunicación con API REST en Laravel)
* **Almacenamiento Local:** AsyncStorage (Manejo de sesión y Tokens)



## ⚙️ Instalación y Uso Local
Para que la aplicación móvil funcione correctamente y muestre los datos, es indispensable levantar primero el backend (Laravel) y luego conectar la aplicación móvil (Expo) a la misma red Wi-Fi.

### Fase 1: Preparar el Backend (Laravel)
1. **Clonar el repositorio del backend:**

   Abre una terminal y descarga el código fuente del servidor:

   ```Bash
   git clone https://github.com/viclon-coder/tomatetoda-back.git
   cd tomatetoda-back
2. **Instalar dependencias de PHP:**

   Dentro de la carpeta del backend, instala los paquetes necesarios usando Composer:

   ```Bash
   composer install
3. **Configurar el entorno:**

   Copia el archivo de configuración de ejemplo y renómbralo para crear tu entorno local. En la terminal puedes usar:

   ```Bash
   cp .env.example .env
4. **Generar la clave de la aplicación:**
Ejecuta este comando para generar la clave de seguridad de Laravel:

   ```Bash
   php artisan key:generate
5. **Iniciar los servicios locales:**

   Abre XAMPP (o tu entorno similar) e inicia los servicios de Apache y MySQL.

6. **Crear la base de datos:**

   Ingresa a tu gestor (ej. phpMyAdmin en `http://localhost/phpmyadmin`) y crea una base de datos en blanco. Luego, abre tu nuevo archivo `.env` y asegúrate de actualizar la variable `DB_DATABASE` con el nombre que le pusiste.

7. **Migrar las tablas:** 

   En la terminal del backend, ejecuta las migraciones para crear las tablas necesarias en tu base de datos:

   ```Bash
   php artisan migrate
8. **Levantar el servidor web:**
   
   Inicia el servidor exponiéndolo a tu red local para que el celular o emulador pueda conectarse. Ejecuta el siguiente comando y deja esta terminal abierta:

   ```Bash
   php artisan serve --host=0.0.0.0 --port=8000
### Fase 2: Configurar y Ejecutar el Frontend (React Native / Expo)
1. Averiguar tu IP local:
   
   En Windows: Abre una nueva terminal (`cmd`), escribe `ipconfig` y anota tu "Dirección IPv4" (ej: `192.168.1.34`).

   En Mac/Linux: Escribe `ifconfig` o `ip a` en la terminal.

2. **Configurar la conexión en la App:** 

   Abre tu proyecto frontend en Visual Studio Code. Ve al archivo `src/services/api.ts` (o a tu `.env`) y cambia la URL base de Axios para que apunte a tu IP real.

   * ❌ Incorrecto: `baseURL: 'http://0.0.0.0:8000/api'` o `localhost`
   * ✅ Correcto: `baseURL: 'http://192.168.1.34:8000/api'` (usa la IP que anotaste en el paso 1)

3. **Iniciar Expo:**
   
   Abre una terminal en la raíz de tu frontend y arranca el servidor limpiando la caché:

   ```Bash
   npx expo start -c
4. **Probar la aplicación:**

   * 📱 **En un Celular Físico:** Asegúrate de estar conectado al mismo Wi-Fi que tu PC. Descarga la app Expo Go (Android/iOS) y escanea el código QR que aparece en la terminal.

   * 💻 **En un Emulador:** Si tienes Android Studio abierto, presiona la tecla a en la terminal de Expo para instalar y abrir la app.

   * 🌐 **En el Navegador:** Presiona la tecla w en la terminal para abrir una vista web de la aplicación directamente en tu PC.
