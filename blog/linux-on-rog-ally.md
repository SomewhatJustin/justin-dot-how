---
title: A Handheld Upgrade - How Bazzite Transformed My ROG Ally
date: 2025-02-08
---
![ROG Ally in Steam](/assets/rog-steam.jpeg)

I decided a few days before [FOSDEM](https://fosdem.org) that a handheld PC would be an excellent travel accessory and a way to re-enter PC gaming. But unfortunately, the Steam Deck is only available to purchase directly from Steam, and there was no guarantee that it would arrive before I hopped on the plane.

After taking a look on Best Buy, I found the Rog Ally with the Z1 Extreme for $449 USD, $200 off normal retail. Plus it was bundled with a free travel case! I thanked my lucky stars, placed the order, and picked it up the same day. I am so spoiled.

Purchasing the ROG, I knew I was going to install Linux on it. Linux has become a bit of [an obsession for me](/blog/switching-to-linux). I never gave Windows a chance. I've been forced to use Windows 10 in the past and found myself *offended* by it. But that's another post.

Thanks to some mentions on the excellent [Linux Unplugged](https://linuxunplugged.com/) podcast, which just celebrated its 600th episode, I knew that I would be installing [Universal Blue](https://universal-blue.org/)'s [Bazzite](https://bazzite.gg/). Bazzite is a gaming-focused Linux distribution that can be installed with Steam's gaming mode enabled by default. This means that when you launch the OS, it goes straight into the same UI that you would expect on a Steam Deck. Steam is open, showing all your games. You can exit to a "Desktop mode", which is by default powered by [KDE Plasma](https://kde.org/plasma-desktop/), but as I intended to treat this as a dedicated gaming device, I knew I'd never see the desktop after initial setup.

## Installation

Installing Bazzite on a touch device without traditional inputs can prove to be tricky if you don't have the right hardware. Luckily, I had a USB-C dongle laying around and was able to hook up a mouse and keyboard, along with the USB thumb drive, to the ROG Ally.

The only roadblock I hit was that at first, the ROG Ally was not recognizing my keyboard, which was needed to enter the password for my WiFi network. I entered BIOS and disabled secure boot and that seemed to fix it.

The rest of the installation wasn't too difficult, especially with Bazzite's [installation guide for handhelds](https://docs.bazzite.gg/General/Installation_Guide/Installing_Bazzite_for_Handheld_PCs/). I've seen the Fedora installer many times, so it was a familiar experience. After the progress bar finished up, I rebooted into Bazzite. Done! I immediately started downloading games.

## Performance and Compatibility

I can't speak to a direct comparison between Windows and Bazzite, but I have [found](https://www.theverge.com/2024/12/30/24329005/bazzite-asus-rog-ally-x-steam-os-editorial) [reports](https://www.tomsguide.com/gaming/handheld-gaming/i-turned-the-asus-rog-ally-x-into-a-steam-deck-it-proves-windows-11-kills-power-and-battery-life) that battery life and gaming performance on Bazzite are slightly better than Windows.

Playing Yakuza Infinite Wealth at 1080p with medium settings looks great. I average around 51 fps, though I do have to run in the battery-eating, fan-spinning "Turbo" TDP setting. This controls how much power is sent to the CPU/iGPU. As a quick test, I ran Yakuza on Turbo and went from 85% battery to 5% in 44 minutes. Battery life has been a little bit of a disappointment. I was expecting 2-4 hours of gameplay like the Nintendo Switch offers, but that seems possible only on non-demanding games. Some people are swapping their batteries out [and seeing good results](https://www.reddit.com/r/ROGAlly/comments/1i7pwvb/results_of_74wh_battery_mod_for_og_ally/), though I will likely avoid this for now. I mostly play at home near a charger and can always play less demanding games when I want more play time.

![yakuza on rog ally](/assets/yakuza-rog.jpeg)

I've only had major issues running one game—[Limbo](https://store.steampowered.com/app/48000/LIMBO/?curator_clanid=32983456). The game was running in slow motion. This seems to be a known issue with workarounds, but I have not tried them. I just played [Inside](https://store.steampowered.com/app/304430/INSIDE/) instead.

## Minor Problems

Running Bazzite hasn't been flawless. I occasionally experience some issues:

* I do have an issue with audio where I hear artifacts in various games and even the Steam menus, most noticeably upon waking from sleep. These tend to work themselves out after about a minute and are nothing more than an annoyance most of the time.
* Battery drain during sleep. Again, my experience with the Nintendo Switch has influenced my expectations here. But if I put my ROG Ally to sleep while at 50% battery, then come back the next day, I expect battery life to be around 48%. However, I was disappointed to find out early on that battery drains much more quickly than that. I don't have exact numbers, but battery drain during sleep seems to be around 1-2% per hour. I've been able to work around this limitation, but it does reduce its overall utility as a travel device. This seems to be an issue on Windows as well, though I am not sure to what extent. I also have this problem on my Asahi Linux M1 Macbook Air, so it's also just a Linux problem.
* I have also encountered a bug where I can return to a game and find that performance has greatly diminished, but a reboot will fix it.

All these are pretty minor or easy to work around. I do hope Universal Blue continues to work on battery drain during sleep.

## Hardware

If you're used to a Nintendo Switch, you'll find the ROG Ally to be quite large. I appreciate the size. Having a larger screen is great and it still fits in my backpack nicely. While the screen isn't OLED, it is 120 Hz. Along with VRR, this ensures that gameplay is smooth provided you're using the appropriate graphics settings.

I do prefer the black chassis of the ROG Ally X and Steam Deck. You will also learn that ROG stands for "Republic of Gamers" which I find quite goofy. Any time I take my Ally out in front of my girlfriend I make sure to mention to her that I am part of the *Republic of Gamers*. I don't think she thinks it's as funny as I do.

The Ally has a port for micro SD cards, but everyone online seems to agree that it eats these cards for breakfast and that you're much better off just upgrading the M2 SSD. It also has a proprietary port that allows you to connect ASUS's [XG Mobile](https://rog.asus.com/external-graphic-docks/rog-xg-mobile-2023-model/), which is essentially an eGPU enclosure with an NVIDIA RTX 4090 inside. You'll just have to fork over $2000.

You do also have the option of hooking this up to your TV with the USB C port. Since the ROG Ally has Bluetooth, you could connect a controller and use this just like a Nintendo Switch. I have not found myself doing this. Without a physical dock, it's not quite as seamless as the Switch and I don't want to have to pair and repair my single PS5 controller.

## Bazzite on Desktop

Since I am happy to live in the Steam ecosystem, I just installed Bazzite on my desktop. Thanks to Steam cloud, my save data syncs between my devices. I even installed the exact same Bazzite image on my desktop so that it boots directly into Steam gaming mode. I love having the same cohesive experience on both devices.

![please dont speak to me or my son ever again](/assets/two-bazzites.jpeg)

Universal Blue's aims with Bazzite are to turn your system into a gaming appliance—a video game console. You shouldn't have to think about Linux. It should just work. This is particularly nice on the desktop, where I can just boot into a gaming-focused environment and navigate with just a controller.

## Final Thoughts
If you are comfortable installing Linux on a computer, then yes, I would recommend trying this approach. With an official public release of [SteamOS on the horizon](https://www.forbes.com/sites/jasonevangelho/2025/01/07/valve-set-to-release-a-steamos-beta-for-multiple-devices/), the picture for Linux on handhelds is only getting rosier. I've found that this device has revitalized my interest in PC gaming, and even gaming in general. It got me to finally finish Portal 2 and Inside — games that I had loved but abandoned years ago.

If you have any questions, please feel free to reach out. 
