import { inquirerMenu, leerInput, listarLugares, pause } from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js';

const app = async() => {
  const busquedas = new Busquedas()
  let opt = null

  do {
    opt = await inquirerMenu()

    switch(opt) {
      case '1':
        // Mostrar mensaje
        const lugar = await leerInput('Ciudad: ')

        // Buscar los lugares
        const ciudades = await busquedas.ciudad(lugar)
        
        // Seleccionar el lugar
        const idSelect = await listarLugares(ciudades)
        if (idSelect === '0') continue

        const lugarSelct = ciudades.find(ciudad => ciudad.id === idSelect)

        busquedas.agregarHistorial(lugarSelct.nombre)

        // Datos del clima
        const weather = await busquedas.climaLugar(lugarSelct.lat, lugarSelct.lng)

        // Mostrar resultados
        console.log('\n Información de la ciudad \n'.green)
        console.log('Ciudad: ', lugarSelct.nombre)
        console.log('Lat: ', lugarSelct.lat)
        console.log('Lng: ', lugarSelct.lng)
        console.log('Temperatura: ', weather.temp.toString(), '°C')
        console.log('Mínima: ', weather.min.toString(), '°C')
        console.log('Máxima: ', weather.max.toString(), '°C')
        console.log('Como esta el clima: ', weather.desc)
      break

      case '2':
        busquedas.historial.forEach((lugar, indice) => {
          const idx = `${indice + 1}.`.cyan
          console.log(`${idx} ${lugar}`)
        })
      break
    }
  
    if (opt !== 0) await pause();
  } while (opt !== '0');
}

app()