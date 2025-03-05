<template>
  <!-- First section(header)-->

  <div class="section1">

    <h1>Welcome to</h1>
    <h2></h2>
    <img src="" alt="">
    <img src="" alt="">
    <button class="scrolldown"></button>


  </div>

  <div class="section2" >



  </div>

  <div class="section3">



  </div>

  <div class="section4">

    <button><a href=""></a>Learn more...</button>


  </div>








  <div id="app">
    <h1>Random Comment Generator</h1>
    <!-- Math question input -->
    <div v-if="mathQuestion">
      <label for="mathQuestion">What is {{ mathQuestion.num1 }} + {{ mathQuestion.num2 }}?</label>
      <input v-model="userAnswer" type="number" id="mathQuestion" />
    </div>
    <br />

    <button @click="submitComment" :disabled="!isHuman || !userComment.trim()">Submit Comment hahaha</button>

    <h2>Random Comment:</h2>
    <p v-if="randomComment">{{ randomComment }}</p>
    <p v-else>No comment yet.</p>
  </div>
    <!-- Comment input form -->
    <textarea v-model="userComment" placeholder="Write a comment..." rows="4" cols="50"></textarea>
    <br />







</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      userComment: '',
      userAnswer: '',
      randomComment: null,
      isHuman: false,
      mathQuestion: null // Initially null, will be populated by server
    };
  },
  methods: {
  checkMathQuestion() {
    if (this.mathQuestion) {
      const correctAnswer = this.mathQuestion.num1 + this.mathQuestion.num2;
      this.isHuman = parseInt(this.userAnswer) === correctAnswer;

      // Debugging: Log the correct answer and user's answer
      console.log('Correct answer:', correctAnswer, 'User answer:', this.userAnswer);
    }
  },
  // Rest of the methods...
  async submitComment() {
  if (this.isHuman && this.userComment.trim()) {
    try {
      // Debugging: Log the values being sent
      console.log('Submitting comment with:', {
        comment: this.userComment,
        mathAnswer: this.userAnswer,
        mathQuestion: this.mathQuestion,
      });

      // Send the comment, answer, and math question to the backend
      const res = await axios.post('http://localhost:3000/add-comment', {
        comment: this.userComment,
        mathAnswer: this.userAnswer,
        mathQuestion: this.mathQuestion, // Include the math question
      });

      this.userComment = ''; // Clear input after submission
      this.userAnswer = ''; // Clear the answer input
      this.fetchRandomComment(); // Fetch a new random comment
      this.fetchMathQuestion(); // Fetch a new math question
    } catch (error) {
      console.error('Error submitting the comment:', error);
    }
  }
},
    async fetchRandomComment() {
      try {
        const response = await axios.get('http://localhost:3000/random-comment');
        this.randomComment = response.data.comment;
      } catch (error) {
        console.error('Error fetching random comment:', error);
      }
    },
    async fetchMathQuestion() {
      try {
        const response = await axios.get('http://localhost:3000/math-question');
        this.mathQuestion = response.data; // Set the math question from server
      } catch (error) {
        console.error('Error fetching math question:', error);
      }
    }
  },
  watch: {
    // Check the math question when the user input changes
    userAnswer(newAnswer) {
      this.checkMathQuestion();
    }
  },
  mounted() {
    this.fetchRandomComment(); // Fetch random comment on page load
    this.fetchMathQuestion(); // Fetch math question from backend
  }
};
</script>

<style>


</style>
