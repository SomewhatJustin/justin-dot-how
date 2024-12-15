---
title: I built a low-power weather display
date: 2024-10-20
---
Living in Austin, most days are warm. Shorts weather. But from mid-November to mid-April, it can be a tossup of how much I need to bundle up. This presents a problem: I want to know how cold it is outside so I can dress appropriately.

Now, this is a great use-case for a voice assistant. But I don't want to talk to Google in the morning! Just not a great way to start the day.

So I built this:
![weather station](/assets/weather-pi.jpeg)

This is my Raspberry Pi weather station. It's cheap (less $50 total) and fun to set up.

First of all, I am amazed at what this $15 computer can do. I recommend using the Raspberry Pi Imager and enabling WiFi and SSH access. After plugging it in and waiting for a couple of minutes, it was ready to go. Updating did take some time, but it probably wasn't necessary. After some troubleshooting (make sure to enable the SPI interface! details in the [waveshare manual](https://www.waveshare.com/wiki/2.13inch_e-Paper_HAT_Manual)) I got the example program to run.

Once there, I used the Open Weather API to pull down the current temperature for my location and pass that to the imaging function that waveshare provides.

Finally, I set up a cronjob to run at the top of every hour to get the current weather.

**Hardware**
- [Raspberry Pi Zero WH](https://www.adafruit.com/product/3708)
- [waveshare 2.13inch E-Ink Display HAT V4](https://www.amazon.com/waveshare-2-13inch-HAT-Compatible-Resolution/dp/B071S8HT76?crid=3693PUAB2PBH5&dib=eyJ2IjoiMSJ9.n27JVboHa9voOuVmQ55lH-CvGYjX49xWpWSwJE2KQ9cocFy84yx-u2RuUMgXoCy_Tk9TlBBNwLRywZKMQJu922iThN7Ddu8uUjcIgCR397Gk7RSbkIQ10PGp9C-DK2gG_bldU3sYr08Sxd9KZLXtPURIZdWjzpgxJDGbgAcT05Czk7O6N1Hfyei9qTh0NkZZga2yocKFPqv1kt3sFTQ3HLNrpW-QlpVQFu6JGq1nkg8.sxwjLBqT4H5r5_6WBvmuziix-NVF67IXDRHKzqiJDds&dib_tag=se&keywords=waveshare+eink&qid=1731865612&sprefix=waveshare+eink%2Caps%2C169&sr=8-3)
- Micro SD card (I used a class 4 and it's fine)
- Power adapter and cable (ideally use ones you already have)

**Software**
All my code is open source and [available on GitHub](https://github.com/SomewhatJustin/weather-station). You'll want to check out the [waveshare manual](https://www.waveshare.com/wiki/2.13inch_e-Paper_HAT_Manual), which has a dedicated section for Raspberry Pi.

