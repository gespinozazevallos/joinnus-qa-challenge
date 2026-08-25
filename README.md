# Reto de QA Automation

Suite pequeña con Playwright + TypeScript para `practicesoftwaretesting.com`, intencionalmente acotada al ejercicio solicitado.

## Ejecución

```bash
npm install

npx playwright install chromium
```

Crear el archivo `.env` a partir de `.env.example` y configurar un usuario de Practice Software Testing. Usar los siguientes datos:
`TEST_USER_EMAIL=admin@practicesoftwaretesting.com`
`TEST_USER_PASSWORD=welcome01`
Luego ejecutar:

```bash
npm run typecheck

npm run test:api

npm run test:e2e

npm run test:twice
```

`npm run test:twice` es la doble validación: ejecuta la suite completa dos veces de forma consecutiva y sin reintentos.

## Decisiones de diseño

El flujo E2E se autentica mediante `POST /users/login`, valida el token utilizando `/users/me` y lo inyecta en el `localStorage` del navegador. El formulario de login de la interfaz nunca se completa.

Los datos del producto no están hardcodeados: tanto las pruebas de API como las E2E utilizan el mismo mecanismo determinístico para resolver el producto (`PRODUCT_QUERY`, producto con stock, no alquilable y ordenado por nombre/id).

El checkout recorre el flujo:

`Cart → Login autenticado → Address → Payment`

Los datos de dirección ficticios se generan dinámicamente durante la ejecución.

El test se detiene cuando la acción final `finish` se encuentra habilitada, pero **no hace clic sobre ella**, por lo que no se genera ninguna orden ni se consume stock.

Adicionalmente, durante el teardown se intenta eliminar el carrito mediante un mecanismo best-effort, de forma que un fallo en la limpieza no invalide el objetivo principal del test.

## Fuera del alcance de forma intencional

Se dejaron fuera CI/CD, cobertura multi-browser, pruebas visuales y de accesibilidad, una cobertura extensa de escenarios negativos y la generación automática de esquemas OpenAPI, ya que agregarían más complejidad que valor dentro del tiempo establecido.

Si esta suite tuviera que escalar a aproximadamente 200 tests, separaría fixtures y clientes API por dominio, incorporaría builders de datos de prueba gestionados por API y contratos de cleanup, validación tipada mediante OpenAPI/schema, tags y sharding, manejo de datos seguro para ejecución en paralelo, quality gates en CI y una matriz de navegadores más amplia.
