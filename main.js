const $btnAgregar = document.querySelector("#btn-agregar")
const $btnCancelar = document.querySelector("#btn-cancelar")
const $btnEliminar = document.querySelector("#btn-eliminar")
const $btnLimpiarTodo = document.querySelector("#btn-limpiar-todo")
const $btnReiniciar = document.querySelector("#btn-reiniciar")
const $item = document.querySelector("#item")
const $precio = document.querySelector("#precio")
const $categoria = document.querySelector("#categoria")
const $almacen = document.querySelector("#almacen")
const $prioridad = document.querySelector("#prioridad")
const $data = document.querySelector("#data")
const $tableBody = document.querySelector("#tableBody")
const $warning = document.querySelector("#warning")
const $comprados = document.querySelector("#comprados")
const $tableCompradosBody = document.querySelector("#tableCompradosBody")
const $totalGastado = document.querySelector("#totalGastado")
const $buscador = document.querySelector("#buscador")
const $prioridadLista = document.querySelector("#prioridad-lista")
const $filtroPrecio = document.querySelector("#filtro-precio")
const $filtros = document.querySelectorAll("#filtros th")

let items = []
let itemComprados = []
document.addEventListener('DOMContentLoaded', () => {
  try {
    items = JSON.parse(localStorage.getItem('items'))
    itemComprados = JSON.parse(localStorage.getItem('itemComprados'))
    imprimirData(items)
  } catch (e) {
    localStorage.setItem('items', JSON.stringify(items))
    localStorage.setItem('itemComprados', JSON.stringify(itemComprados))
  }
})

function handleAgregar(e) {
  e.preventDefault()

  if ($item.value == "" || $precio.value == "" || $categoria.value == "" || $almacen.value == "" || $prioridad.value == "") {
    $warning.innerText = "Por favor complete todos los campos"
    $warning.classList.remove("hidden")
    setTimeout(() => {
      $warning.innerText = " "
      $warning.classList.add("hidden")
    }, 2500)

    return
  }

  $warning.innerText = " "
  $warning.classList.add("hidden")

  const nuevoItem = {
    item: $item.value,
    precio: parseInt($precio.value),
    categoria: $categoria.value,
    almacen: $almacen.value,
    prioridad: $prioridad.value,
    adquirido: false,
  }

  const position = items.findIndex(item => item.item == nuevoItem.item)
  if (position < 0) {
    items.push(nuevoItem)
  } else {
    items[position].precio = nuevoItem.precio
    items[position].categoria = nuevoItem.categoria
    items[position].almacen = nuevoItem.almacen
    items[position].prioridad = prioridad.value
  }

  updateData()
  imprimirData(items)
  resetFields()
}

function updateData() {
  localStorage.setItem('items', JSON.stringify(items))
  itemComprados = items.filter((item) => item.adquirido)
  localStorage.setItem('itemComprados', JSON.stringify(itemComprados))
}

function handleCheckbox(e) {
  items.forEach((item) => {
    if (item.item == e.target.id) {
      item.adquirido = !item.adquirido
      if (!itemComprados.includes(item) && item.adquirido) {
        itemComprados.push(item)
      } else {
        let elementoParaBorrar = itemComprados.findIndex(itemComprado => item.item == itemComprado.item)
        itemComprados[elementoParaBorrar].adquirido = false
      }

      itemComprados = itemComprados.filter((item) => item.adquirido)
    }
  })

  localStorage.setItem('items', JSON.stringify(items))
  localStorage.setItem('itemComprados', JSON.stringify(itemComprados))
  imprimirData(items)
}

function imprimirListaProductos(items) {
  $tableBody.innerHTML = ""
  items.forEach(item => {
    $tableBody.innerHTML += `<tr>
          <td class="centered"> <input type="checkbox" id="${item.item}" ${item.adquirido ? "checked" : ""}/> </td>
          <td>${item.item}</td>
          <td class="precio">${item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: "0" })}</td>
          <td> <span class="categoria categoria__${item.categoria.toLowerCase()}">${item.categoria}</span></td>
          <td> <span class="almacen almacen__${item.almacen.toLowerCase()}">${item.almacen}</span></td>
          <td> <span class="label label__${item.prioridad.toLowerCase()}">${item.prioridad}</span></td>
          <td> <button class="btn btn-editar" id="${item.item}" style="opacity:0.50">⚙️</button></td>
        </tr>`
  })
}

function imprimirTablaGastos(itemComprados) {
  $tableCompradosBody.innerHTML = ""
  $totalGastado.innerHTML = ""

  let valorTotalGastado = 0

  itemComprados.forEach(item => {
    valorTotalGastado += item.precio
    $tableCompradosBody.innerHTML += `<tr>
          <td>${item.item}</td>
          <td>${item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: "0" })}</td>
          <td> <span class="categoria categoria__${item.categoria.toLowerCase()}">${item.categoria}</span></td>
          <td> <span class="almacen almacen__${item.almacen.toLowerCase()}">${item.almacen}</span></td>
          <td> <span class="label label__${item.prioridad.toLowerCase()}">${item.prioridad}</span></td>
        </tr>`
  })

  $totalGastado.innerHTML = valorTotalGastado.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: "0" })
}

