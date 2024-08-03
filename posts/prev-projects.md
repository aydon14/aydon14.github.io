# About My Projects

First things first, I don't have many projects. I have a tendency to only program things that give me something to learn, or accomplish a goal not accomplished before. As you might imagine, this also means that I don't spend much time in game development, etc. I spend my programming time making 'tools' that you can use to help. Me being into cybersecurity gives me another opportunity to expand the topics my projects focus on. Now, I have only been programming for **2** years, and normally 2 years would be plenty of time to have many projects already complete, but I do have a life outside of this. I used to take a LOT of time to relax and watch youtube for hours on end, but now I like to multitask. However, I am still in high school and school combined with homework takes away a lot of my time for programming.

# Python Encryptor

This is my very first out of school project that took advantage of the skills I have and programming languages I know. I can also say that I've completely rewritten the project 3 times, taking about a year and a half to complete. It isn't a huge program but I didn't work on it everyday or even every week. I will get more into that in the next section, but I want to talk about the skills I learned. I thought of making an encryptor because I don't see many open source file encryption projects around, and I thought it would be cool to demonstrate my cybersecurity and cryptography skills.

## From Idea to Implementation

Alright, so now you know why I started this project, now to the niddy-griddy stuff. First, I would like to point out that this project took about a year and a half, mainly due to the reasons listed above about how I had school. If you read my biography, you know that C++ was my first language, my introduction to programming. After that class, I didn't really do anything that summer related to programming. Once school started again, I got the inspiration to start the project. This project got me really familiar with the benefits and drawbacks of C++. One of the main drawbacks was the libraries, and inconsistency with how they're used, etc. I would say that is the reason that got me to rewrite the project, along with my new found knowledge of Python. I wrote the program in Python, and it allowed me to gain more knowledge of bytes and experience with algorithms and cryptography in general. My hatred of libraries and modules stemming from C++, as well as seeing that nobody else did it, inspired me to make custom implementations of the algorithms not using modules. I also got the idea to, instead of hardcoding the algorithms into the program, allow the user to implement their own custom algorithms into the program, another thing not seen anywhere else at the time I believe. Anyways, the error checking really made the program look like crap, so I ended up rewriting it in Python again which is what you currently see in the repository. 

## This formed my style of programming

This project is what formed the way or style I program today, which I consider to be the use of AI (mainly ChatGPT) in my programs. Now I know you might think that now I don't really know how to program and I just use AI to make these programs for me, which isn't really true. I do use ChatGPT a lot in the programs I've made so far, but I mainly use it for error correcting and learning more about the languages I use. A common misconception about AI especially with programming is that if you tell it to, AI will just make a program for you. However, this isn't really the case, and you might find it hard to believe that AI, even GPT-4, sucks at writing code. AI can be useful, if you know how to use it with programming. A good example of me using it was for the AES algorithm implementation in my encryptor, where I use it to give me a layout of how the code should look, mainly just function names, what functions and variables I would need, etc. I would then do my own research, as in going to the NIST papers on it, looking at what functions did what, and giving that info to ChatGPT to give me a brief layout of each function. It did give me around 80% of the code for most of the ciphers available for the encryptor, but I can tell you that, that code didn't work 50% of the time. It still, even with the 'power' of AI, took hours of error checking and debugging to make the code work. ChatGPT didn't give me a working version just from one prompt. Part of those hours were actually spent finding test vectors, and testing the algorithms with those. My concensus on this? AI can't be used to write code for you, and you actually have to know what the code does for AI to be of any use to you. Instead, AI can be efficiently used to quickly write a rough draft for you, which you can then edit and revise the code. I can only assume this works somewhat like that for other subjects you use AI on.

**[Note]** If you are to use AI in your programs, like I do, I would highly recommend using ChatGPT over Google Gemini. Currently, as of writing this post, I find Gemini to still have too many safety restrictions concerning programming. I originally thought I would love it since it was free and allowed importing files and photos, but, even when using Gemini in my encryptor, it said that the algorithms I were choosing weren't to be made on my own since implementations already exist and using my own implementation could be insecure (I knew the risks already), and it refused to write the code no matter what prompt I tried.

![Encryptor Test Image](img/encryptor-test.png)
^Image of my encryptor during a test.^

# Agario.fun Private Server Project

This project wasn't my original summer plan. I had originally planned to make an idle game using Python with QT, and to release it on Steam, but that'll wait, because I revisited the old topic of Agar.io. I had remembered that Ardaninho on Github revised MultiOgarII for use in Agario.fun, and I figured that I could spend my free time learning Javascript with Node.js, and that is what inspired me to start this project. This is still a work in progress so I won't talk too much about it. You can find more on my next blog post.

![Agariofun Private Server source code](img/privateserversource.png)
^Image of my Agario.fun Private Server source code.^

# This Website

This website was the most recent of my projects, as of writing this post. I actually started this project before finishing the Agario.fun server, so yes, I know, I can't stay focused on one project at a time. But, I can say that I had, in my opinion, good enough reason to create and start this website. I felt like I needed a place to put all my projects together. If someone wants to know about me or what I've programmed, they can come here and find all of my projects, or the links to them, in one place. If you want to learn more about my reasons to make this website using Github Pages, you can check out my [Biography](about.html). Now to the actually programming side of things.

## Code Crafting

Remember how I said that I use ChatGPT a lot in my programs earlier? Well, I can tell you, like I said did in that note, it didn't help me with error checking at all here. What I did get right though, is that it still needs a lot of work. Anyways, back to the website. I was looking at some blog site templates online, and they all seemed like too much to look at. So I figured I would make something simpler and easy to use. I first designed the site with the idea of making each post a seperate HTML file, but I figured it would be faster and easier overall to make a function that parses markdown files. I know a library for that already exists, but, stemming from my use of C++, I hate using external libraries. Because of that, I decided to make my own, and that turned into what the website is today. I did use ChatGPT helping with the about page, because I had no idea flex containers existed, and didn't know how to dynamically position the contact and photo boxes. There are still some bugs, like the fact that anyone can load onto the post.html, and the website just load an empty page, because there is no blog post for it, unless navigated to from the index page. I also tried to sort the CSS file to make it easier to read, as from what I've seen, most CSS files for websites and apps are difficult to read if they aren't organized. Overall though, I think the website turned out great, and it was fun to make.

# Relevant Links

**[Note]** Links open in new tabs.

Python Encryptor Project - [https://github.com/aydon14/Python-Encryptor](https://github.com/aydon14/Python-Encryptor)

Agario.fun Private Server Project - [https://github.com/aydon14/Agario.fun-Private-Server](https://github.com/aydon14/Agario.fun-Private-Server)

Ardaninho's Github Page - [https://github.com/Ardaninho](https://github.com/Ardaninho)

Ardaninho's Agario.fun Server - [https://github.com/Ardaninho/ArdaninhoAgarServer](https://github.com/Ardaninho/ArdaninhoAgarServer)

Node.js - [https://nodejs.org/en](https://nodejs.org/en)

Website Source - [https://github.com/aydon14/aydon14.github.io](https://github.com/aydon14/aydon14.github.io)
