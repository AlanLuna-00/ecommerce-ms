# 🧩 Micro-Ecommerce con NestJS + RabbitMQ

Este proyecto es una aplicación backend basada en **microservicios** con **comunicación asincrónica mediante eventos**, construida en **NestJS**. Cada microservicio es completamente independiente, con su propia base de datos y stack tecnológico. La comunicación se realiza a través de **RabbitMQ** como Event Bus.

---

## 📐 Arquitectura General

- Cada carpeta representa un microservicio aislado o componente del sistema.
- Todos los servicios están dockerizados y se comunican entre sí mediante eventos.
- No existe un orquestador central: los servicios reaccionan a eventos emitidos por otros servicios.


```
                     [ RabbitMQ ]
                     ↗   ↑    ↖
                  emit   |   subscribe
                     ↓   ↓    ↓
\[ Gateway ] → \[ Users ] \[ Products ] \[ Orders ] \[ Payments ] \[ Notifications ]

```

---

## 🗂️ Estructura de Carpetas

| Carpeta           | Tipo              | Descripción                                                                                                                                   |
|-------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `gateway/`         | API Gateway       | Expone los endpoints HTTP públicos. Puede delegar a los microservicios mediante HTTP o publicar eventos a RabbitMQ.                          |
| `users/`           | Microservicio     | Gestiona usuarios, autenticación y tokens JWT. Utiliza **MySQL** como base de datos.                                                         |
| `products/`        | Microservicio     | Maneja el catálogo de productos y stock. Utiliza **PostgreSQL** como base de datos.                                                          |
| `orders/`          | Microservicio     | Gestiona órdenes de compra. Utiliza **MongoDB** para almacenar órdenes con ítems embebidos (`nested`).                                       |
| `payments/`        | Microservicio     | Simula el procesamiento de pagos y emite eventos de resultado. Utiliza **Redis** como store temporal.                                        |
| `notifications/`   | Microservicio     | Escucha eventos como `order.created` o `payment.completed` para enviar notificaciones. No requiere base de datos o puede usar **Redis**.     |
| `shared/`          | Biblioteca común  | Contiene DTOs, constantes, contratos de eventos, enums, y lógica compartida entre servicios.                                                 |

---

## 📦 Tecnologías utilizadas por servicio

| Servicio       | Framework | Base de Datos    | Descripción técnica                                                 |
|----------------|-----------|------------------|----------------------------------------------------------------------|
| `gateway`      | NestJS    | —                | Maneja las rutas públicas y documentación centralizada (Swagger).   |
| `users`        | NestJS    | MySQL            | Usa TypeORM para modelar entidades y gestiona la seguridad JWT.     |
| `products`     | NestJS    | PostgreSQL       | Administra productos y stock. Conexión relacional con TypeORM.      |
| `orders`       | NestJS    | MongoDB          | Permite usar estructuras embebidas para representar ítems de compra.|
| `payments`     | NestJS    | PostgreSQL       | Registra pagos de manera persistente y confiable.                   |
| `notifications`| NestJS    | Redis (Opcional) | Puede usar Redis como cola o simplemente procesar eventos entrantes.|

---

## 🎯 Comunicación basada en eventos

El sistema se basa en **eventos emitidos y escuchados** por los distintos servicios, por ejemplo:

- `order.created` → lo escucha `payments`, lo puede registrar `notifications`
- `payment.completed` → lo escucha `orders` para confirmar una orden
- `user.created` → puede ser usado por `notifications` para enviar un email de bienvenida
- `product.stock.updated` → puede ser usado en auditorías o triggers de reabastecimiento

---

## 🌍 Propósito

Este proyecto tiene como objetivo demostrar:

- Arquitectura basada en microservicios
- Comunicación asincrónica con RabbitMQ
- Independencia real entre servicios (cada uno con su DB)
- Uso de tecnologías variadas y casos de uso heterogéneos
- Buenas prácticas para entornos distribuidos

---

## 📄 Documentación complementaria

Cada microservicio incluye:

- Swagger UI en su propio puerto
- Dockerfile para su ejecución aislada
- Variables de entorno autodefinidas
- Configuración de conexión a su DB correspondiente
- Adaptadores de RabbitMQ usando `@nestjs/microservices`

---

Desarrollado por [Alan Luna](https://alanluna.dev) — [LinkedIn](https://www.linkedin.com/in/alanluna00/)