---
title: "Machine Learning: Extremely Possible on Radeon 7600 XT with Linux"
date: 2025-07-27
---
There's a certain satisfaction that comes with making your computer work hard. As I type this, I am training [nanoGPT](https://github.com/karpathy/nanoGPT) on the Shakespeare dataset that Karpathy has provided. My AMD Radeon RX 7600 XT has turned my SFF PC into a small space heater.

If I had the money and was starting from scratch, I'd pick up the cheapest NVIDIA card with 12+GB of VRAM. But I don't want to drop $1,000 on a GPU when we have GPU at home. [gpu at home](https://www.gigabyte.com/Graphics-Card/GV-R76XTGAMING-OC-16GD-rev-10-11)

The 7600 XT is great because for an affordable price (about $350) you can get 16GB of VRAM, which increasingly feels like the spec that matters most in any computing purchase these days.

The only major drawback, and it is major, is ROCm. You see, the popular ML libraries like Pytorch and Tensorflow were mostly built around CUDA, which is NVIDIA's proprietary API layer to the GPU that is optimized for work like this. AMD's equivalent is ROCm and it is not as well supported. But that doesn't mean it's impossible to use.

## Not officially supported
If you look at [compatability tables](https://rocm.docs.amd.com/projects/radeon/en/latest/docs/compatibility/native_linux/native_linux_compatibility.html) as of now, the Radeon 7600 XT is not listed as being officially supported by ROCm. But the 7700 XT is! That gave me hope.

You will also note that only Ubuntu and RHEL are listed as officially supported distributions. Despite this, I decided to give Fedora 42 a spin, since it's close enough to RHEL, has newer packages than Ubuntu, and personal preference.

## Installing ROCm on Fedora
Thanks to this [handy blog post](https://medium.com/@seancheo/running-generative-ai-on-amd-in-fedora-40-28aa3bebb187), I was able to find the magical command to install all the packages I needed for ROCm. If anything, I probably installed *too many* packages, but I really do not mind.

```
sudo dnf install hipblas-devel hipblaslt-devel hipcc hipcc-libomp-devel hipcub-devel hipfft-devel hipfort-devel hiprand-devel hiprt-devel hipsolver-devel hipsparse-devel rocalution-devel rocblas-devel rocfft-devel rocm-clang-devel rocm-clang-tools-extra-devel rocm-cmake rocm-comgr-devel rocm-core-devel rocm-hip-devel rocm-libc++-devel rocm-libc++-static rocm-llvm-devel rocm-omp-devel rocm-runtime-devel rocm-rpp-devel rocm-smi-devel rocminfo rocdecode-devel rocjpeg-devel rocprim-devel rocrand-devel rocsolver-devel rocsparse-devel rocthrust-devel roctracer-devel miopen
```
There is talk of Red Hat making this easier in the future via a metapackage.

Oh, and if you're doing this on a slow internet connection: I am so sorry. Just to get all of this running, I probably downloaded close to 15GB of files.

## Installing Pytorch for ROCm
While I have been using conda for Python package management, I decided to switch to pip as that seemed to be the preferred way to do things.

After installing pip3 on Fedora, I created a new virtual environment and then grabbed the command from [Pytorch's guide](https://pytorch.org/get-started/locally/) to install the latest ROCm version of Pytorch.

In my case, the command looked like this:
```
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.3
```
But do check the link above as it may have changed.

**Make sure to install this special Pytorch version into your newly created virtual environment**. I accidentally installed it globally at first.

If you get errors about NVIDIA not being found when you try to run ML code, you need to uninstall your existing version of Pytorch, then re-install using the method I just described.

## Running nanoGPT
[nanoGPT](https://github.com/karpathy/nanoGPT) is a tiny LLM that is capable of running on consumer hardware - even devices without a dedicated GPU.

I ran these three commands to get it to work.

```
python data/shakespeare_char/prepare.py
python train.py config/train_shakespeare_char.py
python sample.py --out_dir=out-shakespeare-char
```

If you run this without modifying train_shakespeare_char.py, you'll likely run into issues. I made a couple of small changes to the config file. At the very bottom, I changed my device to cuda and disabled compile.

```
device = 'cuda'  # run on cpu only
compile = False # do not torch compile the model
```
That is it.

After about 20 minutes of training and heating up my bedroom, I managed to get my outputs.

```

Be even but well, here is not some stinking.

KING RICHARD II:
Why, thanks, that we back to the love
Of that pardon'd with the love of the death.

BUSHY:
Not so swift as with me.

BONA:
Come, you were no more your manners.

DUKE OF YORK:
Lord of Warwick, she cannot but lay not this.

EXETER:
Now, now, in her which now may we would not do thee dispose,
That she a man as the great I do, and remember
To bid me the one of my old country.

DUKE VINCENTIO:
And rather be less not to be stranged;
Made m
```
It's not exactly Shakespeare, but I did get my GPU to speak to me.

If you have any questions, find me on X or Mastodon (see footer).
