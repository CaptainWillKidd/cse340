document.addEventListener("DOMContentLoaded", function() {
  let goButton = document.getElementById("goButton")
  let classificationList = document.getElementById("classificationList")
  let inventoryDisplay = document.getElementById("inventoryDisplay")

  if (goButton && classificationList && inventoryDisplay) {
    goButton.addEventListener("click", function () {
      let classification_id = classificationList.value
      console.log(`classification_id is: ${classification_id}`)

      fetch("/inv/getInventory/" + classification_id)
        .then(res => res.json())
        .then(data => buildInventoryList(data))
        .catch(err => console.log("There was a problem: ", err.message))
    })
  }

  function buildInventoryList(data) {
    if (!data || data.length === 0) {
      inventoryDisplay.innerHTML = "<p class='notice'>No vehicles found.</p>"
      return
    }

    let dataTable = "<thead>"
    dataTable += "<tr><th>Vehicle Name</th><th>Modify</th><th>Delete</th></tr>"
    dataTable += "</thead>"

    dataTable += "<tbody>"

    data.forEach(function (element) {
      dataTable += `<tr>
        <td>${element.inv_make} ${element.inv_model}</td>
        <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
        <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
      </tr>`
    })

    dataTable += "</tbody>"

    inventoryDisplay.innerHTML = dataTable
  }
})
