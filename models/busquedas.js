import fs from 'node:fs'
import axios from 'axios'
import { MAPBOX_KEY } from '../config.js'

export class Busquedas {
  constructor() {
    this.dbPath = './db/database.json'
    this.historial = []
    
    this.leerDB()
  }

  get hisotorialCapitalizado () {
    return this.historial.map(lugar => {
      let palabras = lugar.split(' ')
      palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

      return palabras.join(' ')
    })
  }

  get paramsMapbox () {
    return {
      'access_token': MAPBOX_KEY,
      'limit': 5,
      'language': 'es'
    }
  }

  get paramsWeather () {
    return {
      'appid': '188af9e5c4ad41cb5d5f46b8612248cb',
      'units': 'metric',
      'lang': 'es'
    }
  }

  async ciudad(lugar = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox
      })

      const resp = await instance.get();

      return resp.data.features.map( lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
      }))
      
    } catch (error) {
      return []
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
        params: this.paramsWeather
      })

      const { data } = await instance.get();
      const { main, weather } = data

      return( {
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
        desc: weather[0].description

      })
    } catch (error) {
      console.log(error)
    }
  }

  agregarHistorial (lugar = '') {
    if (this.historial.includes(lugar)) return
    this.historial.unshift(lugar)

    // Grabar en DB
    this.guardarDB();
  }

  guardarDB () {
    const payload = {
      historial: this.historial
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }

  leerDB () {
    if (!fs.existsSync(this.dbPath)) return

    const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
    const toObjet = JSON.parse(info)

    this.historial = toObjet.historial
  }
}