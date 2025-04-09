#  CryptoWeather

Welcome to **CryptoWeather**! This unique application combines real-time cryptocurrency market data with current weather information, providing insights into how weather patterns might influence cryptocurrency trends.

**🔗 Live Link**: https://crypto-weather-ten.vercel.app/

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Features](#2-features)
3. [Prerequisites](#3-prerequisites)
4. [Installation](#4-installation)
5. [Configuration](#5-configuration)
6. [Usage](#6-usage)
7. [Contributing](#7-contributing)
8. [Acknowledgements](#8-acknowledgements)

---

## 1. Introduction

**CryptoWeather** is designed for users interested in exploring the potential correlations between weather conditions and cryptocurrency market movements. By integrating data from both domains, the application offers a unique perspective on market analysis.

---

## 2. Features

-  **Real-time Cryptocurrency Data**: Access up-to-date market information for various cryptocurrencies.
- **Current Weather Information**: Retrieve weather conditions for specified locations.
-  **Data Visualization**: View combined data through intuitive charts and graphs.
- **User Alerts**: Receive notifications about significant changes in market data that correlate with specific weather events.

---

## 3. Prerequisites

Before installing and running CryptoWeather, ensure you have the following:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **Git**: [Install Git](https://git-scm.com/)

---

## 4. Installation

1. **Clone the Repository**:

```bash
git clone https://github.com/chantivasavi/cryptoweather.git
cd cryptoweather
```

2. **Install Dependencies**:

```bash
npm install
```

---

## 5. Configuration

1. **Obtain API Keys**:

   - From [CryptoAPI](https://cryptoapi.com)
   - From [WeatherAPI](https://weatherapi.com)

2. **Set Environment Variables**:

Create a `.env` file in the project root:

```env
CRYPTO_API_KEY=your_crypto_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
```

---

## 6. Usage

1. **Run the Application**:

```bash
npm start
```

2. **Open in Browser**:

Visit: [http://localhost:3000](http://localhost:3000)

---

## 7. Contributing

1. Fork the repository and create a new branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit:

```bash
git commit -m "Describe your feature or fix"
```

3. Push and submit a Pull Request.

---

## 8. Acknowledgements

- Thanks to [CryptoAPI](https://cryptoapi.com) for market data.
- Thanks to [WeatherAPI](https://weatherapi.com) for weather data.

---

*Note*: Ensure the APIs mentioned match the services used in your application.
