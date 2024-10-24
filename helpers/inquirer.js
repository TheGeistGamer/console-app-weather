import inquirer from 'inquirer'

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: 'Qué desea hacer?',
    choices: [
      {
        value: '1',
        name: `${'1.'.cyan} Buscar ciudad`
      },
      {
        value: '2',
        name: `${'2.'.cyan} Historial`
      },
      {
        value: '0',
        name: `${'0.'.cyan} Salir`
      },
    ]
  }
] 

export const inquirerMenu = async () => {
  console.clear()
  console.log('========================='.green)
  console.log('  Seleccione una opción'.white)
  console.log('========================='.green)

  const { opcion } = await inquirer.prompt(preguntas)
  return opcion
}

export const pause = async () => {
  const enter = [
    {
      type: 'input', 
      name: 'enter',
      message: `Presione ${'Enter'.red} para continuar`,
    }
  ]

  console.log('\n')
  await inquirer.prompt(enter)
}

export const leerInput = async(message) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor'
        }

        return true
      }
    }
  ]

  const { desc } = await inquirer.prompt(question) 
  return desc
}

export const listarLugares = async(lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const indice = `${i + 1}.`.cyan

    return {
      value: lugar.id,
      name: `${indice} ${lugar.nombre}`
    }
  })
  
  choices.unshift({
    value: '0',
    name: '0.'.green + ' Cancelar'
  })

  const items =   {
    type: 'list',
    name: 'id',
    message: 'Seleccione lugar:',
    choices
  }

  const { id } = await inquirer.prompt(items)
  return id
}

export const confirmar = async (message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message
    }
  ]

  const { ok } = await inquirer.prompt(question)
  return ok
}

export const listarParaCompletar = async(tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const indice = `${i + 1}.`.cyan

    return {
      value: tarea.id,
      name: `${indice} ${tarea.desc}`,
      checked: (tarea.completadoEn ) ? true : false
    }
  })

  const pregunta = {
    type: 'checkbox',
    name: 'ids',
    message: 'Borrar',
    choices
  }

  const { ids } = await inquirer.prompt(pregunta)
  return ids
}