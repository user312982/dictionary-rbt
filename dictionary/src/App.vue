<template>
  <div class="container">
    <h2 :style="titleStyle" class="title">Ganesha Dictionary</h2>

    <div class="toggle-group">
      <button @click="toggleLanguageMode" class="btn-toggle">
        <span class="toggle-text">
          {{ isIndonesianMode ? 'Switch to English to Indonesian' : 'Switch to Indonesian to English' }}
        </span>
      </button>
    </div>

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

    <div v-if="notificationMessage" :class="notificationClass" class="notification">
      {{ notificationMessage }}
    </div>

    <div v-if="searchResult && searchResult.length" class="result-box">
      <template v-if="isIndonesianMode">
        <p v-for="(result, index) in searchResult" :key="index">
          {{ result.value }} <br> - {{ result.valueDescription }}
          <span v-if="result.gimmickResult" class="gimmick-message">{{ result.gimmickResult }}</span>
        </p>
      </template>
      <template v-if="!isIndonesianMode">
        <p v-for="(result, index) in searchResult" :key="index">
          {{ result.key }} <br> - {{ result.keyDescription }}
          <span v-if="result.gimmickResult" class="gimmick-message">{{ result.gimmickResult }}</span>
        </p>
      </template>
    </div>

    <div v-if="isTimerActive" class="timer-container">
      <h3>{{ timer }} Detik</h3>
      <div v-if="isTimerActive" class="timer-message">
        Timer berjalan...
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { RedBlackTree } from './red-black-tree';
import jsonData from './data/dictionary-data.json';
import { playRockPaperScissors } from './components/rockPaperScrissor'; 

export default {
  data() {
    return {
      inputValue: '',
      searchResult: [],
      notificationMessage: '',
      notificationClass: '',
      tree: new RedBlackTree(),
      isIndonesianMode: true,
      titleStyle: {
        color: '',
      },
      timer: 10, // Set timer mulai dari 10 detik
      timerInterval: null as any, // Interval untuk menghitung mundur
      isTimerActive: false, // Status apakah timer sedang aktif
      isTimerFinished: false, // Status apakah timer sudah selesai
    };
  },
  created() {
    this.importDataFromJson();
  },
  methods: {
    onEnterPress() {
      if (this.inputValue) {
        this.search();
      } else {
        this.notificationMessage = 'Please enter a word.';
        this.notificationClass = 'error-notification';
      }
    },

    importDataFromJson() {
      try {
        const processedData = jsonData.map(item => {
          // Anda bisa mengonversi gimmick menjadi fungsi di sini
          item.gimmick = this.createGimmickFunction(item.gimmick);
          return item;
        });
        this.tree.importData(processedData); // Pastikan jsonData sudah diproses
      } catch (error) {
        console.error("Error importing JSON data:", error);
        this.notificationMessage = "Failed to import JSON data.";
        this.notificationClass = "error-notification";
      }
    },

    handleGimmickChoice(choice: string) {
      const result = playRockPaperScissors(choice); // Panggil fungsi dari file lain
      this.notificationMessage = result.message;
      this.notificationClass = result.resultClass;
      this.changeTitleColor(result.titleColor);
    },

    startTimer() {
      this.isTimerActive = true;
      this.isTimerFinished = false;
      this.timer = 10; // Reset timer ke 10 detik
      
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1;
        } else {
          clearInterval(this.timerInterval); // Hentikan interval setelah 0 detik
          this.isTimerFinished = true;
          this.isTimerActive = false;
        }
      }, 1000); // Update setiap detik
    },

    createGimmickFunction(gimmick: string) {
      // Pemetaan dari gimmick ke fungsi
      const gimmicks = {
        red: () => "red",
        blue: () => "blue",
        green: () => "green",
        rock: () => this.handleGimmickChoice('rock'),
        paper: () => this.handleGimmickChoice('paper'),
        scissors: () => this.handleGimmickChoice('scissors'),
        timer: () => {
          this.startTimer(); // Panggil fungsi startTimer jika gimmick adalah 'timer'
          return ''; // Tidak mengubah warna atau status lainnya
        },
        
        // Anda bisa menambahkan gimmick lain di sini
      };

      return gimmicks[gimmick] || (() => ""); // Default gimmick yang tidak memberikan efek apa-apa
    },


    toggleLanguageMode() {
      this.isIndonesianMode = !this.isIndonesianMode;
      this.inputValue = '';
      this.searchResult = [];
      this.notificationMessage = '';
    },

    clearNotificationMessage() {
      if (this.notificationMessage) {
        this.notificationMessage = '';
      }
    },

    changeTitleColor(color: string) {
      this.titleStyle.color = color;
    },

    // Ubah metode pencocokan agar lebih fleksibel
    doesInputMatchKey(input: string, key: string): boolean {
      const inputWords = input.toLowerCase().trim().split(/\s+/); // Pisah input jadi array kata
      const keyWords = key.toLowerCase().trim().split(/\s+/); // Pisah key jadi array kata

      // Pastikan setiap kata dalam key ada di input
      return keyWords.every((word) => inputWords.includes(word));
    },


    // Pastikan gimmick dipanggil jika kondisi terpenuhi
    search() {
      this.searchResult = [];
      this.notificationMessage = '';

      let gimmickTriggered = false;

      if (this.isIndonesianMode) {
        const results = this.tree.searchSequentialKey(this.inputValue.toLowerCase());
        if (results && results.length) {
          this.searchResult = results.map((result) => {
            if (
              result.gimmick &&
              this.doesInputMatchKey(this.inputValue, result.key) // Memastikan kecocokan kata
            ) {
              // Gimmick hanya dijalankan jika input cocok dengan semua kata di key
              const gimmickResult = result.gimmick();
              this.changeTitleColor(gimmickResult);
              gimmickTriggered = true;
            }
            return {
              value: result.value,
              valueDescription: result.description,
              gimmickResult: result.gimmick ? '' : '',
              key: '',
              keyDescription: '',
            };
          });
        } else {
          this.notificationMessage = 'Kata tidak ditemukan!';
          this.notificationClass = 'error-notification';
        }
      } else {
        const results = this.tree.searchSequentialValue(this.inputValue.toLowerCase());
        if (results && results.length) {
          this.searchResult = results.map((result) => {
            if (
              result.gimmick &&
              this.doesInputMatchKey(this.inputValue, result.key) // Memastikan kecocokan kata
            ) {
              // Gimmick hanya dijalankan jika input cocok dengan semua kata di key
              const gimmickResult = result.gimmick();
              this.changeTitleColor(gimmickResult);
              gimmickTriggered = true;
            }
            return {
              key: result.key,
              keyDescription: result.description,
              gimmickResult: result.gimmick ? '' : '',
              value: '',
              valueDescription: '',
            };
          });
        } else {
          this.notificationMessage = 'Nilai tidak ditemukan!';
          this.notificationClass = 'error-notification';
        }
      }

      if (!gimmickTriggered) {
        this.titleStyle.color = ''; // Reset title color if no gimmick
      }
    }

  },
};
</script>





<style scoped>

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

.info-notification {
  background-color: #2980b9;
  color: white;
}

.timer-container {
  text-align: center;
  margin-top: 20px;
}

.finished-message {
  margin-top: 10px;
  font-size: 18px;
  color: green;
}

button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #000000;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

.timer-message {
  color: rgb(2, 1, 1);
}


.timer-container {
  margin-top: 20px;
  color: black;
}
</style>