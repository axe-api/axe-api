<style>
.videoContainer {
  width: 1152px;
  height: 658px;
  left: 0px;
  right: 0px;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 768px) {
    width: 90vw;
    height: 55vw;
    margin-top: 100px;
    margin-bottom: 100px;
  }
}
</style>

<template>
  <div class="videoContainer">
    <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/3p4jggsNrJA"
      title="Axe API Introduction"
      frameborder="0"
      allow="
        accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture;
      "
      allowfullscreen
      style="padding: 10px"
    ></iframe>
  </div>
</template>
