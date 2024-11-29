<template>
  <div class="container">
    <h2 class="title">Ganesha Dictionary</h2>

    <!-- Toggle Button to Switch between Indonesian and English Translation -->
    <div class="toggle-group">
  <button @click="toggleLanguageMode" class="btn-toggle">
    <span class="toggle-text">{{ isIndonesianMode ? 'Switch to English to Indonesian' : 'Switch to Indonesian to English' }}</span>
  </button>
  </div>

  <!-- Single Input for Key or Value (Fixed size) -->
  <div class="input-group">
    <label :for="isIndonesianMode ? 'keyInput' : 'valueInput'" class="label">
      {{ isIndonesianMode ? 'Translate Bahasa Indonesia ke Inggris' : 'Translate English to Indonesia' }}
    </label>
    <input
      :id="isIndonesianMode ? 'keyInput' : 'valueInput'"
      v-model="inputValue"
      class="input"
      :placeholder="isIndonesianMode ? 'Masukkan Kata' : 'Enter Word'"
      @input="clearNotificationMessage"
      @keyup.enter="onEnterPress"
    />
    <button @click="search" class="btn">{{ isIndonesianMode ? 'Terjemahkan' : 'Translate' }}</button>
  </div>



    <!-- Static Notification Box (Fixed size) -->
    <div v-if="notificationMessage" :class="notificationClass" class="notification">
      {{ notificationMessage }}
    </div>

    <!-- Static Search Result Box (Fixed size) -->
    <div v-if="searchResult" class="result-box">
      <p v-if="isIndonesianMode">
        {{ searchResult.value }} <br> - {{ searchResult.valueDescription }} 
      </p>
      <p v-if="!isIndonesianMode">
        {{ searchResult.key }} <br> - {{ searchResult.keyDescription }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { RedBlackTree } from './red-black-tree'; 
import jsonData from './data/dictionary-data.json'; // Adjust the path if necessary

export default {
  data() {
    return {
      inputValue: "",
      searchResult: null,
      notificationMessage: "",
      notificationClass: "",
      tree: new RedBlackTree(),
      isIndonesianMode: true, // Flag to toggle between Bahasa Indonesia and English input mode
    };
  },
  created() {
    this.importDataFromJson();
  },
  methods: {

    onEnterPress() {
  if (this.inputValue) {
    // Trigger the search when Enter is pressed
    this.search();
  } else {
    this.notificationMessage = "Please enter a word.";
    this.notificationClass = "error-notification";
    }
  },


    importDataFromJson() {
      try {
        this.tree.importData(jsonData); // Ensure jsonData is correct
      } catch (error) {
        console.error("Error importing JSON data:", error);
        this.notificationMessage = "Failed to import JSON data.";
        this.notificationClass = "error-notification";
      }
    },

    toggleLanguageMode() {
      this.isIndonesianMode = !this.isIndonesianMode; 
      this.inputValue = ""; // Clear input when toggling mode
      this.searchResult = null; // Reset search result
      this.notificationMessage = ""; // Clear notification
    },

    // Method to clear the notification message when user types a new word
    clearNotificationMessage() {
      if (this.notificationMessage) {
        this.notificationMessage = ""; // Clear notification when typing
      }
    },

    search() {
      this.searchResult = null; // Reset previous search result

      if (this.isIndonesianMode) {
        // Searching for Indonesian to English
        const result = this.tree.searchByKey(this.inputValue.toLowerCase());
        if (result) {
          this.searchResult = {
            value: result.value,
            valueDescription: result.description,
            key: "",
            keyDescription: "",
          };
        } else {
          this.notificationMessage = "Kata tidak ditemukan!";
          this.notificationClass = "error-notification";
        }
      } else {
        // Searching for English to Indonesian
        const result = this.tree.searchByValue(this.inputValue.toLowerCase());
        if (result) {
          this.searchResult = {
            key: result.key,
            keyDescription: result.description,
            value: "",
            valueDescription: "",
          };
        } else {
          this.notificationMessage = "Nilai tidak ditemukan!";
          this.notificationClass = "error-notification";
        }
      }
    },
  },
};
</script>

<style scoped>
/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  color: #333;
}

/* Container for the whole app */
.container {
  width: 900px;  /* Fixed width */
  height: 800px; /* Fixed height */
  margin: 0 auto; /* Horizontally center the container */
  padding: 100px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute; /* Positioning the container absolutely within the page */
  top: 50%; /* Move it to the vertical center */
  left: 50%; /* Move it to the horizontal center */
  transform: translate(-50%, -50%); /* Adjust to perfectly center the container */
  display: flex;
  flex-direction: column;
}


/* Title Styling */
.title {
  font-family: 'Poppins', sans-serif; /* Use Poppins font */
  font-size: 48px; /* Larger text size */
  font-weight: 600; /* Semi-bold font weight */
  text-align: center;
  background: linear-gradient(45deg, #FFEB3B, #FFC107); /* Yellow gradient */
  -webkit-background-clip: text;
  color: transparent; /* Make text transparent so the gradient shows */
  margin-bottom: 30px; /* Space below the title */
  text-transform: uppercase; /* Capitalize all letters */
  letter-spacing: 2px; /* Add spacing between letters */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Slight shadow for depth */
}


/* Toggle Button Styles */
.btn-toggle {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-bottom: 20px;
}

.btn-toggle:hover {
  background-color: #2980b9;
}

/* Input Group Styles */
.input-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
}

.input:focus {
  border-color: #4CAF50;
  outline: none;
}

.btn {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #b13232;
}

/* Static Notification Box */
.notification {
  padding: 10px;
  margin-top: 20px;
  border-radius: 4px;
  text-align: center;
  font-size: 16px;
  height: 50px; /* Fixed height for notification box */
  overflow: hidden;
}

.success-notification {
  background-color: #4CAF50;
  color: white;
}

.error-notification {
  background-color: #f44336;
  color: white;
}

/* Static Result Box */
.result-box {
  padding: 20px;
  margin-top: 20px;
  border-radius: 4px;
  background-color: #f9f9f9;
  height: 150px; /* Fixed height for result box */
  overflow-y: auto;
}

.result-box p {
  font-size: 16px;
  color: #333;
}

/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  color: #333;
}

/* Container for the whole app */
.container {
  width: 900px; /* Fixed width */
  height: 800px; /* Fixed height */
  margin: 0 auto; /* Horizontally center the container */
  padding: 50px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}


/* Title Styling */
.title {
  font-family: 'Poppins', sans-serif;
  font-size: 48px;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(45deg, #FFEB3B, #FFC107);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}


/* Toggle Button Styling */
.toggle-group {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn-toggle {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  width: auto;
  transition: all 0.3s ease;
  text-align: center;
  display: inline-block;
}

.btn-toggle:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.btn-toggle:focus {
  outline: none;
}

/* Toggle Text Styling */
.toggle-text {
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
}

/* Input Group Styling */
.input-group {
  width: 100%;
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.6);
}

.btn {
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.btn:hover {
  background-color: #45a049;
}

/* Notification Message Styling */
.notification {
  padding: 10px;
  margin-top: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  height: 50px;
  overflow: hidden;
}

.success-notification {
  background-color: #4CAF50;
  color: white;
}

.error-notification {
  background-color: #f44336;
  color: white;
}


</style>
