---
layout: post
title:  "VMI Cyberfusion Scavenger Hunt Writeup"
date:   2026-03-02 15:47:45 -0400
categories: CTF
---

[Scavenger hunt](http://Scavengerhunt.challenges.virginiacyberrange.net) is a challenging CTF that was shown at VMI Cyberfusion. It consists of **6 hints** that help tell you how to break into the many layers of ciphers and encodings that the original flag was wrapped around. Cyberchef is a very useful tool for this challenge I would recommend to follow along, fortunately it's a web tool so you don't need to install it, just go to [gchq.github.io/CyberChef](https://gchq.github.io/CyberChef/).

![How the website looks at the beginning](/assets/scavenger-hunt/website.png)

You'll begin at this screen. The only thing of value here is the key, which you should copy paste into Cyberchef. The 2nd thing you should do is inspect the source, which should give you the first hint: 

![The website html](/assets/scavenger-hunt/html.png)

So your first operation in cyberchef should be XOR by 50. This will give you a string that looks like Base85, it is **not**. Look for the 2nd hint next. We can do this by looking at the metadata for the hat picture, called `IhavesomeInfo_af.jpg`.

![Metadata for the first picture](/assets/scavenger-hunt/metadata.png)

This tells us that this picture contains our next two hints, with hint 2 saying the passphrase is my favorite dinosaur. The author's dinosaur is the stegosaurus, which is a pun for Steganography. This means that the value we need is in the picture, and we will use the tool "steghide" to unveil it. By running `steghide extract -sf IhavesomeInfo_af.jpg` with the password, stegosaurus, we are given `information.txt`

![The steghide output after entering stegosaurus](/assets/scavenger-hunt/steghide.png)

This extractions give us the following text file:

![Information.txt output](/assets/scavenger-hunt/hint2.png)

Which is hex that when decoded becomes:

*A message to send,*
*But keep it hidden, secret,*
*Let's transform and blend.*

*Encode with hex code,*
*A system of numbers to start,*
*Rotate by negating load.*

*Shift all letters by one,*
*Then encode, with hex, unfold,*
*And reveal what's begun.*

*This simple technique,*
*Will keep your message secure,*
*Safe from prying sneak.*

*So when you need to hide,*
*Your words from view and sight,*
*Rotate, hex, and slide.*

This is our 2nd step in the decoding process. To put it in human readable terms, it is saying to encode to hex, shift the letters to the left, and decode the hex. Cyberchef lets us do this with the encode to hex option, ROT13 with a value of -1, and decode from hex.

For the next section of the task, the `IhavesomeInfo_af` has a message if you run `strings` on it. (This can also be done in cyberchef)
![Strings command on first image](/assets/scavenger-hunt/stringAF.png)
![String output on first image](/assets/scavenger-hunt/hint3.png)

Decoding this gives us this text:

*As I examined the code, I detected the telltale signs of a base cipher layered 64fold, yet something was amiss. To add an extra layer of mystery, the author had obfuscated the exact nature of the code, leading me to deduce that a flipping of the alphabet had been employed. By creating a mapping between each decoded letter and its corresponding flipped counterpart in the reversed alphabet, the author had effectively disguised their true intentions. To decipher the message, I would have to replace each letter with its flipped counterpart and rewrite the text.*

This lets us know the next section is encoded in base64, which we can decode with cyberchef. Once this is done, we can move on to the next step hinted in this text.

In the website, there is a hidden image. This shows a hebrew atbash cipher, which inverts the letters in a plaintext. You can see it in the page inspection. 

![The hidden image](/assets/scavenger-hunt/atbash.png)

This is a **red herring**. The atbash cipher is not used anywhere in this challenge, the only use for this image is to look in the strings to get the next two hints. The metadata says that the image is the 4th hint, while the 5th hint is inside it. By using strings, we can find this last hint.

![The atbash image metadata](/assets/scavenger-hunt/hint4.png)
![The atbash image strings output](/assets/scavenger-hunt/hint5.png)

The hint is that robots are taking over, and the best way to stop them is to blacklist them in `robots.txt`, so we go there to reach the final section of this cursed puzzle.
![robots.txt text file](/assets/scavenger-hunt/hint6.png)

This challenge has already lied to you once, and the brute force line is another fabrication made to throw you off. The last line is the true hint, with the phrase b**XOR1**i1ing. This is the 2nd to last step in cyberchef, so add an XOR of 0x1 to the list. 

The last hint, REVentiually, is just another wordplay that means reverse the string. By the time you see this, it should be easy and the flag should be at hand.

With all of this, here is what cyberchef looks like:

![The final cyberchef output](/assets/scavenger-hunt/answer.png)

For a quick review, here is every step in order

1. Run XOR with 0x50
2. Hex-Shift-Text:
	1. convert string to HEX
	2. Use ROT-1 (Rot25)
	3. Convert HEX to text
3. Decode with Base64
4. XOR by 0x1
5. Reverse the string