function agregarListenersAbotones() {
  const checkboxes = $tableBody.querySelectorAll("input[type='checkbox']")
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => handleCheckbox(e))
  })

  const botonesEditar = $tableBody.querySelectorAll("td button")
  botonesEditar.forEach(boton => {
    boton.addEventListener('click', (e) => handleButtonEditar(e))
  })
}

function imprimirData(arrAimprimir) {
  imprimirListaProductos(arrAimprimir)
  agregarListenersAbotones()
  imprimirTablaGastos(itemComprados)
}

function handleButtonEditar(e) {
  const itemParaEditar = items.find(item => item.item == e.target.id)

  $item.value = itemParaEditar.item
  $item.setAttribute("disabled", true)
  $precio.value = itemParaEditar.precio
  $categoria.value = itemParaEditar.categoria
  $almacen.value = itemParaEditar.almacen
  $prioridad.value = itemParaEditar.prioridad

  $btnCancelar.classList.remove("hidden")
  $btnEliminar.classList.remove("hidden")
}

function handleButtonCancelar(e) {
  e.preventDefault()
  resetFields()
}

function handleButtonEliminar(e) {
  e.preventDefault()
  items = items.filter(itemIterado => itemIterado.item != item.value)

  updateData()
  imprimirData(items)
  resetFields()
}

function handleButtonLimpiarTodo() {
  items = []
  itemComprados = []
  updateData()

  imprimirData(items)
  resetFields()
}

function handelButtonValoresIniciales() {
  items = [{
    item: "Jabón",
    precio: 1500,
    categoria: "Aseo",
    almacen: "Ara",
    prioridad: "Urgente",
    adquirido: false,
  }, {
    item: "Leche",
    precio: 21000,
    categoria: "Nevera",
    almacen: "Ara",
    prioridad: "Urgente",
    adquirido: false,
  }, {
    item: "Avena",
    precio: 6500,
    categoria: "Alacena",
    almacen: "Ara",
    prioridad: "Urgente",
    adquirido: false,
  }, {
    item: "Jamón",
    precio: 12000,
    categoria: "Nevera",
    almacen: "D1",
    prioridad: "Urgente",
    adquirido: false,
  }, {
    item: "Bananos",
    precio: 8000,
    categoria: "Verduras",
    almacen: "Otro",
    prioridad: "Baja",
    adquirido: false,
  }]
  itemComprados = []

  updateData()
  imprimirData(items)
  resetFields()
}

function resetFields() {
  $item.value = ""
  $item.removeAttribute("disabled")
  $precio.value = ""
  $categoria.value = ""
  $almacen.value = ""
  $prioridad.value = ""

  $btnCancelar.classList.add("hidden")
  $btnEliminar.classList.add("hidden")
}

function handleBuscar(e) {
  let itemsFiltrados = items.filter((item) => item.item.toLowerCase().includes(e.target.value.toLowerCase()))

  imprimirData(itemsFiltrados)
}

function handleFiltrar(e) {
  const columnaAfiltrar = e.target
  const comparador = columnaAfiltrar.innerText.toLowerCase()

  $filtros.forEach((titulo) => titulo.innerText.toLowerCase() == comparador ? '': titulo.classList.remove('filtrado'))

  if (comparador == '') {
    return
  }
  if (columnaAfiltrar.classList.contains('filtrado')) {
    columnaAfiltrar.classList.remove('filtrado')
    columnaAfiltrar.style.setProperty('--after-content', '"\u25BE"');
    items.sort((a, b) =>
      typeof a[comparador] == "number" ?
        (a[comparador] - b[comparador]) :
        comparador == 'comprado' ?
          (b.adquirido === a.adquirido) ? 0 :
            b.adquirido ? -1 : 1 :
          comparador == 'prioridad' ?
            a[comparador].localeCompare(b[comparador]) :
            b[comparador].localeCompare(a[comparador]))
  } else {
    columnaAfiltrar.classList.add('filtrado')
    columnaAfiltrar.style.setProperty('--after-content', '"\u25B4"');
    items.sort((a, b) =>
      typeof a[comparador] == "number" ?
        (b[comparador] - a[comparador]) :
        comparador == 'comprado' ?
          (a.adquirido === b.adquirido) ? 0 :
            a.adquirido ? -1 : 1 :
          comparador == 'prioridad' ?
            b[comparador].localeCompare(a[comparador]) :
            a[comparador].localeCompare(b[comparador]))
  }
  imprimirData(items)
}

$btnAgregar.addEventListener('click', (e) => { handleAgregar(e) })
$btnCancelar.addEventListener('click', (e) => handleButtonCancelar(e))
$btnEliminar.addEventListener('click', (e) => handleButtonEliminar(e))
$btnLimpiarTodo.addEventListener('click', (e) => handleButtonLimpiarTodo(e))
$btnReiniciar.addEventListener('click', (e) => handelButtonValoresIniciales(e))
$buscador.addEventListener('keyup', (e) => handleBuscar(e))
$filtros.forEach(filtro => filtro.addEventListener('click', (e) => handleFiltrar(e)))