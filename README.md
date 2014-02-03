AndroidDrawablesView
====================

**adv.js** is a static HTML generator script. It produces an inventory of **Android Image Drawables** for a given Android project.

Need a way to see all your drawable images in 1 place? Without having to upload your resources, or have to use obscure software? This script should do it.

# How to Use


```
node /path/to/adv.js /path/to/android/project/[res]/ 
```


### Things to note:

* **index.html** will be generated in the present working directory (**pwd**)
* if there's no drawable the cell background is yellow
* images in the html are being pulled from their absolute location, no file duplication


### Valid Drawable Directories

* drawable
* drawable-hdpi
* drawable-ldpi
* drawable-mdpi
* drawable-xhdpi
* drawable-xxhdpi
* drawable-xxxhdpi

## Feel free to
**fork**, *contribute*, etc