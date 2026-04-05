const app = require('./app');
const { initCronJobs } = require('./utils/cronJobs');

const PORT = process.env.PORT || 8080;

const main = async() => {
    try {
        // 👈 2. Enciendes el "reloj" del robot antes de levantar el server
        initCronJobs(); 
        console.log("🤖 Cron Jobs inicializados");
        
    // Escucha en todas las interfaces si estamos en producción
    // app.listen(PORT, '::', () => {
        app.listen(PORT, '0.0.0.0', () => {
      console.log(`👉 Server running on port ${PORT}`);
      console.log(`👉 Link http://localhost:${PORT}`);
    });
    } catch(error){
        console.log(error);
    }
}

main();

  

