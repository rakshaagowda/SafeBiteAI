<h1 align="center">🤖 SafeBiteAI 🍽️</h1>
<p align="center">
  <em>Your AI-powered health and food safety companion</em><br>
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&duration=3000&pause=800&color=00C4FF&center=true&vCenter=true&width=480&lines=Eat+Smart,+Stay+Safe!;AI+Health+Insights+from+Your+Meals;FastAPI+%7C+TensorFlow+%7C+React;Your+Digital+Nutrition+Assistant" alt="Typing Animation" />
</p>

---

### 🧠 About the Project

**SafeBiteAI** is an intelligent **food-safety and health-monitoring system** powered by AI.  
It analyzes your **food intake**, **medical data**, and **environmental factors** to predict health risks, unsafe food combinations, and dietary imbalances.  

If a user gets sick and logs abnormal symptoms, the model predicts the **possible cause** based on previous food history — helping them **avoid harmful food or combinations** in the future.  
It also keeps track of the user's **weekly health metrics** like blood sugar and electrolyte balance — indicators essential to body regulation.  
Additionally, the system can **read and track medical reports** (uploaded via form or OCR scan) for holistic health monitoring.

---

### ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| 🖥️ **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| ⚙️ **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) |
| 🤖 **AI/ML** | ![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white) ![Keras](https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=keras&logoColor=white) ![Kaggle](https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white) |
| 🌐 **APIs** | ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![Spoonacular](https://img.shields.io/badge/Spoonacular-00C853?style=for-the-badge) ![Weather API](https://img.shields.io/badge/Weather%20API-2196F3?style=for-the-badge&logo=cloud&logoColor=white) |

---

### 🔄 Workflow Overview

```mermaid
graph TD
A[👤 User Inputs Meals + Symptoms] --> B[💾 Data stored in MongoDB (7-day log)]
B --> C[🧠 TensorFlow/Keras Model Analyzes Patterns]
C --> D[⚕️ Predicts Possible Food-based Causes of Illness]
D --> E[📊 Health Condition Estimation (Blood Sugar, Electrolytes, etc.)]
E --> F[📋 Medical Report Scan (Form Input + OCR Analysis)]
F --> G[🤖 FastAPI Backend Aggregates Results]
G --> H[🌤️ Weather + Spoonacular + OpenAI APIs]
H --> I[🌐 React Frontend Displays Personalized Insights]

