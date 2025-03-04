<template>
  <div id="app">
    <h1>Random Comment Generator</h1>

    <!-- Comment input form -->
    <textarea v-model="userComment" placeholder="Write a comment..." rows="4" cols="50"></textarea>
    <br />

    <!-- Math question input -->
    <div>
      <label for="mathQuestion">What is {{ mathQuestion.num1 }} + {{ mathQuestion.num2 }}?</label>
      <input v-model="userAnswer" type="number" id="mathQuestion" />
    </div>
    <br />
    
    <button @click="submitComment" :disabled="!isHuman || !userComment.trim()">Submit Comment</button>

    <h2>Random Comment:</h2>
    <p v-if="randomComment">{{ randomComment }}</p>
    <p v-else>No comment yet.</p>
  </div>


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
      mathQuestion: {
        num1: Math.floor(Math.random() * 10), // Random number between 0 and 9
        num2: Math.floor(Math.random() * 10), // Random number between 0 and 9
        correctAnswer: 0
      }
    };
  },
  methods: {
    // Check if the user answered the math question correctly
    checkMathQuestion() {
      this.mathQuestion.correctAnswer = this.mathQuestion.num1 + this.mathQuestion.num2;
      if (parseInt(this.userAnswer) === this.mathQuestion.correctAnswer) {
        this.isHuman = true;
      } else {
        this.isHuman = false;
      }
    },
    async submitComment() {
      if (this.isHuman && this.userComment.trim()) {
        try {
          // Send the comment and answer to the backend
          const res = await axios.post('http://localhost:3000/add-comment', {
            comment: this.userComment,
            mathAnswer: this.userAnswer,  // Send the user's math answer
          });

          this.userComment = ''; // Clear input after submission
          this.fetchRandomComment(); // Fetch a new random comment
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
  }
};
</script>