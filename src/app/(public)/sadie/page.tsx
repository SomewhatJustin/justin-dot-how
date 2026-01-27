import { db, schema } from "@/lib/db"
import { eq } from "drizzle-orm"
import { markdownToHtml } from "@/lib/markdown"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hi Sadie",
  description: "A letter for Sadie",
}

const defaultContent = `Hi Sadie,

First of all, happy 11th birthday! Welcome to your laptop.

If you pull up to the function with this laptop, you'll be the cool kid, because your laptop runs *Linux*. The cool thing about Linux is that it is *free and open source*. This means that all the code is available online for anyone to see and contribute to. Anyone with the skills can submit changes to the Linux operating system. This is not the case with macOS and Windows, where only employees can make those changes.

What this means is that if there's something I don't like about Linux, I can propose a change and if it gets accepted, *everyone running Linux will be able to benefit from that change*.

## Hardware
So, a little about this laptop: It is a Thinkpad T580. It has a 500GB SSD (Solid State Drive), 16GB of RAM (Random Access Memory), a touchscreen, an NVIDIA GPU (graphics card), and an AMD CPU (processor). It's ok if you don't know what that all means. Basically, this is a nice laptop that is powerful enough for gaming.

Your password for everything is \`meep\`. That's something you can change, but I'll let you figure out how to do that.

## Software
Linux comes in many "flavors", known as distributions or "distros" for short. I put a lot of thought into which distro to install on this laptop and I ended up choosing Linux Mint. Linux Mint is considered to be the best option for beginners because it provides a lot of helpers for the more complicated parts of running a Linux computer.

Linux Mint also comes pre-installed with a lot of useful software. The text editor I'm using right now came with it. So did "Cinnamon", which is the "desktop environment" that's running. The desktop environment controls how your system and apps appear. It includes things like your windowing manager (try dragging this window as far to the right as you can), your "start button" (see bottom left of screen), your taskbar (bottom), and many other things. Crucially, this means that if you don't like your desktop envirionment, you can change it! I use one called KDE Plasma.

## Remember...
This is *your* computer! I encourage you to try clicking around, tweaking things, making things look different, going into settings, etc. You may even want to try a different desktop environment or a different Linux distro. You can do that! It isn't as hard as it sounds. Maybe a good place to start would be to change the desktop background. Don't you think it looks a little uggo?

If you don't like Linux, you can also switch to Windows. You could even "dual boot", or have multiple operating systems on the same laptop. You could even fit 5 different ones! I've done something similar where I've had multiple Linux distros on my laptop so I could try different ones out.

## Cool Things You Can Do
Figure them out on your own or ask me for help, but you can:
1. Make your own website (Fun fact: this website is running on my Raspberry Pi! A very smol computer.)
2. Use the SD card reader to import photos from your camera and edit them
3. Switch to another version of Linux, like Ubuntu, Fedora (the one I use), Arch (the hardcore one), or others. Even Windows.
4. Run *multiple* operating systems on the same laptop. I've done this.
5. Make videos using video editing software
6. Do school assignments (BORING!!!)
7. Find weird apps in the store (all free!)
8. Play Minecraft
9. Host a Minecraft server
10. Run a "large language model", which you can talk to
11. Keep a text file super secret by adding a password to it
12. Make paintings
13. Check out all the apps that are already installed
14. Write a script that prints out "meep" 100 times
15. Run commands in the terminal and look like a super cool hacker
16. Much more!!

## Helpful Tips
1. Hit the Windows logo on the keyboard to bring up your launcher. This will get you to any app you want. If you start typing after hitting Windows, it will search everything for you.
2. To install more apps, open the app named "Software Manager". You can find it using the previous tip. I already see that there is a games section and one of the games is called "Blobby" and it looks really dumb. You should try it.
3. This laptop has an SD Card reader. Remember that camera I gave you a few years ago? Or the one Ryan got you? It saves photos using an SD card. You should try putting the card in the laptop and see what happens. Maybe try opening Files.

I hope you enjoy your gift. Please let me know if you need help with anything. We can learn together!

Love,

Justin`

export default async function SadiePage() {
  const page = await db.query.pages.findFirst({
    where: eq(schema.pages.slug, "sadie"),
  })

  const content = page?.content || defaultContent
  const html = await markdownToHtml(content)

  return (
    <div className="content-wrapper">
      <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
