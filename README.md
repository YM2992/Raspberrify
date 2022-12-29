<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Raspberrify</h3>

  <p align="center">
    A ‘now playing’ Spotify web application for Raspberry Pi.
  </p>
</div>

![](preview-image.jpg)

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href=#features>Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Having found complex applications that display media playback in addition to various useless features that I did not need, I decided to make Raspberrify.

### Built With

* [![Node][Node.js]][Node-url]

<!-- FEATURES -->
## Features

* Beautiful song preview including song album cover, title, artist names, playback progress, and playback state.
* Album art animates in the background to provide a less static feel.
* Unintrusive time display in the corner.
* Idle screen when no song is playing for a while, which displays the day, time, weather, and temperature.

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Install npm.

  ```sh
  npm install npm@latest -g
  ```

Get Spotify API tokens.

*Note: this project does* ***NOT*** *require Spotify premium*

1. Navigate to the [Spotify developer dashboard](https://developer.spotify.com/dashboard/) and login with your Spotify account details.
2. *Create an app* with the app name "Raspberrify" (or whatever you want to call it).
3. Click *Edit Settings* and scroll down to *Redirect URIs*.
4. Input the following into the textbox and click *Add*:

    ```sh
    http://localhost:3000/callback
    ```

5. Scroll to the bottom of the modal and hit *Save*.
6. Take note of the *Client ID* and *Client Secret* that is available on the project overview page.

*(Optional)* Get OpenWeatherMap API key.

1. Navigate to the [OpenWeatherMap API key page](https://home.openweathermap.org/api_keys).
2. Enter an API key name and hit *Generate*.
3. Take note of the API key.
  
### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/YM2992/Raspberrify.git
   ```

2. Install NPM packages

   ```sh
   npm install .
   ```

3. Create a file titled ***.env*** in the main directory with the following content:

    ```sh
    CLIENT_ID="YOUR SPOTIFY CLIENT ID"
    CLIENT_SECRET="YOUR SPOTIFY CLIENT SECRET"
    ```

4. *(Optional)* Navigate to ***./public/classes/Weather.js*** and edit ***lines 4-6***. Replace the following:
    * "YOUR LATITUDE" - Your location latitude (this can be found through a Google search of your suburb).
    * "YOUR LONGITUDE" - Your location longitude.
    * "YOUR OPENWEATHERMAP API KEY" - Your OpenWeatherMap API key.

<!-- USAGE EXAMPLES -->
## Usage

### Start the application

1. Start the server.

    ```sh
    node .
    ```

2. Open a web browser and navigate to [http://localhost:3000](http://localhost:3000).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Yasir Mustafa - [Personal Website](https://yasir.com.au)

Project Link: [https://github.com/YM2992/Raspberrify](https://github.com/YM2992/Raspberrify)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Choose an Open Source License](https://choosealicense.com)
* [README template](https://github.com/othneildrew/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/YM2992/Raspberrify.svg?style=for-the-badge
[contributors-url]: https://github.com/YM2992/Raspberrify/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/YM2992/Raspberrify.svg?style=for-the-badge
[forks-url]: https://github.com/YM2992/Raspberrify/network/members
[stars-shield]: https://img.shields.io/github/stars/YM2992/Raspberrify.svg?style=for-the-badge
[stars-url]: https://github.com/YM2992/Raspberrify/stargazers
[issues-shield]: https://img.shields.io/github/issues/YM2992/Raspberrify.svg?style=for-the-badge
[issues-url]: https://github.com/YM2992/Raspberrify/issues
[license-shield]: https://img.shields.io/github/license/YM2992/Raspberrify.svg?style=for-the-badge
[license-url]: https://github.com/YM2992/Raspberrify/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/yasirmus/
[Node.js]:  https://img.shields.io/badge/Node-233056?style=for-the-badge&logo=node.js&logoColor=339933
[Node-url]: https://nodejs.org/en/
