// ---------------- Storage CTRL -------------------
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items = [];

      // Check if there is an items array already in LS:
      if (localStorage.getItem("items") === null) {
        items = [];

        // push new item
        items.push(item);

        // Set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        // push new item
        items.push(item);

        // re-set LS
        localStorage.setItem("items", JSON.stringify(items));
      }

      // console.log(items);
    },

    getStoredItems: function () {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },

    updateStoredItem: function (storedItemsArr, currentItem, updatedItem) {
      let items = storedItemsArr;

      items.forEach(function (item) {
        if (item.id === currentItem.id) {
          item.name = updatedItem.name;
          item.calories = updatedItem.calories;
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteFromLocalStorage: function (currentItemID) {
      let items = StorageCtrl.getStoredItems();

      items.forEach(function (item, index) {
        if (item.id === currentItemID) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },

    clearAllFromLocalStorage: function () {
      let items = StorageCtrl.getStoredItems();

      items = [];

      localStorage.setItem("items", JSON.stringify(items));
    },
  };
})();

// ------------------ Item CTRL -----------------

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  const data = {
    // items: [
    //   // { id: 0, name: "cheese", calories: 150 },
    //   // { id: 1, name: "Apple", calories: 210 },
    //   // { id: 2, name: "Mixed Grill", calories: 3000 }
    // ],

    items: StorageCtrl.getStoredItems(),
    currentItem: null,
    totalCalories: 0,
  };

  // ****** PUBLIC METHODS - Item******

  return {
    loadLocalStorageData: function (storedItems) {
      data.items = storedItems;

      console.log(data.items);

      return data.items;
    },

    clearAllFromData: function () {
      // let items = data.items;

      // items.forEach(function (item) {
      //   items.splice(item);

      //   return items;
      // });

      data.items = [];
      data.currentItem = null;
      data.totalCalories = 0;

      console.log(data.items);
      console.log(data);

      return data;
    },

    deleteFromData: function () {
      let items = data.items;

      // const ID = data.currentItem.id;

      // const ids = items.map(function (item) {
      //   return item.ID;
      // });

      // const index = ids.indexOf(ID);

      // // Remove Item:
      // items.splice(index, 1);

      /*  ---------- Brad's option (with .map) ----------
    
    -------------------------- Option 2: ----------  */

      items.forEach(function (item, index) {
        if (data.currentItem.id === item.id) {
          items.splice(index, 1);

          return items;
        }
      });

      // console.log(ItemCtrl.logData);

      return items;
    },

    updateItem: function (itemInput) {
      const items = data.items;

      let updatedItem;
      items.forEach(function (item) {
        if (data.currentItem.id === item.id) {
          item.name = itemInput.name;
          item.calories = parseInt(itemInput.calories);

          updatedItem = item;
          return updatedItem;
        }
      });
      // data.currentItem = null;

      console.log("Item Updated");

      return updatedItem;

      // UICtrl.populateItemList(items);

      // ItemCtrl.calcCalories();
    },

    editCurrentItem: function (item) {
      data.currentItem = item;

      // return data.currentItem;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    calcCalories: function () {
      let total = 0;

      data.items.forEach(function (item) {
        // total = total + item.calories;

        total += parseInt(item.calories);
      });

      data.totalCalories = total;

      return data.totalCalories;

      // for (const item of items) {
      //   let itemCalories = item.calories;

      //   console.log(itemCalories);
      // }

      // if (item.calories === item.calories) {
      //   itemCalories = item.calories;
      //   console.log(itemCalories);
      // }

      // itemCalories.forEach(item)
    },

    getItems: function () {
      return data.items;
    },

    logData: function () {
      return data;
    },

    //
    addItem: function (name, calories) {
      // console.log(name, calories);
      // Create new item ID

      let ID;
      if (data.items.length > 0) {
        // ID = data.items[data.items.length - 1].id + 1;

        ID = data.items.length;
      } else {
        ID = 0;
        // console.log(data.items[data.items.length].id);
      }

      // Calories to Number:
      calories = parseInt(calories);

      // Create new item
      let newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
  };
})();

// ------------------ UI CTRL -------------------

// UI Controller
const UICtrl = (function () {
  //
  //
  // ********* UI SELECTORS *********
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    listItems: "#item-list li",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    editItem: ".edit-item",
    secondaryContent: ".secondary-content",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
  };

  // ******* PUBLIC METHODS - UI******
  return {
    displayTotalCalories: function (totalCals) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCals;
    },

    populateItemList: function (items) {
      // Check if any items:
      if (items.length === 0) {
        UICtrl.hideList();

        document.querySelector(UISelectors.itemList).innerHTML = "";
      } else {
        // Populate List with Items
        let html = "";

        items.forEach(function (item) {
          html += `
    <li class="collection-item" id="item-${item.id}">
    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
  </li>
    `;
        });

        // Insert Items into UL

        document.querySelector(UISelectors.itemList).innerHTML = html;
      }
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    getSelectors: function () {
      return UISelectors;
    },

    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Create an li element
      const li = document.createElement("li");

      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      // Insert item into list --- Using .insertAdjacentElement()
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems); // returns node list

      // Convert node list into an array..
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },

    deleteItemFromList: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);

      item.remove();
    },

    clearInputFields: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
    },

    clearEditState: function () {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
  };
})();

