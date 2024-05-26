# 2D-Web-Based-CAD

> Disusun untuk memenuhi Tugas 2 IF3260 Grafika Komputer WebGL Part 2: 3D Engine

## Cara Instalasi Program

1. Lakukan `git clone` terhadap repository ini
2. Jalankan perintah `pnpm i ` pada terminal untuk menginstalasi dependency proyek ini.

## Cara Menjalankan Program

1. Masuk ke folder `src` dan jalankan perintah `pnpm run dev` untuk menjalankan aplikasi pada port 5173
2. Aplikasi dapat diakses pada `http://localhost:5173/` 

## Pembagian Tugas

#### Gibran Darmawan - 13520061
* Base class camera
#### Naufal Syifa Firdaus - 13521050
* Component graph
* Base class animasi
* Animation Controller
* Fitur Lanjutan Tweening
#### Sofyan Firdaus - 13521083
* Base class material
#### Angela Livia Arumsari - 13521094
* Base class Node, Mesh, Buffer
* Webgl utils dan library Vector3 dan Matrix4
* Implementasi orthographic, oblique, perspective camera dan orbit control
* Implementasi geometri sederhana
* Transformasi node
* Directional light dan fitur lanjutan point light
* Implementasi basic material dan phong material
* Save load
* Fitur lanjutan GPU selection
* Fitur lanjutan component editor

## Model
Seluruh model terletak pada folder test

#### Naufal Syifa Firdaus - 13521050
* model-anim-translasi
* model-anim-scale
#### Angela Livia Arumsari - 13521094
* Articulated: danbo
* Hollow: hollow-cube
* Subtree: subtree-model (Contoh file untuk import subtree pada component editor)