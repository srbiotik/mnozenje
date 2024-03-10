<script setup>
import { ref } from 'vue'

const gameRunning = ref(false)
const multiplicand = ref(null)
const multiplier = ref(null)
const result = ref(null)
const gameInterval = ref(null)
const choices = ref([])
const score = ref(0)
const counter = ref(0)
const grade = ref(null)
const graded = ref(false)
const mainText = ref('')
const showResult = ref(false)
// Settings
const exposurePeriod = ref(6)
const maxQuestions = ref(10)
const low = ref(2)
const high = ref(9)

function gradeScore() {
  const percentage = Math.round((score.value / counter.value) * 100)
  if (percentage >= 98) {
    grade.value = 'Da li si ti robot!? 5++ 🤖'
  } else if (percentage >= 95) {
    grade.value = 'Ističeš Se! 5+ 🤩'
  } else if (percentage >= 90) {
    grade.value = 'Odličan 5! 😇'
  } else if (percentage >= 80) {
    grade.value = 'Vrlo Dobro 4! 😎'
  } else if (percentage >= 70) {
    grade.value = 'Dobro 3 🙂'
  } else if (percentage >= 60) {
    grade.value = 'Dovoljno 2 😑'
  } else {
    grade.value = 'Potrudi se! 1 🤔'
  }
}

function scoreChoice(event) {
  // To prevent multiple clicks on the same question
  if (graded.value) {
    return
  }
  graded.value = true
  const choice = event.target.innerText
  if (choice == result.value) {
    score.value++
  } else {
    mainText.value = `${result.value}`
    showResult.value = true
    setTimeout(() => {
      showResult.value = false
      startGameLoop()
    }, 2000);
    return
  }
  startGameLoop()
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index lower than the current element
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setAnswerChoices() {
  const answers = [result.value]
  answers.push((multiplicand.value - 1) * multiplier.value)
  answers.push((multiplicand.value - 1) * (multiplier.value - 1))
  answers.push(multiplicand.value * (multiplier.value - 1))
  choices.value = shuffleArray(answers)
}

function setMultiplicationPairs() {
  if (low > high) {
    throw new Error("Low end of range must be less than or equal to high end.");
  }
  const [m, M] = getMultiplicationPair(low, high)
  multiplicand.value = m
  multiplier.value = M
  result.value = m * M;
}

function getMultiplicationPair() {
  // TODO: Samo jedan broj do kog se racuna, a drugi je uvek od 1 do 10
  if (low.value > high.value) {
    throw new Error("Low end of range must be less than or equal to high end.");
  }
  const m = Math.floor(Math.random() * (high.value - low.value + 1)) + low.value;
  const M = Math.floor(Math.random() * (9 - low.value + 1)) + low.value;
  return [m, M];
}

function stopGame() {
  clearInterval(gameInterval.value)
  gameRunning.value = false
  choices.value = []
  multiplicand.value = null
  multiplier.value = null
  result.value = null
  gradeScore()
}

function resetScore() {
  score.value = 0
  counter.value = 0
}

function startGameLoop() {
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
  }
  setQuestion()
  gameInterval.value = setInterval(() => {
    setQuestion()
  }, exposurePeriod.value * 1000);
}

function setQuestion() {
  if (counter.value == maxQuestions.value) {
    stopGame()
    return
  }
  counter.value++
  graded.value = false
  setMultiplicationPairs()
  setAnswerChoices()
}

function startGame() {
  resetScore()
  startGameLoop()
}

function changeGameState() {
  gameRunning.value = !gameRunning.value
  gameRunning.value ? startGame() : stopGame()
}
</script>

<template>
  <div class="container">
    <div v-if="!gameRunning" class="settings">
      <div class="settings-container">
        <div class="settings">
          <label for="exposure-period">Vreme za racunanje (sekunde):</label>
          <input v-model="exposurePeriod" type="number" id="exposure-period" name="exposure-period" min="1" max="10">
        </div>
        <div class="settings">
          <label for="max-questions">Broj pitanja:</label>
          <input v-model="maxQuestions" type="number" id="max-questions" name="max-questions" min="1" max="10">
        </div>
        <div class="settings">
          <label for="low">Od:</label>
          <input v-model="low" type="number" id="low" name="low" min="1" max="10">
        </div>
        <div class="settings">
          <label for="high">Do:</label>
          <input v-model="high" type="number" id="high" name="high" min="1" max="10">
        </div>
      </div>
    </div>
    <div class="main">
      <div v-if="grade !== null && multiplicand === null && multiplier === null" class="question">{{ grade }}</div>
      <div v-if="multiplicand !== null && multiplier !== null && !showResult" class="question">{{ `${multiplicand} *
              ${multiplier}` }}
      </div>
      <div v-if="showResult" class="question" :style="{ color: 'red' }">{{ mainText }}</div>
    </div>
    <div class="results">
      <div class="choices-container">
        <button @click="scoreChoice" v-for="choice in choices" class="choice">{{ choice }}</button>
      </div>
    </div>
    <div class="cta">
      <button @click="changeGameState" class="change-game-state">{{ gameRunning ? 'Stop' : 'Start' }}</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: auto;
  display: flex;
  height: 100%;
  /* width: 100vw; */
  flex-direction: column;
  background-color: antiquewhite;
}

/*
This is a settings container flex class,
all the settings should be in a row,
justified to the left,
with enough space between them
*/
.settings-container {
  background-color: lightcyan;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}

.settings {
  background-color: lightcyan;
  padding: 5px;
}

.main {
  width: 100%;
  flex-grow: 18;
  background-color: lightcyan;
}

.results {
  width: 100%;
  flex-grow: 4;
  background-color: lightcyan;
}

.cta {
  width: 100%;
  padding: 15px;
  flex-grow: 1;
  background-color: lightcyan;
}

.change-game-state {
  font-size: large;
  margin: auto;
  display: block;
  width: 100%;
  height: 100%;
}

.choices-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
}

.choice {
  width: 40%;
  height: 40%;
  margin: 5px;
  font-size: xx-large;
  font-weight: bold;
}

/* Center the question horizontally and vertically, make it very large */
.question {
  font-size: 5em;
  text-align: center;
  line-height: 1.5em;
  margin: auto;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