// -----------------  App CTRL ------------------

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // ******* LOAD EVENT LISTENERS ******
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // ADD ITEM event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable ENTER BUTTON
    document.addEventListener("keypress", function (e) {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // EDIT ITEM icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditSubmit);

    // BACK BUTTON submit
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", backButtonSubmit);

    // UPDATE BUTTON submit
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", updateButtonSubmit);

    // DELETE BUTTON submit
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteButtonSubmit);

    // CLEAR ALL BUTTON submit
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearButtonSubmit);
  };

  // _________CLEAR ALL BUTTON SUBMIT ___________
  const clearButtonSubmit = function (e) {
    e.preventDefault();

    const data = ItemCtrl.clearAllFromData();

    UICtrl.populateItemList(data.items);

    StorageCtrl.clearAllFromLocalStorage();

    UICtrl.clearEditState();

    UICtrl.displayTotalCalories(data.totalCalories);
  };

  // _________ DELETE BUTTON SUBMIT ____________
  const deleteButtonSubmit = function (e) {
    e.preventDefault();

    // const deletedFromData = ItemCtrl.deleteFromData();
    const currentItem = ItemCtrl.getCurrentItem();

    UICtrl.deleteItemFromList(currentItem.id);

    const dataItems = ItemCtrl.deleteFromData(); // deletes from data

    StorageCtrl.deleteFromLocalStorage(currentItem.id);

    const totalCalories = ItemCtrl.calcCalories();

    // UICtrl.populateItemList(deletedFromData);

    UICtrl.displayTotalCalories(totalCalories);

    ItemCtrl.editCurrentItem(null);

    UICtrl.clearEditState();

    if (dataItems.length === 0) {
      UICtrl.hideList();
    }

    // console.log(ItemCtrl.logData());
  };

  // _________ UPDATE BUTTON SUBMIT _________
  const updateButtonSubmit = function (e) {
    e.preventDefault();

    // Returns Name & Calorie inout values
    const editInput = UICtrl.getItemInput();

    if (editInput.name !== "" && editInput.calories !== "") {
      // Updates item in data structure
      const updatedItem = ItemCtrl.updateItem(editInput);

      // Returns data in LS
      const storedItemsArr = StorageCtrl.getStoredItems();
      // Retrieves Current Item
      const currentItem = ItemCtrl.getCurrentItem();

      console.log(currentItem);

      StorageCtrl.updateStoredItem(storedItemsArr, currentItem, updatedItem);

      UICtrl.updateListItem(updatedItem);

      const totalCalories = ItemCtrl.calcCalories();

      // console.log(totalCalories);

      UICtrl.displayTotalCalories(totalCalories);

      ItemCtrl.editCurrentItem(null);

      UICtrl.clearEditState();

      // console.log(editInput.name);
    } else {
      UICtrl.showAlert("Please fill in ");
    }
  };

  // __________ BACK BUTTON SUBMIT ________

  const backButtonSubmit = function (e) {
    e.preventDefault();

    UICtrl.clearEditState();
    UICtrl.clearInputFields();
  };

  // ________ ITEM EDIT SUBMIT _______
  const itemEditSubmit = function (e) {
    e.preventDefault();

    // const UISelectors = UICtrl.getSelectors();

    // if (e.target === document.querySelector(UISelectors.editItem))
    if (e.target.classList.contains("edit-item")) {
      const listID = e.target.parentElement.parentElement.id;

      // const listName = e.target.parentElement.parentElement;

      // Break into an array
      const listIDArr = listID.split("-"); // returns 2x arrays, BOTH STRINGS

      const id = parseInt(listIDArr[1]);

      // Get Item

      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.editCurrentItem(itemToEdit);

      UICtrl.showEditState();

      UICtrl.addItemToForm();
    }
  };

  // ________ ITEM ADD SUBMIT __________
  const itemAddSubmit = function (e) {
    e.preventDefault();

    console.log("Item added");

    // Get form input from UI Ctrl
    const input = UICtrl.getItemInput();

    // Check for name and caloruie input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI
      UICtrl.addListItem(newItem);
      // UICtrl.populateItemList(ItemCtrl.getItems());

      // Update Total Calories
      const totalCalories = ItemCtrl.calcCalories();

      UICtrl.displayTotalCalories(totalCalories);

      // ** STORE IN LS **
      StorageCtrl.storeItem(newItem);

      UICtrl.clearInputFields();
    }
  };

  // ****** PUBLIC METHODS ******
  return {
    init: function () {
      UICtrl.clearEditState();

      console.log("Cooking Bacon...");

      // Fetch Items form the Data Structure
      // const items = ItemCtrl.getItems();

      // Fetch items from LS
      const storedItems = StorageCtrl.getStoredItems();

      const items = ItemCtrl.loadLocalStorageData(storedItems);

      // Populate List with Items
      UICtrl.populateItemList(items);

      // Update Total Calories
      const totalCalories = ItemCtrl.calcCalories();

      UICtrl.displayTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
