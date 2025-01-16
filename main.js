document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("item-form");
    const itemInput = document.getElementById("item-input");
    const supermarketSelect = document.getElementById("supermarket-select");
    const itemsList = document.getElementById("items-list");
    const recycleBinList = document.getElementById("recycle-bin-list");
    const recycleBinModal = document.getElementById("recycle-bin-modal");
    const recycleBinIcon = document.querySelector(".recycle-bin-icon");
    const closeBinButton = document.getElementById("close-bin");
    const emptyBinButton = document.getElementById("empty-bin");
  
    const savedItems = JSON.parse(localStorage.getItem("shoppingList")) || [];
    const recycleBinItems = JSON.parse(localStorage.getItem("recycleBin")) || [];
  
    // Renderizar elementos iniciales
    savedItems.forEach(renderItem);
    recycleBinItems.forEach(renderRecycleItem);
    updateEmptyMessage();
  
    // Abrir el modal de la papelera
    recycleBinIcon.addEventListener("click", () => {
      recycleBinModal.style.display = "block";
    });
  
    // Cerrar el modal de la papelera
    closeBinButton.addEventListener("click", () => {
      recycleBinModal.style.display = "none";
    });
  
    // Vaciar la papelera
    emptyBinButton.addEventListener("click", () => {
      recycleBinItems.length = 0; // Vacía el array
      recycleBinList.innerHTML = ""; // Limpia la lista del DOM
      updateRecycleStorage();
      updateEmptyMessage(); // Actualiza el mensaje
      alert("La papelera ha sido vaciada.");
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const itemName = itemInput.value.trim();
      const supermarket = supermarketSelect.value;
  
      if (!itemName) {
        alert("Por favor, ingresa el nombre de un producto.");
        return;
      }
      if (supermarket === "") {
        alert("Por favor, selecciona un supermercado.");
        return;
      }
  
      const item = { name: itemName, supermarket, completed: false };
      renderItem(item);
      saveItem(item);
      form.reset();
    });
  
    function renderItem(item) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} - <em>${item.supermarket}</em></span>
        <div>
          <input type="checkbox" ${item.completed ? "checked" : ""}>
          <button>🗑️</button>
        </div>
      `;
      if (item.completed) li.classList.add("completed");
  
      const checkbox = li.querySelector("input[type='checkbox']");
      const deleteButton = li.querySelector("button");
  
      checkbox.addEventListener("change", () => {
        item.completed = checkbox.checked;
        li.classList.toggle("completed", item.completed);
        updateStorage();
      });
  
      deleteButton.addEventListener("click", () => {
        li.remove();
        moveToRecycleBin(item);
      });
  
      itemsList.appendChild(li);
    }
  
    function renderRecycleItem(item) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} - <em>${item.supermarket}</em></span>
        <button>🔄 Restaurar</button>
      `;
  
      const restoreButton = li.querySelector("button");
      restoreButton.addEventListener("click", () => {
        li.remove();
        restoreItem(item);
      });
  
      recycleBinList.appendChild(li);
      updateEmptyMessage();
    }
  
    function moveToRecycleBin(item) {
      recycleBinItems.push(item);
      renderRecycleItem(item);
      removeItem(item);
      updateRecycleStorage();
      updateEmptyMessage();
    }
  
    function restoreItem(item) {
      savedItems.push(item);
      renderItem(item);
      const index = recycleBinItems.findIndex(
        (i) => i.name === item.name && i.supermarket === item.supermarket
      );
      if (index !== -1) recycleBinItems.splice(index, 1);
      updateRecycleStorage();
      updateEmptyMessage();
    }
  
    function saveItem(item) {
      savedItems.push(item);
      updateStorage();
    }
  
    function removeItem(item) {
      const index = savedItems.findIndex(
        (i) => i.name === item.name && i.supermarket === item.supermarket
      );
      if (index !== -1) savedItems.splice(index, 1);
      updateStorage();
    }
  
    function updateStorage() {
      localStorage.setItem("shoppingList", JSON.stringify(savedItems));
    }
  
    function updateRecycleStorage() {
      localStorage.setItem("recycleBin", JSON.stringify(recycleBinItems));
    }
  
    function updateEmptyMessage() {
        // Selecciona el mensaje existente o crea uno nuevo si no existe
        let message = document.querySelector(".empty-message");
        if (!message) {
          message = document.createElement("div");
          message.className = "empty-message";
          message.textContent = "La papelera está vacía";
          recycleBinModal.insertBefore(message, closeBinButton); // Coloca el mensaje arriba del botón de cerrar
        }
      
        // Muestra u oculta el mensaje según el contenido de la papelera
        if (recycleBinItems.length === 0) {
          message.style.display = "block";
        } else {
          message.style.display = "none";
        }
      }
  });
  